import React, { useState, useEffect } from "react";
import Question from "./Question";
import Score from "./Score";
import "./MathGame.css";

// Importamos los sonidos
import correctSound from "/sounds/correct.mp3";
import wrongSound from "/sounds/wrong.mp3";
import timeoutSound from "/sounds/timeout.mp3";
import gameoverSound from "/sounds/gameover.mp3";

const operationsByDifficulty = {
  easy: ["+", "-"],
  medium: ["+", "-", "*", "/"],
  hard: ["+", "-", "*", "/", "frac"]
};

const MAX_QUESTIONS = 10;

const generateQuestion = (difficulty) => {
  const operations = operationsByDifficulty[difficulty];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let num1, num2, correctAnswer;

  if (difficulty === "easy") {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
  } else if (difficulty === "medium") {
    num1 = Math.floor(Math.random() * 20) + 1;
    num2 = Math.floor(Math.random() * 20) + 1;
  } else {
    // Difícil: Permitir decimales y fracciones
    num1 = (Math.random() * 50 + 1).toFixed(1);
    num2 = (Math.random() * 50 + 1).toFixed(1);
  }

  switch (operation) {
    case "+":
      correctAnswer = parseFloat(num1) + parseFloat(num2);
      break;
    case "-":
      correctAnswer = parseFloat(num1) - parseFloat(num2);
      break;
    case "*":
      correctAnswer = parseFloat(num1) * parseFloat(num2);
      break;
    case "/":
      correctAnswer = parseFloat((num1 / num2).toFixed(2));
      break;
    case "frac":
      let numerator = Math.floor(Math.random() * 9) + 1;
      let denominator = Math.floor(Math.random() * 9) + 1;
      correctAnswer = `${numerator}/${denominator}`;
      break;
    default:
      correctAnswer = 0;
  }

  return { num1, num2, operation, correctAnswer };
};

const MathGame = () => {
  const [question, setQuestion] = useState(generateQuestion("easy"));
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [questionCount, setQuestionCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [flash, setFlash] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);

  useEffect(() => {
    if (timeLeft === 0 && !gameOver) {
      new Audio(timeoutSound).play();
      setMessage(`⏳ Se acabó el tiempo! La respuesta era ${question.correctAnswer}`);
      setFlash(true);
      setWrongStreak((prev) => prev + 1);
      checkDifficulty();

      setTimeout(() => {
        setMessage("");
        setFlash(false);
        nextQuestion();
      }, 1500);
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, question, gameOver]);

  const handleAnswer = (userAnswer) => {
    if (parseFloat(userAnswer) === parseFloat(question.correctAnswer)) {
      new Audio(correctSound).play();
      const newScore = score + 10;
      setScore(newScore);
      localStorage.setItem("mathGameScore", newScore);
      setMessage("✅ ¡Correcto!");
      setCorrectStreak((prev) => prev + 1);
      setWrongStreak(0);
    } else {
      new Audio(wrongSound).play();
      setMessage(`❌ Incorrecto. La respuesta era ${question.correctAnswer}`);
      setCorrectStreak(0);
      setWrongStreak((prev) => prev + 1);
    }

    checkDifficulty();

    setTimeout(() => {
      setMessage("");
      nextQuestion();
    }, 1500);
  };

  const checkDifficulty = () => {
    if (correctStreak >= 3 && difficulty !== "hard") {
      setDifficulty(difficulty === "easy" ? "medium" : "hard");
      setCorrectStreak(0);
    } else if (wrongStreak >= 2 && difficulty !== "easy") {
      setDifficulty(difficulty === "hard" ? "medium" : "easy");
      setWrongStreak(0);
    }
  };

  const nextQuestion = () => {
    if (questionCount + 1 >= MAX_QUESTIONS) {
      new Audio(gameoverSound).play();
      setGameOver(true);
    } else {
      setQuestion(generateQuestion(difficulty));
      setQuestionCount(questionCount + 1);
      setTimeLeft(10);
    }
  };

  const resetGame = () => {
    setScore(0);
    setQuestionCount(0);
    setGameOver(false);
    setMessage("");
    localStorage.setItem("mathGameScore", 0);
    setDifficulty("easy");
    setCorrectStreak(0);
    setWrongStreak(0);
    setQuestion(generateQuestion("easy"));
    setTimeLeft(10);
  };

  return (
    <div className={`game-container ${flash ? "flash-effect" : ""}`}>
      <div className="game-box">
        <img src="mate.jpg" alt="juego" width="350px" height="auto"></img>
        <h1 className="game-title">🧮 Juego de Preguntas Matemáticas</h1>
        <Score score={score} />

        {gameOver ? (
          <>
            <h2 className="text-2xl font-semibold text-center">🎉 ¡Juego terminado!</h2>
            <h3 className="text-xl text-center mt-2">Puntaje final: {score}</h3>
            <button onClick={resetGame} className="reset-button">
              🔄 Reiniciar Juego
            </button>
          </>
        ) : (
          <>
            <h3>📊 Nivel actual: {difficulty.toUpperCase()}</h3>
            <div className="timer-bar-container">
              <div className="timer-bar" style={{ width: `${(timeLeft / 10) * 100}%` }}></div>
            </div>

            <h3>⏳ Tiempo restante: {timeLeft} segundos</h3>
            <h3>📊 Pregunta {questionCount + 1} de {MAX_QUESTIONS}</h3>
            <Question question={question} onAnswer={handleAnswer} />
            <p className="message">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default MathGame;
