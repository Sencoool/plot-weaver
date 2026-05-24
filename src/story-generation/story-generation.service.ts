import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoryGenerationDto } from './dto/create-story-generation.dto';
import { FindStoryGenerationDto } from './dto/find-story-generation.dto';
import { UpdateStoryGenerationDto } from './dto/update-story-generation.dto';

@Injectable()
export class StoryGenerationService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateStoryGenerationDto) {
    return this.prisma.storyGenerationRequest.create({
      data: {
        novelId: input.novelId ?? null,
        prompt: input.prompt,
        mode: input.mode,
        status: 'pending',
        provider: input.provider,
        model: input.model ?? null,
        temperature: input.temperature ?? null,
        maxTokens: input.maxTokens ?? null,
      },
    });
  }

  findAll(status?: FindStoryGenerationDto['status']) {
    return this.prisma.storyGenerationRequest.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.storyGenerationRequest.findUnique({
      where: { id },
    });
  }

  update(id: string, input: UpdateStoryGenerationDto) {
    return this.prisma.storyGenerationRequest.update({
      where: { id },
      data: {
        status: input.status,
        output: input.output,
        error: input.error,
        externalJobId: input.externalJobId,
      },
    });
  }
}
