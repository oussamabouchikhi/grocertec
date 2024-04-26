import { Test, TestingModule } from '@nestjs/testing';
import { VegetableService } from './vegetable.service';

describe('VegetableService', () => {
  let service: VegetableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VegetableService],
    }).compile();

    service = module.get<VegetableService>(VegetableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
