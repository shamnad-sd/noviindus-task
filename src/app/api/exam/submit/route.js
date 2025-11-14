import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { answers } = body;

    const exam_history_id = Math.floor(Math.random() * 1000000);
    const answered = answers.filter(a => a.selected_option_id != null).length;
    const not_attended = answers.filter(a => a.selected_option_id == null).length;

    return NextResponse.json({
      success: true,
      exam_history_id,
      score: answered,
      correct: 0,
      wrong: 0, 
      not_attended,
      submitted_at: new Date().toISOString(),
      details: [],
    });
  } catch (error) {
    console.error('Error submitting exam:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit exam' },
      { status: 500 }
    );
  }
}
