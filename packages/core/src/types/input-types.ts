import { z } from "zod";

export const inputType = z.object({
  name: z.string(),
  age: z.number(),
});

export const Room = z.object({
  name: z.string(),
  users: z.array(
    z.object({
      socket: z.string(),
      messages: z.array(z.string()),
    })
  ),
});

export type InputType = z.infer<typeof inputType>;
export type RoomType = z.infer<typeof Room>;
