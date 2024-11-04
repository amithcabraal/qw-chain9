import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowDown } from 'lucide-react';
import { WordDefinitions } from './WordDefinitions';

interface WordDisplayProps {
  currentWord: {
    word: string;
    definition: string;
    definitions?: string[];
  };
  nextWordHint?: string;
  error?: string | null;
}

export function WordDisplay({ currentWord, nextWordHint, error }: WordDisplayProps) {
  const removeVowels = (word: string) => {
    return word.toLowerCase().split('').map(char => 
      /[aeiou]/i.test(char) ? '_' : char
    ).join('');
  };

  const definitions = currentWord.definitions || [currentWord.definition];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg space-y-6"
    >
      <div className="p-6 rounded-xl bg-emerald-800/20 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-100">
            Current Word: {currentWord.word}
          </h2>
        </div>
        <WordDefinitions definitions={definitions} />
      </div>

      {nextWordHint && (
        <div className="p-6 rounded-xl bg-emerald-700/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-100">
              Find a word similar to "{currentWord.word}":
            </h3>
          </div>
          <p className="text-3xl font-sans text-emerald-800 dark:text-emerald-100 tracking-[0.15em] leading-relaxed">
            {removeVowels(nextWordHint)}
          </p>
        </div>
      )}

      <AnimatePresence initial={false}>
        {error && (
          <motion.div
            key={error}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="p-4 rounded-lg bg-red-500/20 text-red-800 dark:text-red-200 text-center font-medium"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
