import { dbRouter } from "./db";
import { router, publicProcedure } from "./trpc";
import { z } from "zod";

const lineSchema = z.object({
  message: z.string().max(1000),
});

export const appRouter = router({
  lineMessage: publicProcedure.input(lineSchema).mutation(async ({ input }) => {
    const formData = new FormData();
    formData.append("message", input.message);
    const lineResult = await fetch("https://notify-api.line.me/api/notify", {
      method: "POST",
      headers: {
        Authorization: `Bearer rRNFMLCc3KAK1EXd7Tu0CpEKy6aQPnGJH2gADm8LOcm`,
      },
      body: formData,
    })
      .then((v) => v.json())
      .catch((e) => e);
    return lineResult;
  }),
  database: dbRouter,
});
export type AppRouter = typeof appRouter;