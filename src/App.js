import './App.css';
import { useState, useEffect } from 'react'
import { TimePicker } from 'react-ios-time-picker';
import useSound from 'use-sound';
import beepSfx from './assets/beep1.mp3';

const modeOptions = {
  go: 'go',
  stop: 'stop',
  countdown: 'countdown',
  start: 'start'
}

const backgroundColors = {
  'go': '#DDF8E8',
  'stop': '#ff8a8a'
}

function App() {
  const [timeOn, setTimeOn] = useState('00:20');
  const [timeOff, setTimeOff] = useState('00:20');
  const [totalTime, setTotalTime] = useState('05:00');
  const [countDownCount, setCountDownCount] = useState(5);
  const [timerTime, setTimerTime] = useState();
  const [mode, setMode] = useState();

  useEffect(() => {
    setMode(modeOptions.start);
  }, []);

  const [playBeep] = useSound(
    beepSfx,
    { volume: 0.5 }
  );
  

  function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
  }

  function convertToSeconds(time) {
    var parts = time.split(":");
    var minutes = parseInt(parts[0], 10);
    var seconds = parseInt(parts[1], 10);
  
    return minutes * 60 + seconds;
  }

  function convertToTimeString(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
  
    var minutesString = String(minutes).padStart(2, "0");
    var secondsString = String(remainingSeconds).padStart(2, "0");
  
    return minutesString + ":" + secondsString;
  }

  const handleStart = async () => {
    setMode(modeOptions.countdown);
    setCountDownCount(5);
    await doCountdown();
    await doTimer();
    setMode(modeOptions.start);
  }

  const doCountdown = async () => {
    let copy = countDownCount;
    while (copy > 1) {
      await delay(1000);
      copy -= 1;
      setCountDownCount(copy);
    }
    await delay(1000);
    setTimerTime(timeOn);
  }

  const doTimer = async () => {
    let modeLocal = modeOptions.go;
    setMode(modeLocal);

    const onSeconds = convertToSeconds(timeOn);
    const offSeconds = convertToSeconds(timeOff);
    const totalSeconds = convertToSeconds(totalTime);

    let elapsedTime = 0;
    let timerTimeLocal = onSeconds;

    playBeep();
    while (elapsedTime < totalSeconds) {
      await delay(1000);
      elapsedTime += 1;
      timerTimeLocal -= 1;

      if (timerTimeLocal === 0) {
        playBeep();
        let switchingTo = (modeLocal === modeOptions.go) ? modeOptions.stop : modeOptions.go;
        console.log(switchingTo);
        modeLocal = switchingTo;
        setMode(modeLocal);
        if (switchingTo === modeOptions.stop) {
          timerTimeLocal = offSeconds;
        }
        else {
          timerTimeLocal = onSeconds;
        }
      }

      setTimerTime(convertToTimeString(timerTimeLocal));
    }
  }



  return (
    <div id="app-container">
      <div id="panel" style={{display: mode === modeOptions.start ? 'flex' : 'none'}}>
        <div className="time-label">Time On:</div>
        <TimePicker onChange={e => setTimeOn(e)} value={timeOn}/>
        <div className="time-label">Time Off:</div>
        <TimePicker onChange={e => setTimeOff(e)} value={timeOff} />
        <div className="time-label">Total Time:</div>
        <TimePicker onChange={e => setTotalTime(e)} value={totalTime} />
        <div id="start-button" onClick={handleStart}>
          Start
        </div>
      </div>
      <div id="running-panel" style={{display: mode !== modeOptions.start ? 'flex' : 'none', backgroundColor: backgroundColors[mode]}}>
        <div id="countdown" style={{display: mode === modeOptions.countdown ? 'unset' : 'none'}}>
          {
            countDownCount
          }
        </div>
        <div id="timer" style={{display: (mode === modeOptions.go || mode === modeOptions.stop) ? 'unset' : 'none'}}>
          {
            timerTime
          }
        </div>
      </div>
    </div>
  );
}

export default App;
