"use client";
import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default function Timer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [progress, setProgress] = useState(100);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };
  const handleResetTimer = () => {
    setMinutes(25);
    setSeconds(0);
    setIsTimerRunning(false);
    setProgress(100);
  };

  useEffect(() => {
    if (isTimerRunning) {
      const intervalId = setInterval(() => {
        if (seconds === 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }

        const remainingTime = (minutes * 60 + seconds) / (25 * 60);
        setProgress(100 - remainingTime * 100);

        if (minutes === 0 && seconds === 0) {
          clearInterval(intervalId);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isTimerRunning, minutes, seconds]);

  return (
    <div className="timer-container">
      <div className="timer">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>
      <CountdownCircleTimer
        isPlaying={false}
        duration={10}
        strokeWidth={20}
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[10, 6, 3, 0]}
        onComplete={() => ({ shouldRepeat: false })}
      >
        {({ remainingTime }) => {
          //   const minutes = Math.floor(remainingTime / 60);
          //   const seconds = remainingTime % 60;
          return `${minutes}:${seconds}`;
        }}
      </CountdownCircleTimer>
      <div className="controls">
        <button
          onClick={handleStartTimer}
          disabled={isTimerRunning}
          className="btn start"
        >
          Start
        </button>
        <button
          onClick={handlePauseTimer}
          disabled={!isTimerRunning}
          className="btn pause"
        >
          Pause
        </button>
        <button onClick={handleResetTimer} className="btn reset">
          Reset
        </button>
      </div>
    </div>
  );
}
