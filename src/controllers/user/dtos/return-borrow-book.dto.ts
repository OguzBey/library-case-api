import { Expose } from 'class-transformer';
import { UserIdDTO } from './user-id.dto';
import { IsDefined, IsNumber, Min } from 'class-validator';

export class ReturnBorrowBookIdDTO extends UserIdDTO {
  @Expose()
  @IsDefined()
  @IsNumber()
  @Min(1)
  bookId!: number;
}
