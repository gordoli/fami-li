import { cpSync, existsSync } from "node:fs";
const source = new URL("../apps/web/out/", import.meta.url);
const target = new URL("../out/", import.meta.url);
if (!existsSync(new URL("index.html", source)))
  throw new Error(
    "The Next.js static export is missing. Run the web build first.",
  );
cpSync(source, target, { recursive: true });
