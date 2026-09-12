import { readFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(process.cwd())
const outDir = path.join(root, 'public')
const svgSrc = path.join(outDir, 'logo.svg')
const ogSvg = path.join(outDir, 'og-image.svg')

const sizes = [16, 32, 48, 64, 192, 512]

async function run() {
  const source = await readFile(svgSrc)

  await sharp(source).resize(64, 64).png().toFile(path.join(outDir, 'favicon.png'))
  await sharp(source).resize(512, 512).png().toFile(path.join(outDir, 'logo.png'))

  for (const size of sizes) {
    const name = size === 16 || size === 32 ? `favicon-${size}x${size}.png` : `icon-${size}x${size}.png`
    await sharp(source).resize(size, size).png().toFile(path.join(outDir, name))
  }

  await sharp(source).resize(192, 192).png().toFile(path.join(outDir, 'issue-finder.png'))

  const og = await readFile(ogSvg)
  await sharp(og).resize(1200, 630).png().toFile(path.join(outDir, 'og-image.png'))

  console.log('Generated simple clean icons + og-image')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
