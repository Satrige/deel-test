module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate({ ...req.params, ...req.query, ...req.body });

  if (error === undefined) {
    return next();
  }

  res.status(422).json({ error: error.details.map((i) => i.message).join(',') });
};
