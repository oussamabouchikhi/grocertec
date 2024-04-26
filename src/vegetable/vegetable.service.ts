import { Injectable } from '@nestjs/common';
import { CreateVegetableDto } from './dto/create-vegetable.dto';
import { UpdateVegetableDto } from './dto/update-vegetable.dto';

@Injectable()
export class VegetableService {
  create(createVegetableDto: CreateVegetableDto) {
    return 'This action adds a new vegetable';
  }

  findAll() {
    return `This action returns all vegetable`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vegetable`;
  }

  update(id: number, updateVegetableDto: UpdateVegetableDto) {
    return `This action updates a #${id} vegetable`;
  }

  remove(id: number) {
    return `This action removes a #${id} vegetable`;
  }
}
