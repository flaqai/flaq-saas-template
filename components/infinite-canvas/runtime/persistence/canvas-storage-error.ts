export class CanvasStorageError extends Error {
  constructor(readonly kind: 'missing') {
    super('Canvas project was not found in browser storage.');
    this.name = 'CanvasStorageError';
  }
}
