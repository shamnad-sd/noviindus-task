import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nexlearn.noviindusdemosites.in';

export async function POST(request) {
  try {
    const formData = await request.formData();

    const response = await axios.post(
      `${API_BASE_URL}/auth/create-profile`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Create profile error:', error);
    return NextResponse.json(
      { success: false, message: error.response?.data?.message || 'Failed to create profile' },
      { status: error.response?.status || 500 }
    );
  }
}
