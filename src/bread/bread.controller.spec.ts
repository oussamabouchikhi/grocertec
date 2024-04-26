import { Test, TestingModule } from '@nestjs/testing';
import { BreadController } from './bread.controller';
import { BreadService } from './bread.service';

describe('BreadController', () => {
  let controller: BreadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BreadController],
      providers: [BreadService],
    }).compile();

    controller = module.get<BreadController>(BreadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
