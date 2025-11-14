export default function computeResultStats(questions, userAnswers) {
  let correct = 0;
  let wrong = 0;
  let not_attended = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const userAnswerId = userAnswers[q.id];

    if (userAnswerId == null || userAnswerId === undefined) {
      not_attended++;
    } else {
      const allOptions = [
        ...q.incorrect_answers.map((o, ix) => ({ id: ix + 1, option: o })),
        { id: 99, option: q.correct_answer }
      ];

      const selectedOption = allOptions.find(opt => opt.id === userAnswerId);

      if (selectedOption) {
        if (selectedOption.option === q.correct_answer) {
          correct++;
        } else {
          wrong++;
        }
      } else {
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
