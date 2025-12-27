import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateServiceDto {
    @ApiPropertyOptional({ example: 'Corte Clásico' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: '...' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: '40.00' })
    @IsOptional()
    @IsString()
    price?: string;

    @ApiPropertyOptional({ example: 60 })
    @IsOptional()
    @IsInt()
    @Min(1)
    durationMin?: number;

    @ApiPropertyOptional({ example: 'cuid_service_category_id' })
    @IsOptional()
    @IsString()
    serviceCategoryId?: string;

    @ApiPropertyOptional({ example: 'https://...' })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    isActive?: boolean;
}
