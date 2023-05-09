import { initTRPC, inferAsyncReturnType } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";
export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();
export const router = t.router;
export const publicProcedure = t.procedure;

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
        Authorization: `Bearer s7ykEMVQMA5JQbq8OuexUtKwgdDRmFfD1mq2nqxo5t6`,
      },
      body: formData,
    })
      .then((v) => v.json())
      .catch((e) => e);
    return lineResult;
  }),
});
export type AppRouter = typeof appRouter;