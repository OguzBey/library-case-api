import { validateSync, ValidatorOptions } from 'class-validator';

export class ClassValidatorDTO {
  checkErrors(opts?: ValidatorOptions) {
    let errors = validateSync(this, opts);
    return errors;
  }
}
