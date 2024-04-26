import { Test, TestingModule } from '@nestjs/testing';
import { BeerService } from './beer.service';

describe('BeerService', () => {
  let service: BeerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BeerService],
    }).compile();

    service = module.get<BeerService>(BeerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
