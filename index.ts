import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { expressHandler } from "trpc-playground/handlers/express";
import { z } from "zod";
import { createContext } from "./trpc";
import { appRouter } from "./router";
import * as mongoose from "mongoose";
const runApp = async () => {
  const app = express();
  app.use(express.json());
  const port = 3000;
  const trpcEndpoint = "/api/trpc";
  const playgroundEndpoint = "/playground";
  await mongoose.connect(
    "mongodb://root:root@localhost:27017/sclearn?authSource=admin"
  );

  const schema = z.object({
    name: z
      .string()
      .toUpperCase()
      .transform((n) => n.length),
    age: z
      .number()
      .refine((n) => n > 0 && n <= 50, "Age must be between 0 - 50"),
  });

  const lineSchema = z.object({
    message: z.string().max(1000),
  });

  app.use(
    trpcEndpoint,
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.use(
    playgroundEndpoint,
    await expressHandler({
      trpcApiEndpoint: trpcEndpoint,
      playgroundEndpoint,
      router: appRouter,
    })
  );

  app.get("/", (req, res) => {
    const rt: z.infer<typeof schema> = {
      age: 30,
      name: 2,
    };
    res.json(rt);
  });

  app.post("/", (req, res) => {
    const input = schema.safeParse(req.body);
    if (input.success) {
      res.send(`Hello ${input.data.name} ${input.data.age}!`);
    } else {
      res.json(input.error);
    }
  });

  app.post("/line", async (req, res) => {
    const input = lineSchema.safeParse(req.body);
    if (!input.success) {
      res.json(input.error);
      return;
    }
    const formData = new FormData();
    formData.append("message", input.data.message);
    await fetch("https://notify-api.line.me/api/notify", {
      method: "POST",
      headers: {
        Authorization: `Bearer rRNFMLCc3KAK1EXd7Tu0CpEKy6aQPnGJH2gADm8LOcm`,
      },
      body: formData,
    })
      .then((v) => v.json())
      .then((v) => res.json(v))
      .catch((e) => res.json(e));
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

runApp();