"use client";
import React, { useState, useEffect, useContext } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Pause, Play, TimerReset } from "lucide-react";
import { invoke } from "@tauri-apps/api/tauri";
import Counter from "./Counter";
import { DataContext } from "./ContextProvider";
import { start_time } from "@/app/backend/database";

export default function Timer() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [key, setKey] = useState(0);
  const [remainingTime, setRemainingTime] = useState(
    minutes * 60 + seconds / (minutes * 60)
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [progress, setProgress] = useState(100);
  const { sessionCounter, setSessionCounter, breakCounter, setBreakCounter } =
    useContext(DataContext);
  
   const handleStartTimer = () => {
    setRemainingTime(minutes * 60 + seconds / (minutes * 60));
    setIsTimerRunning(true);
    invoke("start_time");
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setMinutes(25);
    setSeconds(0);
    setRemainingTime(minutes * 60 + seconds / (minutes * 60));
    setIsTimerRunning(false);
    setIsBreak(false);
    setProgress(100);
    setKey((prevKey) => prevKey + 1);
  };

  function handleSlider(value: number) {
    setMinutes(value);
    setRemainingTime(value * 60);
  }

  useEffect(() => {
    if (isTimerRunning) {
      const intervalId = setInterval(() => {
        if (minutes <= 0 && seconds <= 0 && isBreak) {
          setBreakCounter((prevState: number): number => prevState + 1);
          setMinutes(25);
          setSeconds(0);
          setIsBreak(false);
          setIsTimerRunning(false);
          invoke("show_window");
        } else if (minutes <= 0 && seconds <= 0) {
          setSessionCounter((prevState: number): number => prevState + 1);
          setMinutes(5);
          setSeconds(0);
          setIsBreak(true);
          setIsTimerRunning(false);
          invoke("show_window");
        } else if (seconds === 0) {
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
  }, [
    isBreak,
    isTimerRunning,
    minutes,
    remainingTime,
    seconds,
    setBreakCounter,
    setSessionCounter,
  ]);

  useEffect(() => {});
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <CountdownCircleTimer
        key={key}
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
      <div className="controls flex flex-col p-3">
        <form className="flex">
          <Slider
            value={[minutes]}
            onValueChange={(value) => {
              handleSlider(value[0]);
            }}
            className="p-4"
            defaultValue={[25]}
            min={0}
            max={60}
            step={1}
          />
        </form>
        <div className="flex flex-row justify-center">
          <Button
            variant={"ghost"}
            onClick={() => setMinutes((prevVal) => prevVal + 25)}
          >
            25 Minutes
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => {
              setMinutes(5);
              setIsBreak(true);
            }}
          >
            Take Break
          </Button>
        </div>
        <div className="flex flex-row justify-center">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={handleStartTimer}
            disabled={isTimerRunning}
            className="btn start m-2"
          >
            <Play />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={handlePauseTimer}
            disabled={!isTimerRunning}
            className="btn pause m-2"
          >
            <Pause />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={handleResetTimer}
            className="m-2 btn reset"
          >
            <TimerReset />
          </Button>
        </div>
      </div>
      <Counter />
      {/* <div>Pomodoro Cycles: {cycleCounter}</div>
      <div>Breaks: {breakCounter}</div> */}
    </div>
  );
}
