import z from "zod";
import { loginSchema } from "../schemas/loginSchema";

export type LoginSchema = z.infer<typeof loginSchema>;
