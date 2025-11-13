'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore, useExamStore } from '@/lib/store';
import { examAPI, authAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';

function computeResultStats(questions, userAnswers) {
  let correct = 0;
  let wrong = 0;
  let not_attended = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const userAnswerId = userAnswers[q.id];

    if (userAnswerId == null || userAnswerId === undefined) {
      not_attended++;
    } else {
      // Rebuild the options array exactly as it was created in the exam
      const allOptions = [
        ...q.incorrect_answers.map((o, ix) => ({ id: ix + 1, option: o })),
        { id: 99, option: q.correct_answer }
      ];

      // Find the option the user selected
      const selectedOption = allOptions.find(opt => opt.id === userAnswerId);

      if (selectedOption) {
        // Compare the option text with the correct answer
        if (selectedOption.option === q.correct_answer) {
          correct++;
        } else {
          wrong++;
        }
      } else {
        // If somehow the option ID doesn't exist, count as not attended
        not_attended++;
      }
    }
  }

  return {
    score: correct,
    total_marks: questions.length,
    correct,
    wrong,
    not_attended
  };
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { resetExam } = useExamStore();
  

  const [results, setResults] = useState(null);

  useEffect(() => {
    try {
      const questionsStr = localStorage.getItem('last_quiz_questions');
      const answersStr = localStorage.getItem('last_quiz_answers');

      if (!questionsStr || !answersStr) {
        toast.error('No quiz data found!');
        router.push('/instructions');
        return;
      }

      const questions = JSON.parse(questionsStr);
      const userAnswers = JSON.parse(answersStr);

      if (!questions.length) {
        toast.error('No quiz questions found!');
        router.push('/instructions');
        return;
      }

      const stats = computeResultStats(questions, userAnswers);
      setResults(stats);
    } catch (error) {
      console.error('Error loading results:', error);
      toast.error('Error loading results');
      router.push('/instructions');
    }
  }, [router]);


  const handleDone = () => {
    // Clear the quiz data
    resetExam();
    localStorage.removeItem('last_quiz_questions');
    localStorage.removeItem('last_quiz_answers');
    router.push('/instructions');
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1B5A7E] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const percentage = Math.round((results.score / results.total_marks) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar/>
      {/* Results Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Score Display */}
          <div className="bg-gradient-to-br from-[#1B5A7E] to-[#2a7ca8] p-8 text-center">
            <p className="text-blue-100 text-lg mb-2">Marks Obtained:</p>
            <h1 className="text-6xl font-bold text-white mb-2">
              {results.score} / {results.total_marks}
            </h1>
            <p className="text-blue-100 text-xl mt-2">
              {percentage}%
            </p>
          </div>

          {/* Statistics */}
          <div className="p-8 space-y-4">
            {/* Total Questions */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-700">Total Questions:</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {results.total_marks}
              </span>
            </div>

            {/* Correct Answers */}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-700">Correct Answers:</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {String(results.correct).padStart(3, '0')}
              </span>
            </div>

            {/* Incorrect Answers */}
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-700">Incorrect Answers:</span>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {String(results.wrong).padStart(3, '0')}
              </span>
            </div>

            {/* Not Attended */}
            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-700">Not Attended Questions:</span>
              </div>
              <span className="text-2xl font-bold text-gray-600">
                {String(results.not_attended).padStart(3, '0')}
              </span>
            </div>

            {/* Done Button */}
            <button
              onClick={handleDone}
              className="w-full mt-6 py-4 bg-[#1B5A7E] text-white rounded-xl font-semibold text-lg hover:bg-[#13465F] transition-all hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Done
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1B5A7E] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}