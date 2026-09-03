export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not found - ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // MongoDB duplicate key error (E11000) — never leak the raw driver error;
  // translate it into a clean, specific message the admin can act on.
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    if (field === "name") {
      message = "Repeated Product Name. Please use a different product name.";
    } else if (field === "slug") {
      message = "Repeated Slug. Please use a different slug.";
    } else {
      const label = field ? field.charAt(0).toUpperCase() + field.slice(1) : "This value";
      message = `${label} is already in use. Please choose a different one.`;
    }
  }

  // Mongoose validation errors — collapse the nested error object into one
  // readable sentence instead of exposing internal field paths.
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(" ");
  }

  // Malformed ObjectId in a URL param (e.g. /products/not-a-real-id)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
