import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class StaffDayDto {
    @ApiProperty({ example: 1, description: '0=Sunday ... 6=Saturday' })
    @IsInt()
    @Min(0)
    @Max(6)
    dayOfWeek!: number;

    @ApiProperty({ example: '10:00' })
    @IsString()
    startTime!: string;

    @ApiProperty({ example: '19:00' })
    @IsString()
    endTime!: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    isOff!: boolean;
}

export class UpsertStaffWorkingHoursDto {
    @ApiProperty({
        example: [
            { dayOfWeek: 1, startTime: '10:00', endTime: '19:00', isOff: false },
            { dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isOff: true },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StaffDayDto)
    weekly!: StaffDayDto[];
}
