import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

const prismaMock = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a user with hashed password', async () => {
    (argon2.hash as jest.Mock).mockResolvedValue('hashed');
    prismaMock.user.create.mockResolvedValue({ id: 'user-1' });

    const result = await service.create({
      email: 'test@example.com',
      name: 'Test User',
      password: 'secret123',
    });

    expect(argon2.hash).toHaveBeenCalledWith('secret123');
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed',
      },
    });
    expect(result).toEqual({ id: 'user-1' });
  });

  it('lists users ordered by creation date', async () => {
    prismaMock.user.findMany.mockResolvedValue([{ id: 'user-1' }]);

    const result = await service.findAll();

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual([{ id: 'user-1' }]);
  });

  it('finds a user by id', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 'user-1' });

    const result = await service.findOne('user-1');

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
    });
    expect(result).toEqual({ id: 'user-1' });
  });

  it('updates a user', async () => {
    prismaMock.user.update.mockResolvedValue({ id: 'user-1' });

    const result = await service.update('user-1', {
      email: 'new@example.com',
      name: 'New Name',
    });

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: {
        email: 'new@example.com',
        name: 'New Name',
      },
    });
    expect(result).toEqual({ id: 'user-1' });
  });

  it('removes a user', async () => {
    prismaMock.user.delete.mockResolvedValue({ id: 'user-1' });

    const result = await service.remove('user-1');

    expect(prismaMock.user.delete).toHaveBeenCalledWith({
      where: { id: 'user-1' },
    });
    expect(result).toEqual({ id: 'user-1' });
  });

  it('returns error when login email not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const result = await service.login('missing@example.com', 'secret');

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'missing@example.com' },
    });
    expect(result).toEqual({ error: 'Invalid email or password' });
  });

  it('returns error when password is invalid', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      password: 'hashed',
    });
    (argon2.verify as jest.Mock).mockResolvedValue(false);

    const result = await service.login('test@example.com', 'wrong');

    expect(argon2.verify).toHaveBeenCalledWith('hashed', 'wrong');
    expect(result).toEqual({ error: 'Invalid email or password' });
  });

  it('returns user when login succeeds', async () => {
    const user = { id: 'user-1', password: 'hashed' };
    prismaMock.user.findUnique.mockResolvedValue(user);
    (argon2.verify as jest.Mock).mockResolvedValue(true);

    const result = await service.login('test@example.com', 'secret');

    expect(argon2.verify).toHaveBeenCalledWith('hashed', 'secret');
    expect(result).toEqual({ user });
  });
});
