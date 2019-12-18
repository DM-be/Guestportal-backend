import { Test, TestingModule } from '@nestjs/testing';
import { GuestUserController } from './guest-user.controller';

describe('GuestUser Controller', () => {
  let controller: GuestUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuestUserController],
    }).compile();

    controller = module.get<GuestUserController>(GuestUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
