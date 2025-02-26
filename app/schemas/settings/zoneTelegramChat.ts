import { z } from "zod";

export const ZoneTelegramChat = z
  .object({
    zoneId: z.number({ message: "Zone Id is required" }),
    chatLink: z.string().url({ message: "Chat Link is required" }),
  })
  .transform((zoneTelegramChat) => ({
    ...zoneTelegramChat,
    chatId: (() => {
      const url = zoneTelegramChat.chatLink;
      const parsedUrl = new URL(url);
      return parsedUrl.hash.substring(1);
    })(),
  }));