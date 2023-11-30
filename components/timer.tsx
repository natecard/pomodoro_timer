"use client";
import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Button } from "./ui/button";

export default function Timer() {
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [remainingTime, setRemainingTime] = useState(
    minutes * 60 + seconds / (minutes * 60)
  );
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
    setRemainingTime(minutes * 60 + seconds / (minutes * 60));
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

        setProgress(100 - remainingTime * 100);

        if (minutes === 0 && seconds === 0) {
          clearInterval(intervalId);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isTimerRunning, minutes, remainingTime, seconds]);

  return (
    <div className="flex flex-col justify-center">
      <CountdownCircleTimer
        isPlaying={isTimerRunning}
        duration={remainingTime}
        strokeWidth={15}
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[10, 6, 3, 0]}
        onComplete={() => ({
          shouldRepeat: false,
          newInitialRemainingTime: remainingTime,
        })}
      >
        {({ remainingTime }) => {
          if (minutes < 10 && seconds < 10) {
            return `0${minutes}:0${seconds}`;
          }
          if (seconds < 10) {
            return `${minutes}:0${seconds}`;
          }
          if (minutes < 10) {
            return `0${minutes}:${seconds}`;
          }
          return `${minutes}:${seconds}`;
        }}
      </CountdownCircleTimer>
      <div className="controls">
        <Button
          onClick={handleStartTimer}
          disabled={isTimerRunning}
          className="btn start m-2"
        >
          Start
        </Button>
        <Button
          onClick={handlePauseTimer}
          disabled={!isTimerRunning}
          className="btn pause m-2"
        >
          Pause
        </Button>
        <Button onClick={handleResetTimer} className="m-2 btn reset">
          Reset
        </Button>
      </div>
    </div>
  );
}
