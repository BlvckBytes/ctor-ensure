class UnknownLanguageException extends Error {
  constructor (
    public lang: string,
  ) {
    super(`Could not find the requested language ${lang}!`);
  }
}

export default UnknownLanguageException;