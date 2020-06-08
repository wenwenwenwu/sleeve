class HttpException extends Error {
  errorCode = 9999
  statusCode = 500
  message = ""

  constructor(errorCode, message, statusCode) {
      super()
      this.errorCode = errorCode
      this.message = message
      this.statusCode = statusCode
  }

}

export {
  HttpException
} 