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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbRouter = void 0;
const trpc_1 = require("./trpc");
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const kittySchema = new mongoose_1.default.Schema({
    name: String,
    age: Number,
});
const Kitten = mongoose_1.default.model("Kitten", kittySchema);
const addKitten = trpc_1.publicProcedure
    .input(zod_1.z.string())
    .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
    const newKitten = new Kitten({ name: input, age: 0 });
    yield newKitten.save();
    return newKitten.toJSON();
}));
const findKitten = trpc_1.publicProcedure
    .input(zod_1.z.string())
    .query(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
    const kitten = yield Kitten.findOne({ name: input });
    if ((kitten === null || kitten === void 0 ? void 0 : kitten.age) != undefined) {
        kitten.age += 1;
        yield kitten.save();
        return kitten.toJSON();
    }
    else {
        return kitten;
    }
}));
exports.dbRouter = (0, trpc_1.router)({
    addKitten,
    findKitten,
});
