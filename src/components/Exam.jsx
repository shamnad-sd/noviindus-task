"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useExamStore } from "@/lib/store";
import { examAPI, authAPI } from "@/lib/api";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

const Exam = ()=> {
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
  const ALPHABETS = ["A", "B", "C", "D", "E", "F"];

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
      const originalQuestions = questions.map((q) => ({
        id: q.id,
        question: q.question,
        correct_answer: q.correct_answer,
        incorrect_answers: q.incorrect_answers,
        image: q.image,
      }));

      localStorage.setItem(
        "last_quiz_questions",
        JSON.stringify(originalQuestions)
      );
      localStorage.setItem("last_quiz_answers", JSON.stringify(answers));

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
    <div className="min-h-screen bg-[#F4FCFF]">
      <Navbar />
      {/* Main Content */}
      <div className=" mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Section - Question */}
          <div className="lg:col-span-7 xl:border-r xl:border-r-[#E9EBEC] xl:pr-6 xl:pl-2">
            <div className=" rounded-xl">
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-[18px] text-gray-900">
                  {examData?.instruction || "Ancient Indian History MCQ"}
                </h2>
                <span className="text-gray-600 bg-white px-3 rounded-sm font-medium">
                  {String(currentQuestion + 1).padStart(2, "0")}/
                  {questions.length}
                </span>
              </div>

              {/* Top section with white background */}
              <div className="bg-white p-4 rounded-sm shadow-sm">
                <button
                  onClick={() => setShowParagraph(true)}
                  className="mb-6 flex items-center text-[12px] sm:text-[16px] gap-2 px-4 py-3 cursor-pointer bg-[#177A9C] text-white rounded-lg hover:bg-[#13465F] transition-colors"
                >
                  {/* SVG icons */}
                  <svg
                    width="17"
                    height="14"
                    viewBox="0 0 17 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 0H1.25C0.918479 0 0.600537 0.131696 0.366116 0.366116C0.131696 0.600537 0 0.918479 0 1.25V12.5C0 12.8315 0.131696 13.1495 0.366116 13.3839C0.600537 13.6183 0.918479 13.75 1.25 13.75H15C15.3315 13.75 15.6495 13.6183 15.8839 13.3839C16.1183 13.1495 16.25 12.8315 16.25 12.5V1.25C16.25 0.918479 16.1183 0.600537 15.8839 0.366116C15.6495 0.131696 15.3315 0 15 0ZM3.125 4.0625C3.125 4.22826 3.05915 4.38723 2.94194 4.50444C2.82473 4.62165 2.66576 4.6875 2.5 4.6875C2.33424 4.6875 2.17527 4.62165 2.05806 4.50444C1.94085 4.38723 1.875 4.22826 1.875 4.0625V3.125C1.875 2.95924 1.94085 2.80027 2.05806 2.68306C2.17527 2.56585 2.33424 2.5 2.5 2.5H8.125C8.29076 2.5 8.44973 2.56585 8.56694 2.68306C8.68415 2.80027 8.75 2.95924 8.75 3.125V4.0625C8.75 4.22826 8.68415 4.38723 8.56694 4.50444C8.44973 4.62165 8.29076 4.6875 8.125 4.6875C7.95924 4.6875 7.80027 4.62165 7.68306 4.50444C7.56585 4.38723 7.5 4.22826 7.5 4.0625V3.75H5.9375V7.5H6.25C6.41576 7.5 6.57473 7.56585 6.69194 7.68306C6.80915 7.80027 6.875 7.95924 6.875 8.125C6.875 8.29076 6.80915 8.44973 6.69194 8.56694C6.57473 8.68415 6.41576 8.75 6.25 8.75H4.375C4.20924 8.75 4.05027 8.68415 3.93306 8.56694C3.81585 8.44973 3.75 8.29076 3.75 8.125C3.75 7.95924 3.81585 7.80027 3.93306 7.68306C4.05027 7.56585 4.20924 7.5 4.375 7.5H4.6875V3.75H3.125V4.0625ZM13.75 11.25H4.375C4.20924 11.25 4.05027 11.1842 3.93306 11.0669C3.81585 10.9497 3.75 10.7908 3.75 10.625C3.75 10.4592 3.81585 10.3003 3.93306 10.1831C4.05027 10.0658 4.20924 10 4.375 10H13.75C13.9158 10 14.0747 10.0658 14.1919 10.1831C14.3092 10.3003 14.375 10.4592 14.375 10.625C14.375 10.7908 14.3092 10.9497 14.1919 11.0669C14.0747 11.1842 13.9158 11.25 13.75 11.25ZM13.75 8.75H8.75C8.58424 8.75 8.42527 8.68415 8.30806 8.56694C8.19085 8.44973 8.125 8.29076 8.125 8.125C8.125 7.95924 8.19085 7.80027 8.30806 7.68306C8.42527 7.56585 8.58424 7.5 8.75 7.5H13.75C13.9158 7.5 14.0747 7.56585 14.1919 7.68306C14.3092 7.80027 14.375 7.95924 14.375 8.125C14.375 8.29076 14.3092 8.44973 14.1919 8.56694C14.0747 8.68415 13.9158 8.75 13.75 8.75ZM13.75 6.25H10C9.83424 6.25 9.67527 6.18415 9.55806 6.06694C9.44085 5.94973 9.375 5.79076 9.375 5.625C9.375 5.45924 9.44085 5.30027 9.55806 5.18306C9.67527 5.06585 9.83424 5 10 5H13.75C13.9158 5 14.0747 5.06585 14.1919 5.18306C14.3092 5.30027 14.375 5.45924 14.375 5.625C14.375 5.79076 14.3092 5.94973 14.1919 6.06694C14.0747 6.18415 13.9158 6.25 13.75 6.25Z"
                      fill="white"
                    />
                  </svg>
                  Read Comprehensive Paragraph
                  <svg
                    width="6"
                    height="12"
                    viewBox="0 0 6 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 5.62915L-5.30183e-07 11.2583L-3.80654e-08 -1.50442e-05L6 5.62915Z"
                      fill="white"
                    />
                  </svg>
                </button>

                {/* Question content */}
                <div className="mb-6">
                  <p
                    className="text-lg text-gray-800 mb-4"
                    dangerouslySetInnerHTML={{
                      __html: `${currentQuestion + 1}. ${currentQ.question}`,
                    }}
                  />

                  {currentQ.image && (
                    <img
                      src={currentQ.image}
                      alt="Question"
                      className="max-w-sm rounded-lg shadow-md mb-6"
                    />
                  )}
                </div>
              </div>

              {/* Options section (no white background) */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-4">Choose the answer:</p>

                <div className="space-y-5">
                  {currentQ.options.map((option, idx) => (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        answers[currentQ.id] === option.id
                          ? "border-[#1B5A7E] bg-white"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold w-6 h-6 flex items-center justify-center text-gray-700">
                          {ALPHABETS[idx]}.
                        </span>
                        <span
                          className="text-gray-700"
                          dangerouslySetInnerHTML={{ __html: option.option }}
                        />
                      </div>
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        value={option.id}
                        checked={answers[currentQ.id] === option.id}
                        onChange={() => handleAnswerSelect(option.id)}
                        className="w-5 h-5 text-black focus:ring-black accent-black ml-4"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleMarkForReview}
                  className="flex-1 py-2 px-4  bg-[#800080] text-white rounded-sm cursor-pointer hover:bg-[#551055] transition-colors"
                >
                  {markedForReview.has(currentQ.id)
                    ? "Unmark"
                    : "Mark for review"}
                </button>

                <button
                  onClick={() => currentQuestion > 0 && previousQuestion()}
                  disabled={currentQuestion === 0}
                  className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-sm cursor-pointer  hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <button
                  onClick={() =>
                    currentQuestion < questions.length - 1 && nextQuestion()
                  }
                  disabled={currentQuestion === questions.length - 1}
                  className="flex-1 py-2 px-4 bg-[#1C3141] text-white rounded-sm cursor-pointer  hover:bg-[#13465F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Question Navigator */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              {/* Timer */}
              <div className="mb-6 flex flex-col sm:flex-row  items-center justify-between">
                {/* Left side */}
                <h3 className="text-gray-900 pb-3 md:block hidden">Question No. Sheet:</h3>

                {/* Right side (time label + timer box together) */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-800">Remaining Time:</span>
                  <div className="flex items-center gap-2 bg-[#1C3141] text-white rounded-lg px-3 py-1">
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
                    <span className="text-base">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>
                <h3 className="text-gray-900 pt-4 md:hidden block">Question No. Sheet:</h3>
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
                {questions.map((q, index) => {
                  const status = getQuestionStatus(index);
                  return (
                    <button
                      key={q.id}
                      onClick={() => goToQuestion(index)}
                      className={`aspect-square rounded-sm  transition-all ${getStatusColor(
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
              <div className="space-y-2 text-sm grid grid-cols-1 md:grid-cols-4 lg:grid-cols-2 ">
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-[#4CAF50] rounded"></div>
                  <span className="text-gray-700">Attended</span>
                </div>
                <div className="flex  gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-gray-700">Not Attended</span>
                </div>
                <div className="flex  gap-2">
                  <div className="w-4 h-4 bg-[#800080] rounded"></div>
                  <span className="text-gray-700">Marked For Review</span>
                </div>
                <div className="flex  gap-2">
                  <div className="w-4 h-4 bg-[#4CAF50] border-2 border-[#800080] rounded"></div>
                  <span className="text-gray-700">
                    Answered and Marked For Review
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full mt-6 py-3 bg-[#177A9C] cursor-pointer text-white rounded-sm  hover:bg-[#13465F] transition-colors"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Paragraph Modal */}
      {showParagraph && (
        <div className="fixed inset-0 bg-black/70 p-5  flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 pt-4">
              <h2 className=" text-[#1C3141]">Comprehensive Paragraph</h2>
              <div className="border-b pt-3 border-[#CECECE]"></div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-gray max-w-none">
                <p className="text-[#1C3141] leading-relaxed whitespace-pre-line">
                  This quiz covers various topics from multiple categories
                  including entertainment, science, history, and more. Test your
                  general knowledge across different subjects and see how well
                  you perform!
                </p>
              </div>
            </div>
            <div className="p-6 flex justify-center sm:justify-end">
              <button
                onClick={() => setShowParagraph(false)}
                className="py-2 px-24 bg-[#1C3141] text-white rounded-[9px] cursor-pointer  hover:bg-[#13465F] transition-colors"
              >
                Minimize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/70  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-6 border-b border-[#CECECE] pb-4">
              <h2 className="text-[16px]  text-[#1C3141] font-[500]">
                Are you sure you want to submit the test?
              </h2>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-[#1C3141] cursor-pointer hover:text-gray-600"
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

            <div className="space-y-6 mb-6">
              {/* Remaining Time */}
              <div className="flex items-center justify-between">
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
                  <p className="text-sm text-gray-600">Remaining Time:</p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {formatTime(timeRemaining)}
                </p>
              </div>

              {/* Total Questions */}
              <div className="flex items-center justify-between ">
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
                  <p className="text-sm text-gray-600">Total Questions:</p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {getSubmitStats().total}
                </p>
              </div>

              {/* Questions Answered */}
              <div className="flex items-center justify-between ">
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
                  <p className="text-sm text-gray-600">Questions Answered:</p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {String(getSubmitStats().answered).padStart(3, "0")}
                </p>
              </div>

              {/* Marked for Review */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#800080] rounded-lg flex items-center justify-center">
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
                  <p className="text-sm text-gray-600">Marked for review:</p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {String(getSubmitStats().marked).padStart(3, "0")}
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmitExam}
              disabled={submitting}
              className="w-full py-3 rounded-xl  bg-[#1C3141] text-white text-[16px] cursor-pointer hover:bg-[#13465F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Test"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Exam