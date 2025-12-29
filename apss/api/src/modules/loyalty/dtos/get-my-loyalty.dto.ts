import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetMyLoyaltyDto {
    @IsString()
    businessId!: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
    @IsInt()
    @Min(1)
    limit?: number = 20;
}
