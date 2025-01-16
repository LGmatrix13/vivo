import { z } from "zod";

export const ZoneTelegramChat = z
  .object({
    zoneId: z.number(),
    chatLink: z.string().url(),
  })
  .transform((zoneTelegramChat) => ({
    ...zoneTelegramChat,
    chatId: (() => {
      const url = zoneTelegramChat.chatLink;
      const parsedUrl = new URL(url);
      return parsedUrl.hash.substring(1);
    })(),
  }));
