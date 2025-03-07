import { Context, Middleware } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

type CommandFn = Middleware<Context<Update>>;
export type Commands = Record<string, CommandFn>;