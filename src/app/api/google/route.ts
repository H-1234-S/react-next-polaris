import { createVertex } from '@ai-sdk/google-vertex';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

const vertex = createVertex({
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: process.env.GOOGLE_CLOUD_LOCATION!,
});

export async function POST() {
  try {
    const result = await generateText({
      model: vertex('gemini-2.5-flash'),
      prompt: 'Write a vegetarian lasagna recipe for 4 people.',
    });

    return NextResponse.json({
      text: result.text,
    });
  } catch (error) {
    console.error('报错详情:', error);

    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}