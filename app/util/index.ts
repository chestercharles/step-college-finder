import { json } from "remix";

export const badRequest = <T>(data: T) => json<T>(data, { status: 400 });
