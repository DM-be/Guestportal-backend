import { Test, TestingModule } from '@nestjs/testing';
import { ActiveDirectoryService } from './active-directory.service';

describe('ActiveDirectoryService', () => {
  let service: ActiveDirectoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActiveDirectoryService],
    }).compile();

    service = module.get<ActiveDirectoryService>(ActiveDirectoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
