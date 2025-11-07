import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Quiz.css";
import { data } from "../../assets/data";

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(data[0]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  const Option1 = useRef(null);
  const Option2 = useRef(null);
  const Option3 = useRef(null);
  const Option4 = useRef(null);
  const option_array = [Option1, Option2, Option3, Option4];

  useEffect(() => {
    if (result) return;
    if (timeLeft === 0) {
      setLock(true);
      option_array[question.answer - 1].current.classList.add("correct");
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, result]);

  const checkAns = (e, ans) => {
    if (!lock) {
      if (question.answer === ans) {
        e.target.classList.add("correct");
        setScore((prev) => prev + 1);
      } else {
        e.target.classList.add("wrong");
        option_array[question.answer - 1].current.classList.add("correct");
      }
      setLock(true);
    }
  };

  const next = () => {
    if (lock) {
      if (index === data.length - 1) {
        setResult(true);
        return;
      }
      const nextIndex = index + 1;
      setIndex(nextIndex);
      setQuestion(data[nextIndex]);
      setLock(false);
      setTimeLeft(15);
      option_array.forEach((option) => {
        option.current.classList.remove("wrong");
        option.current.classList.remove("correct");
      });
    }
  };

  const reset = () => {
    setIndex(0);
    setQuestion(data[0]);
    setScore(0);
    setLock(false);
    setResult(false);
    setTimeLeft(15);
    option_array.forEach((option) => {
      option.current.classList.remove("wrong");
      option.current.classList.remove("correct");
    });
  };

  const progress = ((index + 1) / data.length) * 100;

  return (
    <div className="container">
      <h1>Ultimate Quiz Challenge</h1>
      <div className="progress">
        <div className="progress-inner" style={{ width: `${progress}%` }}></div>
      </div>

      <hr />

      {result ? (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="result-box"
        >
          <h2>You scored {score} out of {data.length}</h2>
          <p>
            {score / data.length >= 0.8
              ? "Excellent! 🎉"
              : score / data.length >= 0.5
              ? "Good job 👍"
              : "Keep practicing 💪"}
          </p>
          <button onClick={reset}>Try Again</button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="timer">⏰ Time left: {timeLeft}s</div>
            <h2>
              {index + 1}. {question.question}
            </h2>
            <ul>
              <li ref={Option1} onClick={(e) => checkAns(e, 1)}>
                {question.option1}
              </li>
              <li ref={Option2} onClick={(e) => checkAns(e, 2)}>
                {question.option2}
              </li>
              <li ref={Option3} onClick={(e) => checkAns(e, 3)}>
                {question.option3}
              </li>
              <li ref={Option4} onClick={(e) => checkAns(e, 4)}>
                {question.option4}
              </li>
            </ul>
            <button onClick={next}>Next</button>
            <div className="index">
              {index + 1} of {data.length} questions
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Quiz;
