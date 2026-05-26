import { Module } from '@nestjs/common';
import { RabbitMqModule } from '../messaging/rabbitmq.module';
import { PrismaModule } from '../prisma/prisma.module';
import { StoryGenerationController } from './story-generation.controller';
import { StoryGenerationService } from './story-generation.service';

@Module({
  imports: [PrismaModule, RabbitMqModule],
  controllers: [StoryGenerationController],
  providers: [StoryGenerationService],
})
export class StoryGenerationModule {}
