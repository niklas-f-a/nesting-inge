import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  task: string;

  @IsOptional()
  @IsString()
  imageLink?: string;

  @IsNotEmpty()
  client: number;
}
