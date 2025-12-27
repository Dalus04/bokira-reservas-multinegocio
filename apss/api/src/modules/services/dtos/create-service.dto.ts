import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateServiceDto {
    @ApiProperty({ example: 'Corte + Barba' })
    @IsString()
    name!: string;

    @ApiPropertyOptional({ example: 'Incluye lavado y perfilado' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: '35.00', description: 'Decimal string' })
    @IsString()
    price!: string;

    @ApiProperty({ example: 45 })
    @IsInt()
    @Min(1)
    durationMin!: number;

    @ApiPropertyOptional({ example: 'cuid_service_category_id' })
    @IsOptional()
    @IsString()
    serviceCategoryId?: string;

    @ApiPropertyOptional({ example: 'https://...' })
    @IsOptional()
    @IsString()
    imageUrl?: string;
}
