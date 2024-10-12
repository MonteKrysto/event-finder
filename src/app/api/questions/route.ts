// app/api/questions/route.ts
import { NextResponse } from 'next/server';

// In-memory storage to simulate localStorage
let storedQuestions: any[] = [];

// Handle POST request to store questions
export async function POST(request: Request) {
  const body = await request.json();

  if (!body.questions) {
    return NextResponse.json({ error: 'Questions are required' }, { status: 400 });
  }

  // Store questions in the in-memory array
  storedQuestions = body.questions;
  return NextResponse.json({ message: 'Questions stored successfully' });
}

// Handle GET request to retrieve questions
export async function GET() {
  // Return the stored questions from memory
  return NextResponse.json({ questions: storedQuestions });
}
