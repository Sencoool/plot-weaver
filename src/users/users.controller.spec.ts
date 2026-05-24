import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const serviceMock = {
  create: jest.fn(),
  login: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates a user', async () => {
    serviceMock.create.mockResolvedValue({ id: 'user-1' });

    const result = await controller.create({
      email: 'test@example.com',
      name: 'Test User',
      password: 'secret123',
    });

    expect(serviceMock.create).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'Test User',
      password: 'secret123',
    });
    expect(result).toEqual({ id: 'user-1' });
  });

  it('logs in a user', async () => {
    serviceMock.login.mockResolvedValue({ user: { id: 'user-1' } });

    const result = await controller.login({
      email: 'test@example.com',
      password: 'secret123',
    });

    expect(serviceMock.login).toHaveBeenCalledWith(
      'test@example.com',
      'secret123',
    );
    expect(result).toEqual({ user: { id: 'user-1' } });
  });

  it('lists users', async () => {
    serviceMock.findAll.mockResolvedValue([{ id: 'user-1' }]);

    const result = await controller.findAll();

    expect(serviceMock.findAll).toHaveBeenCalledWith();
    expect(result).toEqual([{ id: 'user-1' }]);
  });

  it('gets a user by id', async () => {
    serviceMock.findOne.mockResolvedValue({ id: 'user-1' });

    const result = await controller.findOne('user-1');

    expect(serviceMock.findOne).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({ id: 'user-1' });
  });

  it('updates a user', async () => {
    serviceMock.update.mockResolvedValue({ id: 'user-1' });

    const result = await controller.update('user-1', {
      email: 'new@example.com',
      name: 'New Name',
    });

    expect(serviceMock.update).toHaveBeenCalledWith('user-1', {
      email: 'new@example.com',
      name: 'New Name',
    });
    expect(result).toEqual({ id: 'user-1' });
  });

  it('removes a user', async () => {
    serviceMock.remove.mockResolvedValue({ id: 'user-1' });

    const result = await controller.remove('user-1');

    expect(serviceMock.remove).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({ id: 'user-1' });
  });
});
