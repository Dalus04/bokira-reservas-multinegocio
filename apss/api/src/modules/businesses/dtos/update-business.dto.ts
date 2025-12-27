import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateBusinessDto {
    @ApiPropertyOptional({ example: 'Nova Barber Premium' })
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;

    @ApiPropertyOptional({ example: 'Nueva descripción' })
    @IsOptional()
    @IsString()
    description?: string | null;

    @ApiPropertyOptional({ example: 'Nueva dirección' })
    @IsOptional()
    @IsString()
    address?: string | null;

    @ApiPropertyOptional({ example: 'Trujillo' })
    @IsOptional()
    @IsString()
    city?: string | null;

    @ApiPropertyOptional({ example: '999888777' })
    @IsOptional()
    @IsString()
    phone?: string | null;

    @ApiPropertyOptional({ example: 'https://...' })
    @IsOptional()
    @IsString()
    imageUrl?: string | null;

    @ApiPropertyOptional({ example: 'cuid_platform_category_id' })
    @IsOptional()
    @IsString()
    platformCategoryId?: string;

    @ApiPropertyOptional({ example: 'America/Lima' })
    @IsOptional()
    @IsString()
    timezone?: string;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
