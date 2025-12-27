import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListServiceCategoriesDto {
    @ApiPropertyOptional({ example: 'co' })
    @IsOptional()
    @IsString()
    q?: string; 
}
