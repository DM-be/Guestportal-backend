import { Test, TestingModule } from '@nestjs/testing';
import { GuestUserService } from './guest-user.service';

describe('GuestUserService', () => {
  let service: GuestUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuestUserService],
    }).compile();

    service = module.get<GuestUserService>(GuestUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
