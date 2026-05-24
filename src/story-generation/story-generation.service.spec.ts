import { Test, TestingModule } from '@nestjs/testing';
import { StoryGenerationService } from './story-generation.service';
import { PrismaService } from '../prisma/prisma.service';

const prismaMock = {
  storyGenerationRequest: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('StoryGenerationService', () => {
  let service: StoryGenerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoryGenerationService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<StoryGenerationService>(StoryGenerationService);
    jest.clearAllMocks();
  });

  it('creates a story generation request', async () => {
    prismaMock.storyGenerationRequest.create.mockResolvedValue({ id: 'req-1' });

    const result = await service.create({
      novelId: 'novel-1',
      prompt: 'Write a short scene about a storm.',
      mode: 'co_author',
      provider: 'gemini',
      model: 'gemini-2.0-flash',
      temperature: 0.7,
      maxTokens: 300,
    });

    expect(prismaMock.storyGenerationRequest.create).toHaveBeenCalledWith({
      data: {
        novelId: 'novel-1',
        prompt: 'Write a short scene about a storm.',
        mode: 'co_author',
        status: 'pending',
        provider: 'gemini',
        model: 'gemini-2.0-flash',
        temperature: 0.7,
        maxTokens: 300,
      },
    });
    expect(result).toEqual({ id: 'req-1' });
  });

  it('lists generation requests without status filter', async () => {
    prismaMock.storyGenerationRequest.findMany.mockResolvedValue([
      { id: 'req-1' },
    ]);

    const result = await service.findAll();

    expect(prismaMock.storyGenerationRequest.findMany).toHaveBeenCalledWith({
      where: undefined,
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual([{ id: 'req-1' }]);
  });

  it('lists generation requests with status filter', async () => {
    prismaMock.storyGenerationRequest.findMany.mockResolvedValue([
      { id: 'req-2' },
    ]);

    const result = await service.findAll('processing');

    expect(prismaMock.storyGenerationRequest.findMany).toHaveBeenCalledWith({
      where: { status: 'processing' },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual([{ id: 'req-2' }]);
  });

  it('updates a story generation request', async () => {
    prismaMock.storyGenerationRequest.update.mockResolvedValue({ id: 'req-3' });

    const result = await service.update('req-3', {
      status: 'completed',
      output: 'Final story output',
    });

    expect(prismaMock.storyGenerationRequest.update).toHaveBeenCalledWith({
      where: { id: 'req-3' },
      data: {
        status: 'completed',
        output: 'Final story output',
        error: undefined,
        externalJobId: undefined,
      },
    });
    expect(result).toEqual({ id: 'req-3' });
  });
});
