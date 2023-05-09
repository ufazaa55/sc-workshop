import express from "express";
import { z } from "zod";
const app = express();
const port = 3000;

const schema = z.object({
    name: z.string(),
    lastName: z.string(),
    age: z.number().refine((n) => n === 30 , "age must be equal 30"),
});

app.use(express.json());

app.get("/", (req, res) => {
    const rt:z.infer <typeof schema> = {
        name: "ufa",
        lastName: "manit",
        age: 30,
    };
    res.send("Hello World Hi!");
});

app.post("/", (req, res) => {
    const input = schema.safeParse(req.body);
    if (input.success){
        res.send(`Hello ${input.data.name} ${input.data.lastName} ${input.data.age} !`);
    }
    else {
        res.json(input.error);
      }
   
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});