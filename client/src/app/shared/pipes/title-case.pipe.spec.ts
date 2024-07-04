import { TitleCasePipe } from './title-case.pipe';

describe('TitleCasePipe', () => {
  let pipe: TitleCasePipe;

  beforeEach(() => {
    pipe = new TitleCasePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "hello world" to "Hello World"', () => {
    expect(pipe.transform('hello world')).toBe('Hello World');
  });

  it('should return empty string for null or undefined values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
