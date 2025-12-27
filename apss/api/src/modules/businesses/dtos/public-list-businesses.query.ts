import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PublicListBusinessesQueryDto {
    @ApiPropertyOptional({ example: 'nova' })
    @IsOptional()
    @IsString()
    q?: string;

    @ApiPropertyOptional({ example: 'Trujillo' })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional({ example: 'barberias' })
    @IsOptional()
    @IsString()
    categorySlug?: string;

    @ApiPropertyOptional({ example: 1, default: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({ example: 20, default: 20, maximum: 50 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit: number = 20;
}
