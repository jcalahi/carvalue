import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto.js';
import { ReportsService } from './reports.service.js';
import { AuthGuard } from '../guards/auth.guards.js';
import { User } from '../users/user.entity.js';
import { CurrentUser } from '../users/decorators/current-user.decorator.js';
import { Serialize } from '../interceptors/serialize.interceptor.js';
import { ReportDto } from './dtos/report.dto.js';
import { ApproveReportDto } from './dtos/approve-report.dto.js';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id, body.approved);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  deleteReport(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.remove(id);
  }
}
