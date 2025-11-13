import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    return NextResponse.json({
      success: true,
      exam_history_id: id,
      score: 7,
      total_marks: 10,
      correct: 7,
      wrong: 2,
      not_attended: 1,
      submitted_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
