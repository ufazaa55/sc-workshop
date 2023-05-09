"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trpcExpress = __importStar(require("@trpc/server/adapters/express"));
const express_2 = require("trpc-playground/handlers/express");
const zod_1 = require("zod");
const trpc_1 = require("./trpc");
const router_1 = require("./router");
const mongoose = __importStar(require("mongoose"));
const runApp = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    const port = 3000;
    const trpcEndpoint = "/api/trpc";
    const playgroundEndpoint = "/playground";
    yield mongoose.connect("mongodb://root:root@localhost:27017/sclearn?authSource=admin");
    const schema = zod_1.z.object({
        name: zod_1.z
            .string()
            .toUpperCase()
            .transform((n) => n.length),
        age: zod_1.z
            .number()
            .refine((n) => n > 0 && n <= 50, "Age must be between 0 - 50"),
    });
    const lineSchema = zod_1.z.object({
        message: zod_1.z.string().max(1000),
    });
    app.use(trpcEndpoint, trpcExpress.createExpressMiddleware({
        router: router_1.appRouter,
        createContext: trpc_1.createContext,
    }));
    app.use(playgroundEndpoint, yield (0, express_2.expressHandler)({
        trpcApiEndpoint: trpcEndpoint,
        playgroundEndpoint,
        router: router_1.appRouter,
    }));
    app.get("/", (req, res) => {
        const rt = {
            age: 30,
            name: 2,
        };
        res.json(rt);
    });
    app.post("/", (req, res) => {
        const input = schema.safeParse(req.body);
        if (input.success) {
            res.send(`Hello ${input.data.name} ${input.data.age}!`);
        }
        else {
            res.json(input.error);
        }
    });
    app.post("/line", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const input = lineSchema.safeParse(req.body);
        if (!input.success) {
            res.json(input.error);
            return;
        }
        const formData = new FormData();
        formData.append("message", input.data.message);
        yield fetch("https://notify-api.line.me/api/notify", {
            method: "POST",
            headers: {
                Authorization: `Bearer rRNFMLCc3KAK1EXd7Tu0CpEKy6aQPnGJH2gADm8LOcm`,
            },
            body: formData,
        })
            .then((v) => v.json())
            .then((v) => res.json(v))
            .catch((e) => res.json(e));
    }));
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
runApp();
