

class HttpReqHandlerError extends Error {

  constructor(message, props) {
    super(message); // (1)
    this.name = "HttpReqHandlerError"; // (2)
    this.props = props;
  }
}

export {
  HttpReqHandlerError
}