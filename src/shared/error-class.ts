export class InvalidDataError extends Error {
  constructor(message = '', dataType: string | null = null) {
    super(message);
    if (dataType) this.name = `Invalid${dataType}`;
    else this.name = 'InvalidDataError';
  }
}

export class PermissionError extends Error {
  constructor(message = '') {
    super(message);
    this.name = 'PermissionError';
  }
}
