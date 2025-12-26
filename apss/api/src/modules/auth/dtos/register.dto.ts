import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'user@bokira.dev' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'User12345!' })
    @IsString()
    @MinLength(6)
    password!: string;

    @ApiProperty({ example: 'Daniel Suárez' })
    @IsString()
    @MinLength(2)
    name!: string;

    @ApiPropertyOptional({ example: '999888777' })
    @IsOptional()
    @IsString()
    phone?: string;
}
