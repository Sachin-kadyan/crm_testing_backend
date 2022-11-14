class ErrorHandler extends Error {
  code: number;
  error: string;
  messages: { error: string }[];
  constructor(error: string, code: number, messages: { error: string }[]) {
    super(error);
    this.code = code;
    this.error = error;
    this.messages = messages;
  }
}

export default ErrorHandler;
