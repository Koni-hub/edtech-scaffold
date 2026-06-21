import sharp from "sharp"
import fs from "fs"
import path from "path"

const svg = fs.readFileSync("public/logo.svg", "utf8")

const sizes = [192, 512]

await Promise.all(
  sizes.map((s) => {
    return sharp(Buffer.from(svg))
      .resize(s, s)
      .png()
      .toFile(`public/icon-${s}x${s}.png`)
  })
)

console.log("Icons generated:", sizes.map((s) => `icon-${s}x${s}.png`).join(", "))
