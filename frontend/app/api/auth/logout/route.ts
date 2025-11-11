import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function POST() {
  const response = await fetch(`${API_URL}/auth/logout`, { method: 'POST' });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
