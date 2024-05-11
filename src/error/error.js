class BadRequestError extends Error {
  error;
  status = 400;
  constructor(message) {
    super(message);
    this.error = message;
  }
}

class ServerError extends Error {
  error;
  status = 500;
  constructor(message) {
    super(message);
    this.error = message;
  }
}

module.exports = { BadRequestError, ServerError };
