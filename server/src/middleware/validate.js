export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      const issue = result.error.issues[0];
      const error = new Error(issue.message);
      error.statusCode = 400;
      next(error);
      return;
    }

    req.validated = result.data;
    next();
  };
}
