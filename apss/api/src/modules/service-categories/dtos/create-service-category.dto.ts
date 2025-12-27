import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateServiceCategoryDto {
    @ApiProperty({ example: 'Cortes' })
    @IsString()
    @MinLength(2)
    name!: string;
}
