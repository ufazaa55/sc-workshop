"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const db_1 = require("./db");
const trpc_1 = require("./trpc");
const zod_1 = require("zod");
const lineSchema = zod_1.z.object({
    message: zod_1.z.string().max(1000),
});
exports.appRouter = (0, trpc_1.router)({
    lineMessage: trpc_1.publicProcedure.input(lineSchema).mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const formData = new FormData();
        formData.append("message", input.message);
        const lineResult = yield fetch("https://notify-api.line.me/api/notify", {
            method: "POST",
            headers: {
                Authorization: `Bearer rRNFMLCc3KAK1EXd7Tu0CpEKy6aQPnGJH2gADm8LOcm`,
            },
            body: formData,
        })
            .then((v) => v.json())
            .catch((e) => e);
        return lineResult;
    })),
    database: db_1.dbRouter,
});
