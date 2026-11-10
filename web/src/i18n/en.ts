import dictionary from './en.json';
import catalogDictionary from './en-catalog.json';

// English dictionary: key = Dutch source text, value = English.
export const EN: Record<string, string> = { ...dictionary, ...catalogDictionary };
