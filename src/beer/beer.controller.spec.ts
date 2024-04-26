import { Test, TestingModule } from '@nestjs/testing';
import { BeerController } from './beer.controller';
import { BeerService } from './beer.service';

describe('BeerController', () => {
  let controller: BeerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeerController],
      providers: [BeerService],
    }).compile();

    controller = module.get<BeerController>(BeerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
