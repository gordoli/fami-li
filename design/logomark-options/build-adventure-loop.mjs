// Assemble the generated animation cells without redrawing the character art.
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const directory = dirname(fileURLToPath(import.meta.url));
const metadata = JSON.parse(
  readFileSync(join(directory, "06-adventure-loop.json"), "utf8"),
);
const source = join(directory, "06-adventure-loop-sheet.png");
const destination = resolve(directory, "../../apps/web/public/brand");
const frames = mkdtempSync(join(tmpdir(), "fami-li-adventure-"));
try {
  for (let index = 0; index < metadata.frameCount; index++) {
    const x =
      Math.round(
        ((index % metadata.columns) * metadata.width) / metadata.columns,
      ) + metadata.crop.x;
    const y =
      Math.round(
        (Math.floor(index / metadata.columns) * metadata.height) /
          metadata.rows,
      ) + metadata.crop.y;
    execFileSync("ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      source,
      "-vf",
      `crop=${metadata.crop.width}:${metadata.crop.height}:${x}:${y},scale=320:320:force_original_aspect_ratio=decrease:flags=neighbor,pad=320:320:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=rgba`,
      join(frames, `frame-${String(index).padStart(2, "0")}.png`),
    ]);
  }
  const output = join(directory, "06-adventure-loop.gif");
  execFileSync("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-framerate",
    String(metadata.fps),
    "-i",
    join(frames, "frame-%02d.png"),
    "-filter_complex",
    "[0:v]split[a][b];[a]palettegen=reserve_transparent=1:stats_mode=full[p];[b][p]paletteuse=dither=none:alpha_threshold=128",
    "-loop",
    "0",
    "-final_delay",
    "80",
    output,
  ]);
  copyFileSync(output, join(destination, "fami-li-adventure.gif"));
  copyFileSync(
    join(frames, "frame-00.png"),
    join(destination, "fami-li-adventure.png"),
  );
} finally {
  rmSync(frames, { recursive: true, force: true });
}
