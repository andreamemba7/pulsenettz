# Halenoir webfont files

The site's headings (and body text) are set in **Halenoir**. It is a commercial
typeface, so the font files are not committed here — add your licensed **webfont
(WOFF2)** files to this folder with these exact names:

| File                     | Weight |
| ------------------------ | ------ |
| `Halenoir-Regular.woff2` | 400    |
| `Halenoir-Medium.woff2`  | 500    |
| `Halenoir-SemiBold.woff2`| 600    |
| `Halenoir-Bold.woff2`    | 700    |

The `@font-face` rules that load them live at the top of `../styles.css`.

Until the files are present, headings fall back to the system sans-serif stack.

A webfont licence for Halenoir is available from MyFonts / the insigne foundry:
https://www.myfonts.com/collections/halenoir-font-insigne
