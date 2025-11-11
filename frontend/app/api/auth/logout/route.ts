import { NextResponse } from 'next/server';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.INTERNAL_API_URL ??
  'http://localhost:4000/api';

export async function POST() {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, { method: 'POST' });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Failed to reach backend logout endpoint', error);
    return NextResponse.json(
      { message: 'Unable to reach authentication service. Please try again later.' },
      { status: 502 }
    );
  }
}
