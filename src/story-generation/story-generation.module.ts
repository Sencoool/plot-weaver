import { Module } from '@nestjs/common';
import { StoryGenerationController } from './story-generation.controller';
import { StoryGenerationService } from './story-generation.service';

@Module({
  controllers: [StoryGenerationController],
  providers: [StoryGenerationService],
})
export class StoryGenerationModule {}
