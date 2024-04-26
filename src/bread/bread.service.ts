import { Injectable } from '@nestjs/common';
import { CreateBreadDto } from './dto/create-bread.dto';
import { UpdateBreadDto } from './dto/update-bread.dto';

@Injectable()
export class BreadService {
  create(createBreadDto: CreateBreadDto) {
    return 'This action adds a new bread';
  }

  findAll() {
    return `This action returns all bread`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bread`;
  }

  update(id: number, updateBreadDto: UpdateBreadDto) {
    return `This action updates a #${id} bread`;
  }

  remove(id: number) {
    return `This action removes a #${id} bread`;
  }
}
