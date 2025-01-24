import { connect, disconnect } from '../../../config/db';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '../../../config/jwt';

// Get user profile
export async function GET(request) {
    try {
        console.log('GET /api/profile - Start');
        // Verify authentication
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken');
        
        console.log('Access token present:', !!accessToken);
        
        if (!accessToken) {
            console.log('No access token found');
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        try {
            const decoded = verifyAccessToken(accessToken.value);
            console.log('Token decoded, username:', decoded.username);
            
            const db = await connect();
            console.log('Database connected');
            
            const collection = db.collection('users');
            
            const user = await collection.findOne(
                { email: decoded.username },
                { projection: { Password: 0 } }
            );
            
            console.log('User found:', !!user);

            if (!user) {
                console.log('User not found in database');
                return new Response(JSON.stringify({ error: 'User not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            return new Response(JSON.stringify(user), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error('Error in inner try block:', error);
            return new Response(JSON.stringify({ error: 'Invalid token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        console.error('Error in outer try block:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        await disconnect();
        console.log('GET /api/profile - End');
    }
}

// Update user profile
export async function PUT(request) {
    let db;
    try {
        // Verify authentication
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken');
        
        if (!accessToken) {
            return new Response(JSON.stringify({ error: 'Please log in to update your profile' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        try {
            const decoded = verifyAccessToken(accessToken.value);
            const profileData = await request.json();

            // Connect to database
            db = await connect();
            const collection = db.collection('users');

            // Remove sensitive fields that shouldn't be updated directly
            const {
                Password,
                currentPassword,
                newPassword,
                confirmPassword,
                _id,
                email,
                role,
                ...updateData
            } = profileData;

            // Validate required fields
            if (!updateData.fullName?.trim()) {
                return new Response(JSON.stringify({ error: 'Full name is required' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Validate URLs if provided
            const urlFields = ['githubProfile', 'linkedinProfile', 'portfolioWebsite'];
            for (const field of urlFields) {
                if (updateData[field] && !isValidUrl(updateData[field])) {
                    return new Response(JSON.stringify({ 
                        error: `Invalid URL format for ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`
                    }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            }

            // Update the profile
            const result = await collection.updateOne(
                { email: decoded.username },
                { 
                    $set: {
                        ...updateData,
                        updatedAt: new Date()
                    }
                }
            );

            if (result.matchedCount === 0) {
                return new Response(JSON.stringify({ error: 'User profile not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            if (result.modifiedCount === 0) {
                return new Response(JSON.stringify({ error: 'No changes were made to the profile' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            return new Response(JSON.stringify({ 
                message: 'Profile updated successfully',
                modifiedCount: result.modifiedCount
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return new Response(JSON.stringify({ error: 'Your session has expired. Please log in again.' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            if (error.name === 'JsonWebTokenError') {
                return new Response(JSON.stringify({ error: 'Invalid authentication token' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        return new Response(JSON.stringify({ 
            error: 'An error occurred while updating your profile. Please try again.' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        if (db) await disconnect();
    }
}

// Helper function to validate URLs
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
} 