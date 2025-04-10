"use server";

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
  req: NextRequest,
  context: { params: { tripId: string } }
) {
  const { tripId } = context.params;

  try {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}`);

    if (!response.ok) throw new Error('Failed to fetch trip');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching trip:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trip' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { tripId: string } }
) {
  const { tripId } = context.params;

  try {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete trip');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return NextResponse.json(
      { error: 'Failed to delete trip' },
      { status: 500 }
    );
  }
}

