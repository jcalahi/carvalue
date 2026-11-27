import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity.js';
import { CreateReportDto } from './dtos/create-report.dto.js';
import { User } from '../users/user.entity.js';
import { ApproveReportDto } from './dtos/approve-report.dto.js';
import { GetEstimateDto } from './dtos/get-estimate.dto.js';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly repo: Repository<Report>,
  ) {}

  createEstimate({ lat, lng, make, mileage, model, year }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('*')
      .where('make = :make', { make })
      .andWhere('model = := model', { model })
      .andWhere('lng - :lng BETWEEN -5 and 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 and 5', { lat })
      .andWhere('year - :year BETWEEN -3 and 3', { year })
      .orderBy('ABS(mileage = :mileage)', 'DESC')
      .setParameters({ mileage })
      .getRawMany();
  }

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;

    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: Number(id) } });

    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    report.approved = approved;
    return this.repo.save(report);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  async remove(id: number) {
    const report = await this.findOne(id);

    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    return this.repo.remove(report);
  }
}
