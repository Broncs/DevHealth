import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ChallengeContext } from './ChallengesContext';

interface CountdownContextData {
  minutes: number;
  seconds: number;
  hasFinished: boolean;
  isActive: boolean;
  startCountDown: () => void;
  resetCountdown: () => void;
}

interface CountdownProviderProps {
  children: ReactNode;
}
let countdownTimeout: NodeJS.Timeout;

export const CountdownContext = createContext({} as CountdownContextData);

export const CountdownProvider = ({ children }: CountdownProviderProps) => {
  const { startNewChallenge } = useContext(ChallengeContext);

  const [time, setTime] = useState(0.1 * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const startCountDown = () => {
    setIsActive(true);
  };

  const resetCountdown = () => {
    clearTimeout(countdownTimeout);
    setIsActive(false);
    setHasFinished(false);
    setTime(0.1 * 60);
  };

  useEffect(() => {
    if (isActive && time > 0) {
      countdownTimeout = setTimeout(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      setHasFinished(true);
      setIsActive(false);
      startNewChallenge();
    }
  }, [isActive, time]);

  return (
    <CountdownContext.Provider
      value={{
        minutes,
        seconds,
        hasFinished,
        isActive,
        startCountDown,
        resetCountdown,
      }}
    >
      {children}
    </CountdownContext.Provider>
  );
};
