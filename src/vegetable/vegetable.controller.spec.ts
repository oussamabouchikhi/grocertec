import { Test, TestingModule } from '@nestjs/testing';
import { VegetableController } from './vegetable.controller';
import { VegetableService } from './vegetable.service';

describe('VegetableController', () => {
  let controller: VegetableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VegetableController],
      providers: [VegetableService],
    }).compile();

    controller = module.get<VegetableController>(VegetableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
