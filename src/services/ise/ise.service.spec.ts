import { Test, TestingModule } from '@nestjs/testing';
import { IseService } from './ise.service';

describe('IseService', () => {
  let service: IseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IseService],
    }).compile();

    service = module.get<IseService>(IseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
