import { NextResponse } from 'next/server';
import { loadProxyLogs } from '@/lib/loadProxyLogs';

export async function GET() {
  try {
    const logs = await loadProxyLogs();
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
