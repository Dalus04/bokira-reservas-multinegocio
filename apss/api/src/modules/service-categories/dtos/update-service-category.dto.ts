import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateServiceCategoryDto {
    @ApiProperty({ example: 'Barbas' })
    @IsString()
    @MinLength(2)
    name!: string;
}
