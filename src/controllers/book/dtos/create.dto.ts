import { ClassValidatorDTO } from '@shared/class-validator';
import { Expose } from 'class-transformer';
import { IsDefined, IsString, Length } from 'class-validator';

export class CreateBookDTO extends ClassValidatorDTO {
  @Expose()
  @IsDefined()
  @IsString()
  @Length(3, 100)
  name!: string;
}
