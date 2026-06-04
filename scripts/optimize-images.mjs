import fs from 'fs/promises'
import sharp from 'sharp'

const images = [
  {
    input: 'src/assets/mypic.png',
    output: 'src/assets/mypic.webp',
    width: 900,
    quality: 82,
  },
  {
    input: 'src/assets/kubestellar-icon.png',
    output: 'src/assets/kubestellar-icon.webp',
    width: 360,
    quality: 86,
  },
]

for (const image of images) {
  try {
    await fs.access(image.input)

    await sharp(image.input)
      .resize({
        width: image.width,
        withoutEnlargement: true,
      })
      .webp({
        quality: image.quality,
        effort: 6,
      })
      .toFile(image.output)

    const before = (await fs.stat(image.input)).size
    const after = (await fs.stat(image.output)).size

    console.log(`${image.input} -> ${image.output}`)
    console.log(`${(before / 1024).toFixed(1)} KB -> ${(after / 1024).toFixed(1)} KB`)
  } catch (error) {
    console.error(`Failed: ${image.input}`)
    console.error(error.message)
    process.exitCode = 1
  }
}
