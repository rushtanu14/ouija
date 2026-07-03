import { createApp } from "./app";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const port = Number(process.env.PORT ?? 8787);
const host = process.env.HOST ?? (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");
const distDir = fileURLToPath(new URL("../dist", import.meta.url));
const staticDir = existsSync(distDir) ? distDir : undefined;

createApp({ staticDir }).listen(port, host, () => {
  console.log(`Ouija server listening on http://${host}:${port}`);
});
