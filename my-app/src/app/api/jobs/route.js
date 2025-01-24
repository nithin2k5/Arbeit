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
      .find({})
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
      const job = await db.collection('jobs').findOne({ jobId });
      
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
      
      return NextResponse.json(job);
    }
    
    // Otherwise, create a new job
    const jobId = await generateUniqueJobId(db);
    
    const job = {
      ...data,
      jobId,
      postedDate: new Date(),
      status: 'Active',
      applicants: 0
    };

    const result = await db.collection('jobs').insertOne(job);
    return NextResponse.json({ ...job, _id: result.insertedId });
  } catch (error) {
    console.error('Error with job operation:', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const db = await connect();
    const { _id, ...data } = await request.json();
    
    const result = await db.collection('jobs').findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: data },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const db = await connect();
    const { _id } = await request.json();
    
    const result = await db.collection('jobs').deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
} 