import type { WordChain } from '../types';

const isPlural = (word: string): boolean => {
  return word.endsWith('s') && !word.endsWith('ss') && !word.endsWith('us');
};

const getSingular = (word: string): string => {
  if (!isPlural(word)) return word;
  return word.endsWith('ies') ? word.slice(0, -3) + 'y' : word.slice(0, -1);
};

export const normalizeWord = (word: string): string => {
  return word.toLowerCase().trim().replace(/\s+/g, ' ');
};

export const isValidGuess = (guess: string, synonyms: string[]): boolean => {
  const normalizedGuess = normalizeWord(guess);
  const guessSingular = getSingular(normalizedGuess);
  
  return synonyms.some(synonym => {
    const normalizedSynonym = normalizeWord(synonym);
    const synonymSingular = getSingular(normalizedSynonym);
    return guessSingular === synonymSingular;
  });
};

export const getAvailableSynonyms = (
  currentWord: WordChain,
  usedWords: Set<string>
): string[] => {
  return currentWord.synonyms.filter(synonym => {
    const normalizedSynonym = normalizeWord(synonym);
    const synonymSingular = getSingular(normalizedSynonym);
    
    // Check if either the word or its singular form has been used
    return ![...usedWords].some(used => {
      const usedSingular = getSingular(normalizeWord(used));
      return usedSingular === synonymSingular;
    });
  });
};

export const calculateScore = (chainLength: number, timeLeft: number): number => {
  const baseScore = chainLength * 100;
  const timeBonus = timeLeft * 10;
  return baseScore + timeBonus;
};