import { IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  task?: string;

  @IsOptional()
  @IsString()
  imageLink?: string;

  @IsOptional()
  done?: boolean;
}
