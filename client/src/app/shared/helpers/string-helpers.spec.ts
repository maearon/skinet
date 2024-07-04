// src/app/shared/helpers/string-helpers.spec.ts

import { titleCase } from './string-helpers';

describe('titleCase', () => {
  it('should convert a string to title case', () => {
    expect(titleCase('hello world')).toBe('Hello World');
    expect(titleCase('javaScript is awesome')).toBe('Javascript Is Awesome');
    expect(titleCase('a quick brown fox')).toBe('A Quick Brown Fox');
  });

  it('should handle strings with extra spaces', () => {
    expect(titleCase('   hello    world   ')).toBe('Hello World');
  });

  it('should return an empty string for empty input', () => {
    expect(titleCase('')).toBe('');
  });

  it('should return an empty string for null or undefined input', () => {
    expect(titleCase(null)).toBe('');
    expect(titleCase(undefined)).toBe('');
  });

  it('should handle single word strings', () => {
    expect(titleCase('hello')).toBe('Hello');
    expect(titleCase('world')).toBe('World');
  });

  it('should handle strings with mixed case letters', () => {
    expect(titleCase('hELLo wORld')).toBe('Hello World');
  });
});
