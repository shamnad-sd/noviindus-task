import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { answers } = body;

    // In a real application, you would:
    // 1. Verify the user's token
    // 2. Store the answers in your database
    // 3. Calculate the actual score
    // 4. Return the exam history ID from your database

    const exam_history_id = Math.floor(Math.random() * 1000000);
    const answered = answers.filter(a => a.selected_option_id != null).length;
    const not_attended = answers.filter(a => a.selected_option_id == null).length;

    return NextResponse.json({
      success: true,
      exam_history_id,
      score: answered,
      correct: 0, // Would be calculated server-side
      wrong: 0, // Would be calculated server-side
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
