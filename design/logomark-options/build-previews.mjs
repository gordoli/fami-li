// Assemble the ImageGen-authored sprite cells; this script does not redraw the art.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const directory = dirname(fileURLToPath(import.meta.url));
const variants = [
  "01-wave",
  "02-travel",
  "03-blink",
  "04-globe",
  "05-cheer",
  "04-globe-earth",
];
for (const name of variants) {
  const source = join(directory, `${name}-sheet.png`);
  const info = JSON.parse(
    execFileSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height",
        "-of",
        "json",
        source,
      ],
      { encoding: "utf8" },
    ),
  );
  const { width, height } = info.streams[0];
  const cellWidth = Math.floor(width / 4),
    cellHeight = Math.floor(height / 2);
  const frames = mkdtempSync(join(tmpdir(), "fami-li-logo-"));
  try {
    for (let frame = 0; frame < 8; frame++) {
      const x = Math.round(((frame % 4) * width) / 4),
        y = Math.round((Math.floor(frame / 4) * height) / 2);
      execFileSync("ffmpeg", [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        source,
        "-vf",
        `crop=${cellWidth}:${cellHeight}:${x}:${y},scale=320:320:flags=neighbor,format=rgba`,
        join(frames, `frame-${String(frame).padStart(2, "0")}.png`),
      ]);
    }
    execFileSync("ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-framerate",
      "5",
      "-i",
      join(frames, "frame-%02d.png"),
      "-filter_complex",
      "[0:v]split[a][b];[a]palettegen=reserve_transparent=1:stats_mode=full[p];[b][p]paletteuse=dither=none:alpha_threshold=128",
      "-loop",
      "0",
      "-final_delay",
      "40",
      join(directory, `${name}.gif`),
    ]);
    console.log(`Built ${name}.gif`);
  } finally {
    rmSync(frames, { recursive: true, force: true });
  }
}
