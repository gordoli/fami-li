# Fami-Li pixel chibi logomarks

Generated with the built-in ImageGen tool from the supplied family photograph. Original character art is preserved in sprite sheets. `build-previews.mjs` uses FFmpeg only to assemble the generated cells into looping GIF previews.

| Option                | Animation                                |
| --------------------- | ---------------------------------------- |
| 01 — Hello, Fami-Li   | `01-wave.gif` — greeting wave            |
| 02 — Little Travelers | `02-travel.gif` — walking in place       |
| 03 — Photo Booth      | `03-blink.gif` — portrait blinks         |
| 04 — Around the World | `04-globe.gif` — family on a globe       |
| 05 — Together         | `05-cheer.gif` — little collective cheer |

The selected design is **04, revised to natural Earth colors**: `04-globe-earth.gif` and `04-globe-earth-sheet.png`. The unselected versions are retained for design history. `prompts.json` contains the exact original prompt set.

The chosen frame is exported to `apps/web/public/brand/fami-li-mark.png` and used for Next.js favicon, app icon, and Apple icon. `apps/web/public/brand/fami-li-mark.gif` is the animated export. The current 16:9 social preview is `apps/web/public/og-fami-li-adventures-v2.png` (1600×900): the approved favicon art above the exact title “The Fami-Li Adventures,” typeset in Poppins SemiBold on pure white. `build-social-image.mjs` composes it with Next.js ImageResponse; it fetches the official Google Fonts Poppins TTF when run. The original generated `og-image.png` remains as an earlier design export.

Selected palette-edit prompt: preserve all four people, outfits, poses, frame placement, pixel style, and transparency; change only the purple globe to blue oceans with green/tan land in all eight frames, retaining purple sparkle accents.

Social-card prompt: one exact family-and-Earth mark centered on pure white in a 16:9 landscape card; underneath, the exact text “Fami-Li Adventures” in a rounded geometric sans-serif resembling Poppins SemiBold; generous spacing, no other text, borders, or scenery.

## Animated site mark

`06-adventure-loop.gif` is the final 12-frame wave/walk/Earth loop generated with the built-in ImageGen tool. The original frame sheet, exact prompt, and cell metadata are saved alongside it. `build-adventure-loop.mjs` assembles its frames with FFmpeg and exports `fami-li-adventure.gif` plus a matching static poster under `apps/web/public/brand`. The site uses native picture-source selection to show the static poster for reduced-motion users, avoiding hydration differences.
