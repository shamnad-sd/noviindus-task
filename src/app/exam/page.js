"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useExamStore } from "@/lib/store";
import { examAPI, authAPI } from "@/lib/api";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function ExamPage() {
  const router = useRouter();
  const { isAuthenticated, checkAuth, logout } = useAuthStore();
  const {
    questions,
    examData,
    currentQuestion,
    answers,
    timeRemaining,
    examStarted,
    setExamData,
    startExam,
    setAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    decrementTime,
    getFormattedAnswers,
  } = useExamStore();

  const [loading, setLoading] = useState(true);
  const [showParagraph, setShowParagraph] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [markedForReview, setMarkedForReview] = useState(new Set());

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      const authenticated = checkAuth();
      if (!authenticated) {
        router.push("/auth/login");
        return;
      }

      try {
        const response = await examAPI.getQuestions();
        if (response.success) {
          setExamData(response);
        } else {
          // toast.error("Failed to load questions");
          // router.push("/instructions");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        // toast.error("Error loading exam");
        // router.push("/instructions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [checkAuth, router, setExamData]);

  // Start exam when loaded
  useEffect(() => {
    if (questions.length > 0 && !examStarted && !loading) {
      startExam();
    }
  }, [questions, examStarted, loading, startExam]);

  // Timer countdown
  useEffect(() => {
    if (!examStarted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeRemaining, decrementTime]);

  // Auto-submit when time is up
  useEffect(() => {
    if (timeRemaining === 0 && examStarted) {
      handleSubmitExam();
    }
  }, [timeRemaining, examStarted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  

  const handleAnswerSelect = (optionId) => {
    setAnswer(questions[currentQuestion].id, optionId);
  };

  const handleMarkForReview = () => {
    const questionId = questions[currentQuestion].id;
    const newMarked = new Set(markedForReview);

    if (newMarked.has(questionId)) {
      newMarked.delete(questionId);
      toast.success("Removed from review");
    } else {
      newMarked.add(questionId);
      toast.success("Marked for review");
    }

    setMarkedForReview(newMarked);
  };

  const getQuestionStatus = (index) => {
    const question = questions[index];
    const isAnswered = answers[question.id] !== undefined;
    const isMarked = markedForReview.has(question.id);

    if (isAnswered && isMarked) return "answered-marked";
    if (isMarked) return "marked";
    if (isAnswered) return "answered";
    return "not-attended";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "answered":
        return "bg-green-500 text-white";
      case "not-attended":
        return "bg-red-500 text-white";
      case "marked":
        return "bg-purple-600 text-white";
      case "answered-marked":
        return "bg-[#1B5A7E] border-2 border-purple-600 text-white";
      default:
        return "bg-white text-gray-700 border border-gray-300";
    }
  };

  const handleSubmitExam = async () => {
    setSubmitting(true);

    try {
      const formattedAnswers = getFormattedAnswers();
      const response = await examAPI.submitAnswers(formattedAnswers);

      // Store the original API questions (with correct_answer and incorrect_answers)
      const originalQuestions = questions.map(q => ({
        id: q.id,
        question: q.question,
        correct_answer: q.correct_answer,
        incorrect_answers: q.incorrect_answers,
        image: q.image
      }));

      localStorage.setItem('last_quiz_questions', JSON.stringify(originalQuestions));
      localStorage.setItem('last_quiz_answers', JSON.stringify(answers));

      if (response.success) {
        toast.success("Exam submitted successfully!");
        router.push(`/results?id=${response.exam_history_id}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Error submitting exam");
    } finally {
      setSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  const getSubmitStats = () => {
    const answered = Object.keys(answers).length;
    const marked = markedForReview.size;
    const total = questions.length;

    return { answered, marked, total };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1B5A7E] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No questions available</p>
          <button
            onClick={() => router.push("/instructions")}
            className="px-6 py-2.5 bg-[#1B5A7E] text-white rounded-lg font-semibold hover:bg-[#13465F] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  // Safety check
  if (!currentQ || !currentQ.options) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Error loading question</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar/>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Question */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  {examData?.instruction || "General Knowledge Quiz"}
                </h2>
                <span className="text-gray-600 font-medium">
                  {String(currentQuestion + 1).padStart(2, "0")}/
                  {questions.length}
                </span>
              </div>

              {/* Read Paragraph Button */}
              <button
                onClick={() => setShowParagraph(true)}
                className="mb-6 flex items-center gap-2 px-4 py-2 bg-[#1B5A7E] text-white rounded-lg hover:bg-[#13465F] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Read Comprehensive Paragraph
              </button>

              {/* Question */}
              <div className="mb-6">
                <p
                  className="text-lg text-gray-800 mb-4"
                  dangerouslySetInnerHTML={{
                    __html: `${currentQuestion + 1}. ${currentQ.question}`,
                  }}
                />

                {/* Question Image if exists */}
                {currentQ.image && (
                  <img
                    src={currentQ.image}
                    alt="Question"
                    className="max-w-sm rounded-lg shadow-md mb-6"
                  />
                )}

                <p className="text-sm text-gray-600 mb-4">Choose the answer:</p>

                {/* Options */}
                <div className="space-y-3">
                  {currentQ.options.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        answers[currentQ.id] === option.id
                          ? "border-[#1B5A7E] bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        value={option.id}
                        checked={answers[currentQ.id] === option.id}
                        onChange={() => handleAnswerSelect(option.id)}
                        className="w-5 h-5 text-[#1B5A7E] focus:ring-[#1B5A7E]"
                      />
                      <span 
                        className="ml-3 text-gray-700"
                        dangerouslySetInnerHTML={{ __html: option.option }}
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleMarkForReview}
                  className="flex-1 py-3 px-6 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                  {markedForReview.has(currentQ.id)
                    ? "Unmark"
                    : "Mark for review"}
                </button>
                <button
                  onClick={() => currentQuestion > 0 && previousQuestion()}
                  disabled={currentQuestion === 0}
                  className="px-8 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    currentQuestion < questions.length - 1 && nextQuestion()
                  }
                  disabled={currentQuestion === questions.length - 1}
                  className="px-8 py-3 bg-[#1B5A7E] text-white rounded-xl font-semibold hover:bg-[#13465F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              {/* Timer */}
              <div className="mb-6 flex items-center justify-between bg-gray-900 text-white rounded-lg px-4 py-3">
                <span className="font-semibold">Remaining Time:</span>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xl font-bold">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-4">
                Question No. Sheet:
              </h3>

              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((q, index) => {
                  const status = getQuestionStatus(index);
                  return (
                    <button
                      key={q.id}
                      onClick={() => goToQuestion(index)}
                      className={`aspect-square rounded-lg font-semibold transition-all ${getStatusColor(
                        status
                      )} ${
                        currentQuestion === index
                          ? "ring-4 ring-[#1B5A7E] ring-opacity-50"
                          : ""
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-700">Attended</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-gray-700">Not Attended</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-600 rounded"></div>
                  <span className="text-gray-700">Marked For Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#1B5A7E] border-2 border-purple-600 rounded"></div>
                  <span className="text-gray-700">
                    Answered and Marked For Review
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full mt-6 py-3 bg-[#1B5A7E] text-white rounded-xl font-semibold hover:bg-[#13465F] transition-colors"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Paragraph Modal */}
      {showParagraph && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Comprehensive Paragraph
              </h2>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  This quiz covers various topics from multiple categories including entertainment, science, history, and more. Test your general knowledge across different subjects and see how well you perform!
                </p>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => setShowParagraph(false)}
                className="px-8 py-3 bg-[#1B5A7E] text-white rounded-xl font-semibold hover:bg-[#13465F] transition-colors"
              >
                Minimize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Are you sure you want to submit the test?
              </h2>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Remaining Time:</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatTime(timeRemaining)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Total Questions:</p>
                  <p className="text-lg font-bold text-gray-900">
                    {getSubmitStats().total}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Questions Answered:</p>
                  <p className="text-lg font-bold text-gray-900">
                    {String(getSubmitStats().answered).padStart(3, "0")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Marked for review:</p>
                  <p className="text-lg font-bold text-gray-900">
                    {String(getSubmitStats().marked).padStart(3, "0")}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmitExam}
              disabled={submitting}
              className="w-full py-3 bg-[#1B5A7E] text-white rounded-xl font-semibold hover:bg-[#13465F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Test"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}