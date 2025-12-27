import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListPublicServicesDto {
    @ApiPropertyOptional({ example: 'corte' })
    @IsOptional()
    @IsString()
    q?: string;

    @ApiPropertyOptional({ example: 'cuid_category_id' })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiPropertyOptional({ example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({ example: 20 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit: number = 20;
}
