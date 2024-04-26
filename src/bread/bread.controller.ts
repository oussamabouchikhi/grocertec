import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BreadService } from './bread.service';
import { CreateBreadDto } from './dto/create-bread.dto';
import { UpdateBreadDto } from './dto/update-bread.dto';

@Controller('bread')
export class BreadController {
  constructor(private readonly breadService: BreadService) {}

  @Post()
  create(@Body() createBreadDto: CreateBreadDto) {
    return this.breadService.create(createBreadDto);
  }

  @Get()
  findAll() {
    return this.breadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.breadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBreadDto: UpdateBreadDto) {
    return this.breadService.update(+id, updateBreadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.breadService.remove(+id);
  }
}
