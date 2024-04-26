import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VegetableService } from './vegetable.service';
import { CreateVegetableDto } from './dto/create-vegetable.dto';
import { UpdateVegetableDto } from './dto/update-vegetable.dto';

@Controller('vegetable')
export class VegetableController {
  constructor(private readonly vegetableService: VegetableService) {}

  @Post()
  create(@Body() createVegetableDto: CreateVegetableDto) {
    return this.vegetableService.create(createVegetableDto);
  }

  @Get()
  findAll() {
    return this.vegetableService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vegetableService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVegetableDto: UpdateVegetableDto) {
    return this.vegetableService.update(+id, updateVegetableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vegetableService.remove(+id);
  }
}
