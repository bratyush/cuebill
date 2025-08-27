import { NextRequest, NextResponse } from 'next/server';
import { getRevenueData } from '@/services/revenue-data';

export async function POST(request: NextRequest) {
  try {
    const { startRange, endRange } = await request.json();

    const data = await getRevenueData(startRange, endRange);

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 });
  }
}

