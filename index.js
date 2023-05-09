"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const app = (0, express_1.default)();
const port = 3000;
const schema = zod_1.z.object({
    name: zod_1.z.string(),
    lastName: zod_1.z.string(),
    age: zod_1.z.number().refine((n) => n === 30, "age must be equal 30"),
});
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello World Hi!");
});
app.post("/", (req, res) => {
    const input = schema.safeParse(req.body);
    if (input.success) {
        res.send(`Hello ${input.data.name} ${input.data.lastName} ${input.data.age} !`);
    }
    else {
        res.json(input.error);
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
