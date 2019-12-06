import { Test, TestingModule } from '@nestjs/testing';
import { Pkcs11Service } from './pkcs11.service';

describe('Pkcs11Service', () => {
  let service: Pkcs11Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Pkcs11Service],
    }).compile();

    service = module.get<Pkcs11Service>(Pkcs11Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
