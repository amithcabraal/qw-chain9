import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { VirtualKeyboard } from './VirtualKeyboard';

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
}

export function GuessInput({ onGuess, disabled = false }: GuessInputProps) {
  const [guess, setGuess] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!disabled && inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
  }, [disabled, isMobile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      onGuess(guess.trim().toLowerCase());
      setGuess('');
    }
  };

  const handleKeyPress = (key: string) => {
    setGuess(prev => prev + key);
    if (inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
  };

  const handleBackspace = () => {
    setGuess(prev => prev.slice(0, -1));
    if (inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
  };

  const handleClear = () => {
    setGuess('');
    if (inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isMobile) {
      setGuess(e.target.value);
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isMobile) {
      e.target.blur();
    }
  };

  return (
    <div className="w-full max-w-lg mt-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={guess}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          disabled={disabled}
          readOnly={isMobile}
          placeholder="Enter your guess..."
          className="flex-1 px-4 py-2 text-emerald-800 dark:text-emerald-100 bg-white dark:bg-emerald-900/20 rounded-lg border border-emerald-300 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-emerald-400 dark:placeholder-emerald-600"
        />
        <button
          type="submit"
          disabled={disabled || !guess.trim()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white flex items-center gap-2 transition-colors"
        >
          <Send className="w-4 h-4" />
          <span>Guess</span>
        </button>
      </form>

      <VirtualKeyboard
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onClear={handleClear}
        disabled={disabled}
      />
    </div>
  );
}
