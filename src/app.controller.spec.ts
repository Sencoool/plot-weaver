import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

const prismaMock = {
  $queryRaw: jest.fn(),
};

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    jest.clearAllMocks();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('health', () => {
    it('should return ok when database is reachable', async () => {
      prismaMock.$queryRaw.mockResolvedValueOnce(1);

      await expect(appController.getHealth()).resolves.toEqual({
        status: 'ok',
        db: 'ok',
      });
    });

    it('should return degraded when database is unreachable', async () => {
      prismaMock.$queryRaw.mockRejectedValueOnce(new Error('DB down'));

      await expect(appController.getHealth()).resolves.toEqual({
        status: 'degraded',
        db: 'error',
      });
    });
  });
});
