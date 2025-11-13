import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nexlearn.noviindusdemosites.in';

export async function POST(request) {
  try {
    // Get token from authorization header
    const authHeader = request.headers.get('authorization');
    
    const response = await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        headers: authHeader ? { 'Authorization': authHeader } : {},
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: error.response?.data?.message || 'Failed to logout' },
      { status: error.response?.status || 500 }
    );
  }
}