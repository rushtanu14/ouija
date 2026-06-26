import { createApp } from "./app";

const port = Number(process.env.PORT ?? 8787);

createApp().listen(port, "127.0.0.1", () => {
  console.log(`Ouija API listening on http://127.0.0.1:${port}`);
});
