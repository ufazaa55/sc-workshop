import { router, publicProcedure } from "./trpc";
import mongoose from "mongoose";
import { z } from "zod";

const kittySchema = new mongoose.Schema({
    name: String,
    age: Number,
});

const Kitten = mongoose.model("Kitten", kittySchema);

const addKitten = publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
        const newKitten = new Kitten({ name: input, age: 0 });
        await newKitten.save();
        return newKitten.toJSON();
    });

const findKitten = publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
        const kitten = await Kitten.findOne({ name: input });
        if (kitten?.age != undefined) {
            kitten.age += 1;
            await kitten.save();
            return kitten.toJSON();
        }
        else {
            return kitten;
        }
    });

export const dbRouter = router({
    addKitten,
    findKitten,
});