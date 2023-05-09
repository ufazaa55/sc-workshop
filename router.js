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
exports.appRouter = exports.publicProcedure = exports.router = exports.createContext = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const createContext = ({ req, res, }) => ({}); // no context
exports.createContext = createContext;
const t = server_1.initTRPC.context().create();
exports.router = t.router;
exports.publicProcedure = t.procedure;
const lineSchema = zod_1.z.object({
    message: zod_1.z.string().max(1000),
});
exports.appRouter = (0, exports.router)({
    lineMessage: exports.publicProcedure.input(lineSchema).mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const formData = new FormData();
        formData.append("message", input.message);
        const lineResult = yield fetch("https://notify-api.line.me/api/notify", {
            method: "POST",
            headers: {
                Authorization: `Bearer s7ykEMVQMA5JQbq8OuexUtKwgdDRmFfD1mq2nqxo5t6`,
            },
            body: formData,
        })
            .then((v) => v.json())
            .catch((e) => e);
        return lineResult;
    })),
});
