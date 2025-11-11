import { NextResponse } from 'next/server';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.INTERNAL_API_URL ??
  'http://localhost:4000/api';

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Failed to reach backend refresh endpoint', error);
    return NextResponse.json(
      {
        message:
          'Unable to reach authentication service. Please try again later.',
      },
      { status: 502 },
    );
  }
}
