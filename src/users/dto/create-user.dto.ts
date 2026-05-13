import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createUserSchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(1).optional(),
    password: z.string().min(6),
  })
  .meta({ id: 'CreateUser' });

export class CreateUserDto extends createZodDto(createUserSchema) {}
