import { AsyncLocalStorage } from "async_hooks";

export const asyncLS = new AsyncLocalStorage<string>();
