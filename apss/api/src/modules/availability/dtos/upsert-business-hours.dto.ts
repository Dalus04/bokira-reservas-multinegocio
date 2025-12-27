import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class BusinessDayDto {
    @ApiProperty({ example: 1, description: '0=Sunday ... 6=Saturday' })
    @IsInt()
    @Min(0)
    @Max(6)
    dayOfWeek!: number;

    @ApiProperty({ example: '09:00' })
    @IsString()
    openTime!: string;

    @ApiProperty({ example: '18:00' })
    @IsString()
    closeTime!: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    isClosed!: boolean;
}

export class UpsertBusinessHoursDto {
    @ApiProperty({
        example: [
            { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00', isClosed: false },
            { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BusinessDayDto)
    weekly!: BusinessDayDto[];
}
