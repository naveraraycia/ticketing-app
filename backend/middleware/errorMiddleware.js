const errorHandler = (err, req, res, next) => {
  // check status code
  // res.statusCode's value is whatever status code you set (res.status(400))
  // if there is no status code set, then just return a status code 500 => server error
  const statusCode = res.statusCode ? res.statusCode : 500
  res.status(statusCode)
  res.json({
    message: err.message,
    // only show the error stack if you are in development mode, if on 'production' mode then stack should be null
    // stack => similar to console error which tells you which line and which file has errors (ideal to show up on development mode only)
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
}

// export module
module.exports = {errorHandler}