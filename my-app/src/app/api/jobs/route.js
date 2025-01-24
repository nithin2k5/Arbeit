import { NextResponse } from 'next/server';
import { connect } from '../../../config/db';
import { ObjectId } from 'mongodb';

async function generateUniqueJobId(db) {
  while (true) {
    // Generate a random 3-digit number
    const jobId = Math.floor(Math.random() * 900 + 100).toString();
    
    // Check if this ID already exists
    const existingJob = await db.collection('jobs').findOne({ jobId });
    
    // If no job exists with this ID, return it
    if (!existingJob) {
      return jobId;
    }
  }
}

export async function GET() {
  try {
    const db = await connect();
    const jobs = await db.collection('jobs')
      .find({ 
        status: 'Active' // Only return active jobs
      })
      .project({
        // Include only necessary fields, exclude sensitive info
        _id: 1,
        jobId: 1,
        title: 1,
        companyName: 1,
        location: 1,
        jobType: 1,
        department: 1,
        description: 1,
        requirements: 1,
        benefits: 1,
        qualification: 1,
        salaryMin: 1,
        salaryMax: 1,
        hideSalary: 1,
        postedDate: 1,
        status: 1,
        applicants: 1,
        // Exclude sensitive fields like companyEmail, bid, etc.
      })
      .sort({ postedDate: -1 })
      .toArray();
    
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = await connect();
    const data = await request.json();

    // If jobId is provided, fetch that specific job
    if (data.jobId) {
      // Convert jobId to string since it's stored as string in the database
      const jobId = data.jobId.toString();
      const job = await db.collection('jobs')
        .findOne(
          { 
            jobId,
            status: 'Active' // Only return active jobs
          },
          {
            projection: {
              // Include only necessary fields, exclude sensitive info
              _id: 1,
              jobId: 1,
              title: 1,
              companyName: 1,
              location: 1,
              jobType: 1,
              department: 1,
              description: 1,
              requirements: 1,
              benefits: 1,
              qualification: 1,
              salaryMin: 1,
              salaryMax: 1,
              hideSalary: 1,
              postedDate: 1,
              status: 1,
              applicants: 1,
              screeningQuestions: 1,
              hiringProcess: 1,
              // Exclude sensitive fields
            }
          }
        );
      
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
      
      return NextResponse.json(job);
    }
    
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error with job operation:', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}

// Remove PUT and DELETE methods as they should only be available in the business API 