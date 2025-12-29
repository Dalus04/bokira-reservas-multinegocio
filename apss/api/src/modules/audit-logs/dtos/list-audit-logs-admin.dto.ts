import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { AuditAction, AuditEntityType } from 'src/model/domain/enums/audit';

export class ListAuditLogsAdminDto {
    @ApiPropertyOptional() @IsOptional() @IsString()
    businessId?: string;

    @ApiPropertyOptional() @IsOptional() @IsString()
    actorUserId?: string;

    @ApiPropertyOptional({ enum: AuditEntityType })
    @IsOptional() @IsEnum(AuditEntityType)
    entityType?: AuditEntityType;

    @ApiPropertyOptional() @IsOptional() @IsString()
    entityId?: string;

    @ApiPropertyOptional({ enum: AuditAction })
    @IsOptional() @IsEnum(AuditAction)
    action?: AuditAction;

    @ApiPropertyOptional({ example: '2025-12-01T00:00:00.000Z' })
    @IsOptional() @IsString()
    from?: string;

    @ApiPropertyOptional({ example: '2025-12-31T23:59:59.000Z' })
    @IsOptional() @IsString()
    to?: string;

    @ApiPropertyOptional({ default: 1 })
    @Type(() => Number) @IsInt() @Min(1)
    page: number = 1;

    @ApiPropertyOptional({ default: 20 })
    @Type(() => Number) @IsInt() @Min(1)
    limit: number = 20;
}
