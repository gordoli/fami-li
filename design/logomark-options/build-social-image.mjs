import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";

// Optional design command: node design/logomark-options/build-social-image.mjs
// Reuse the approved favicon art; compose the title as actual Poppins text.
const fontResponse = await fetch(
  "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-SemiBold.ttf",
);
if (!fontResponse.ok) throw new Error("Could not load the Poppins font");
const mark = await readFile(
  new URL("../../apps/web/public/brand/fami-li-mark.png", import.meta.url),
);
const image = new ImageResponse(
  h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        color: "#201b28",
        fontFamily: "Poppins",
        gap: 36,
      },
    },
    h("img", {
      src: `data:image/png;base64,${mark.toString("base64")}`,
      width: 440,
      height: 440,
    }),
    h(
      "div",
      { style: { display: "flex", fontSize: 72, fontWeight: 600 } },
      "The Fami-Li Adventures",
    ),
  ),
  {
    width: 1600,
    height: 900,
    fonts: [
      {
        name: "Poppins",
        data: await fontResponse.arrayBuffer(),
        weight: 600,
        style: "normal",
      },
    ],
  },
);
const output = new URL(
  "../../apps/web/public/og-fami-li-adventures-v2.png",
  import.meta.url,
);
await writeFile(output, Buffer.from(await image.arrayBuffer()));
console.log(`Wrote ${fileURLToPath(output)}`);
