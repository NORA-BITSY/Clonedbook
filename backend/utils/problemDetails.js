function makeProblem(status, title, detail, type = 'about:blank', instance = null) {
  return {
    type,
    title,
    status,
    detail,
    instance,
  };
}

function problemHandler(err, req, res, next) {
  if (err.name === 'ZodError') {
    const problem = makeProblem(
      400,
      'Invalid request',
      err.issues.map(i => i.message).join('; '),
      'https://boatable.app/problems/validation',
      req.path
    );
    return res.status(problem.status).json(problem);
  }

  if (err.status === 404) {
    const problem = makeProblem(
      404,
      'Not Found',
      err.message || 'The requested resource was not found.',
      'about:blank',
      req.path
    );
    return res.status(problem.status).json(problem);
  }

  if (err.status === 403) {
    const problem = makeProblem(
      403,
      'Forbidden',
      err.message || 'You do not have permission to access this resource.',
      'about:blank',
      req.path
    );
    return res.status(problem.status).json(problem);
  }

  // Default error handler
  const problem = makeProblem(
    err.status || 500,
    err.title || 'Internal Server Error',
    err.message || 'An unexpected error occurred.',
    'about:blank',
    req.path
  );
  res.status(problem.status).json(problem);
}

module.exports = {
  makeProblem,
  problemHandler,
};
