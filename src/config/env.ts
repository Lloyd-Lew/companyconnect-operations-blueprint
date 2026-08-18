import { z } from "zod";

const environmentSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  DEMO_MODE: z.enum(["true", "false"]).default("true")
});

export type Environment = z.infer<typeof environmentSchema>;

export const environment = environmentSchema.parse({
  PORT: process.env.PORT,
  LOG_LEVEL: process.env.LOG_LEVEL,
  DEMO_MODE: process.env.DEMO_MODE
});
