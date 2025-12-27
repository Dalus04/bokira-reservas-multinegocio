import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateBusinessDto {
    @ApiProperty({ example: 'Nova Barber' })
    @IsString()
    @MinLength(2)
    name!: string;

    @ApiProperty({ example: 'nova-barber' })
    @IsString()
    @MinLength(2)
    slug!: string;

    @ApiProperty({ example: 'cuid_platform_category_id' })
    @IsString()
    platformCategoryId!: string;

    @ApiPropertyOptional({ example: 'Barbería moderna en Trujillo' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 'Av. Ejemplo 123' })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ example: 'Trujillo' })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional({ example: '999888777' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ example: 'https://...' })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiPropertyOptional({ example: 'America/Lima', default: 'America/Lima' })
    @IsOptional()
    @IsString()
    timezone?: string;
}
