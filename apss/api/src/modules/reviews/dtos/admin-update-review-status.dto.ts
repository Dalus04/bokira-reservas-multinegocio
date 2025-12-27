import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ReviewStatus } from 'src/model/domain/enums/review-status';

export class AdminUpdateReviewStatusDto {
    @ApiProperty({ enum: ReviewStatus, example: ReviewStatus.HIDDEN })
    @IsEnum(ReviewStatus)
    status!: ReviewStatus;
}
