import { ClassValidatorDTO } from '@shared/class-validator';
import { Expose } from 'class-transformer';
import { IsDefined, IsNumber, Min } from 'class-validator';

export class BookIdDTO extends ClassValidatorDTO {
  @Expose()
  @IsDefined()
  @IsNumber()
  @Min(1)
  id!: number;
}
