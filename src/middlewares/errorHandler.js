export function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Ruta no encontrada' });
}