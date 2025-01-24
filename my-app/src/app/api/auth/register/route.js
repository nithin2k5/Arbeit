import {connect, disconnect} from '../../../../config/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try{
        const {Username, Password} = await request.json();

        const db= await connect();
        const collection = db.collection('users');

        const existingUser=await collection.findOne({Username});

        if(existingUser) 
            return Response.json({
                error:'Username already Exists'
            }, {status:400});
        
        const hashPassword=await bcrypt.hash(Password,10);
        const newUsr={
            Username,
            Password: hashPassword,
            role: 'user'  // Set default role for new users
        };

        await collection.insertOne(newUsr);
        
        return Response.json({
            message:"User Successfully Registered"
        },{status:200});
        
    }catch(err){
        return Response.json({
            error:"Internal Server Error"
        },{status:500})
    }finally{
        await disconnect();
    }
}