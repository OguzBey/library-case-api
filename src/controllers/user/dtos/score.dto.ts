import { ClassValidatorDTO } from '@shared/class-validator';
import { Expose } from 'class-transformer';
import { IsDefined, IsNumber, Max, Min } from 'class-validator';

export class ScoreDTO extends ClassValidatorDTO {
  @Expose()
  @IsDefined()
  @IsNumber()
  @Min(0)
  @Max(10)
  score!: number;
}
