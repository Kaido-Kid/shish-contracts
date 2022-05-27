const fs = require('fs')
const path = require('path')

const videosDirName = 'nft-visual/test-videos'
const imagesDirName = 'nft-visual/test-images'

// renames the images in a given folder to hexadecimal sequence eg: 1,2,3,4,5,6,7,8,9,a,b etc
function main() {
  const videosDir = path.resolve(__dirname, '..', videosDirName)
  const imagesDir = path.resolve(__dirname, '..', imagesDirName)

  let videosFileNames = getAllFileNames(videosDir)
  let imagesFileNames = getAllFileNames(imagesDir)

  console.log('Videos: No. of files => ', videosFileNames.length)
  console.log('Filenames: ', videosFileNames)

  console.log('Images: No. of files => ', imagesFileNames.length)
  console.log('Filenames: ', imagesFileNames)

  // if (!videosFileNames.length === imagesFileNames.length) return error

  const videosfileExtension = path.extname(videosFileNames[0] || '')
  const imagesfileExtension = path.extname(imagesFileNames[0] || '')
  // extract filenames without extension
  videosFileNames = videosFileNames.map((fileName) => path.parse(fileName).name)
  imagesFileNames = imagesFileNames.map((fileName) => path.parse(fileName).name)

  let counter = 1

  // In first pass we prepend filenames with hexString separated by comma
  // we do this to avoid overriding filenames already in hexadecimal format
  videosFileNames.map((fileName) => {
    try {
      const hexString = parseInt(counter, 10).toString(16)
      fs.renameSync(
        `${videosDir}/${fileName}${videosfileExtension}`,
        `${videosDir}/${hexString}_${fileName}${videosfileExtension}`
      )
      counter++
    } catch (err) {
      console.log(
        'error ocurred while adding hexString to the beginning of filenames: ',
        fileName
      )
      throw err
    }
  })
  counter = 1

  imagesFileNames.map((fileName) => {
    try {
      const hexString = parseInt(counter, 10).toString(16)
      fs.renameSync(
        `${imagesDir}/${fileName}${imagesfileExtension}`,
        `${imagesDir}/${hexString}_${fileName}${imagesfileExtension}`
      )
      counter++
    } catch (err) {
      console.log(
        'error ocurred while adding hexString to the beginning of filenames: ',
        fileName
      )
      throw err
    }
  })
  counter = 1

  // in second pass we actually rename files to hexString
  videosFileNames.map((fileName) => {
    try {
      const hexString = parseInt(counter, 10).toString(16)
      fs.renameSync(
        `${videosDir}/${hexString}_${fileName}${videosfileExtension}`,
        `${videosDir}/${hexString}${videosfileExtension}`
      )
      console.log(
        `rename successful for file: ${fileName}${videosfileExtension} to ${hexString}${videosfileExtension}`
      )
      counter++
    } catch (err) {
      console.log('error ocurred while renaming file: ', fileName)
      throw err
    }
  })
  counter = 1

  imagesFileNames.map((fileName) => {
    try {
      const hexString = parseInt(counter, 10).toString(16)
      fs.renameSync(
        `${imagesDir}/${hexString}_${fileName}${imagesfileExtension}`,
        `${imagesDir}/${hexString}${imagesfileExtension}`
      )
      console.log(
        `rename successful for file: ${fileName}${imagesfileExtension} to ${hexString}${imagesfileExtension}`
      )
      counter++
    } catch (err) {
      console.log('error ocurred while renaming file: ', fileName)
      throw err
    }
  })
  console.log('All files renamed successfully in directory')
}

main()

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
