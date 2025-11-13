import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=50&type=multiple');
    const data = await response.json();
    
    if (data.results && data.results.length) {
      const questions = data.results.map((q, idx) => {
        const allOptions = [
          ...q.incorrect_answers.map((o, i) => ({ id: i + 1, option: o })),
          { id: 99, option: q.correct_answer }
        ].sort(() => Math.random() - 0.5);
        
        return {
          id: idx + 1,
          question: q.question,
          options: allOptions,
          correct_answer: q.correct_answer,
          incorrect_answers: q.incorrect_answers, 
          image: null
        };
      });

      return NextResponse.json({
        success: true,
        questions,
        total_time: 90,
        instruction: "General Knowledge Quiz"
      });
    }
    
    return NextResponse.json(
      { success: false, message: 'No questions loaded' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}