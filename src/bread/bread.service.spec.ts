import { Test, TestingModule } from '@nestjs/testing';
import { BreadService } from './bread.service';

describe('BreadService', () => {
  let service: BreadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BreadService],
    }).compile();

    service = module.get<BreadService>(BreadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
