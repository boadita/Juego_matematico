import React, { useState } from "react";
import "./Question.css"; // Archivo de estilos

const Question = ({ question, onAnswer }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correct = parseFloat(userAnswer) === question.correctAnswer;
    setIsCorrect(correct);

    setTimeout(() => {
      setIsCorrect(null);
      onAnswer(userAnswer);
      setUserAnswer("");
    }, 1000);
  };

  return (
    <div className="question-container">
      <h2 className="slide-in">
        {question.num1} {question.operation} {question.num2} = ?
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          step="any"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          required
          className={`answer-input ${isCorrect === true ? "correct" : isCorrect === false ? "incorrect" : ""}`}
        />
        <br />
        <button type="submit" className="answer-button">Responder</button>
      </form>
    </div>
  );
};

export default Question;
