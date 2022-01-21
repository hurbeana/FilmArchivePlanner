import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Festival } from './entities/festival.entity';

@Injectable()
export class FestivalsService extends TypeOrmCrudService<Festival> {
  constructor(@InjectRepository(Festival) repo) {
    super(repo);
  }

  private readonly logger = new Logger(FestivalsService.name);

  /**
   * Checks if a Festival is referenced in some other table
   * @param festivalId the id of the tag that we want to know if it is "used"
   */
  async hasEvents(festivalId: number): Promise<boolean> {
    try {
      const f = await this.repo.findOneOrFail({ where: { id: festivalId } });
      return f.events?.length > 0;
    } catch (e) {
      this.logger.error(
        `Checking if festival with id ${festivalId} has events failed.`,
        e.stack,
      );
      throw new NotFoundException();
    }
  }
}
