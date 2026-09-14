import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(process.cwd())
const outDir = path.join(root, 'public')
const svgSrc = path.join(outDir, 'logo.svg')

const sizes = [16, 32, 48, 64, 192, 512]

async function buildOgImage(logoPngPath) {
  const width = 1200
  const height = 630
  const logoSize = 220

  const bgSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#FAFAF8"/>
  <defs>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="#EDEAE3" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)" opacity="0.55"/>
  <circle cx="980" cy="80" r="220" fill="#D8F3EC" opacity="0.4"/>
  <circle cx="120" cy="560" r="180" fill="#F3EDE6" opacity="0.45"/>
  <text x="420" y="290" fill="#0A0A0A" font-family="Georgia, 'Times New Roman', serif" font-size="68">IssueFinder</text>
  <text x="420" y="348" fill="#404040" font-family="Arial, Helvetica, sans-serif" font-size="26">Fresh issues. Starter projects. Paid bounties.</text>
  <text x="420" y="396" fill="#737373" font-family="Arial, Helvetica, sans-serif" font-size="22">Find work that fits — and land your next PR.</text>
  <text x="420" y="460" fill="#A3A3A3" font-family="Arial, Helvetica, sans-serif" font-size="20">issuefinder.fun</text>
</svg>`)

  const logo = await sharp(logoPngPath)
    .resize(logoSize, logoSize)
    .png()
    .toBuffer()

  await sharp(bgSvg)
    .composite([{ input: logo, left: 120, top: Math.round((height - logoSize) / 2) }])
    .png()
    .toFile(path.join(outDir, 'og-image.png'))
}

async function run() {
  const source = await readFile(svgSrc)

  await sharp(source).resize(64, 64).png().toFile(path.join(outDir, 'favicon.png'))
  const logoPath = path.join(outDir, 'logo.png')
  await sharp(source).resize(512, 512).png().toFile(logoPath)

  for (const size of sizes) {
    const name = size === 16 || size === 32 ? `favicon-${size}x${size}.png` : `icon-${size}x${size}.png`
    await sharp(source).resize(size, size).png().toFile(path.join(outDir, name))
  }

  await sharp(source).resize(192, 192).png().toFile(path.join(outDir, 'issue-finder.png'))

  // Social preview always uses the exact same logo.png as the favicon mark
  await buildOgImage(logoPath)

  // Keep a lightweight SVG sidecar for editing reference (logo only note)
  await writeFile(
    path.join(outDir, 'og-image.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <!-- Generated companion: run npm run generate:icons to rebuild og-image.png from logo.svg -->
  <rect width="1200" height="630" fill="#FAFAF8"/>
  <text x="60" y="80" font-family="Arial" font-size="24" fill="#737373">og-image.png is composed from logo.png + brand copy</text>
</svg>
`
  )

  console.log('Generated icons + social preview from logo.svg')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
