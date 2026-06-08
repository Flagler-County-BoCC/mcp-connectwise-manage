import { type ZodType, type ZodTypeDef } from 'zod';
import { ValidationError } from '../errors/index.js';

export function validate<Output, Def extends ZodTypeDef, Input>(
  schema: ZodType<Output, Def, Input>,
  data: unknown,
): Output {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error.issues);
  }
  return result.data;
}
