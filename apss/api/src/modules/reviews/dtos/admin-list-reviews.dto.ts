import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ReviewStatus } from 'src/model/domain/enums/review-status';

export class AdminListReviewsDto {
    @ApiPropertyOptional({ example: 'ckv_business_id' })
    @IsOptional()
    @IsString()
    businessId?: string;

    @ApiPropertyOptional({ enum: ReviewStatus, example: ReviewStatus.PUBLISHED })
    @IsOptional()
    @IsEnum(ReviewStatus)
    status?: ReviewStatus;

    @ApiPropertyOptional({ example: 1 })
    @Type(() => Number)
    page: number = 1;

    @ApiPropertyOptional({ example: 20 })
    @Type(() => Number)
    limit: number = 20;
}
