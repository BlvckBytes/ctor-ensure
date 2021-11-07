class UnknownLanguageException extends Error {
  constructor (
    public lang: string,
  ) {
    super(`Could not find the requested language ${lang}!`);
    Object.setPrototypeOf(this, UnknownLanguageException.prototype);
  }
}

export default UnknownLanguageException;