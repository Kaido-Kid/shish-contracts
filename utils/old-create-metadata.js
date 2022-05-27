const fs = require('fs')
const path = require('path')

const configFileName = 'config.json'
const videosDirName = 'nft-visual/test-videos'
const imagesDirName = 'nft-visual/test-images'
const metadataDirName = 'metadata-test'

const metadataDir = path.resolve(__dirname, '..', metadataDirName)
const useHexadecimalFormat = true

async function main() {
  const configFilePath = path.resolve(__dirname, '..', configFileName)

  const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'))
  const collectionName = config.collectionName
  const description = config.description
  const baseUri = config.baseUri
  const testImage = config.testImage
  const testAnimationUrl = config.testAnimationUrl

  const videosDir = path.resolve(__dirname, '..', videosDirName)
  const imagesDir = path.resolve(__dirname, '..', imagesDirName)

  let videosFileNames = getAllFileNames(videosDir)
  let imagesFileNames = getAllFileNames(imagesDir)

  console.log(`Filenames in videos directory: ${videosFileNames}`)
  console.log(`Filenames in images directory: ${imagesFileNames}`)

  const metadataDir = path.resolve(__dirname, '..', metadataDirName)
  createDirIfNotExists(metadataDir)

  const videosfileExtension = path.extname(videosFileNames[0] || '')
  const imagesfileExtension = path.extname(imagesFileNames[0] || '')
  // extract filenames without extension
  videosFileNames = videosFileNames.map((fileName) => path.parse(fileName).name)
  imagesFileNames = imagesFileNames.map((fileName) => path.parse(fileName).name)

  const promisesArray = videosFileNames.map((fileName, index) => {
    new Promise((resolve, reject) => {
      try {
        let hexString = null
        let sequence = null
        if (useHexadecimalFormat) {
          hexString = fileName
          sequence = parseInt(hexString, 16)
        } else {
          hexString = parseInt(index + 1, 10).toString(16)
          sequence = index + 1
        }
        createMetadataFile(
          {
            name: `${collectionName} #${sequence}`,
            description: `${description}`,
            // image: `${baseUri}/${fileName}${imagesfileExtension}`, // TODO create imageBaseUri
            image: `ipfs://QmeT9CDT7w1RbfaqJw41J1M7xQxzH6HQ9YD7HVxtBQRKzU/zzizzi.jpg`,
            // animation_url: `${baseUri}/${fileName}${videosfileExtension}`
            animation_url: `ipfs://QmaspB3wpoANoK7t8nTTj4qSYo8qWoU3iRfY3ZidozSmtn/1.mp4`
          },
          hexString
        )
      } catch (err) {
        console.log(
          `error occurred while creating metadata for file: ${fileName}. Error: ${err}`
        )
        reject(new Error('error'))
      }
      resolve()
    })
  })

  Promise.all(promisesArray)
    .then(() => console.log('metadata files creation completed successfully'))
    .catch((err) =>
      console.log('error occurred while creating metadata files: ', err)
    )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

function getAllFileNames(dir) {
  let fileNames = []
  try {
    fileNames = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((item) => !item.isDirectory())
      .map((item) => item.name)
  } catch (err) {
    console.log(
      `error occurred while getting all filenames from directory ${dir}: `,
      err
    )
    throw err
  }
  return fileNames
}

function createDirIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

function createMetadataFile(metadata, hexString) {
  // convert filename to padded hex string
  const paddedHexString = toPaddedHexString(hexString, 64)
  fs.writeFileSync(
    `${metadataDir}/${paddedHexString}.json`,
    JSON.stringify(metadata, null, 4),
    'utf8'
  )
  console.log('metadata file created successfully for file: ', hexString)
}

function toPaddedHexString(num, len) {
  return num.toString(16).padStart(len, '0')
}
