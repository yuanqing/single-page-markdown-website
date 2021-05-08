import path from 'path'

const imagesDirectoryName = 'images'

export function resolveNewImageFilePath(
  imageSrc: string,
  usedFilePaths: Array<string>
): string {
  let newFilePath = path.join(imagesDirectoryName, path.basename(imageSrc))
  if (usedFilePaths.indexOf(newFilePath) === -1) {
    return newFilePath
  }
  // Add a numeric suffix (eg. `-1`, `-2`) to create a unique file name if we
  // find that `newFilePath` was already used
  const extension = path.extname(newFilePath)
  const basename = path.basename(newFilePath, extension)
  let index = 0
  do {
    index += 1
    newFilePath = path.join(
      imagesDirectoryName,
      `${basename}-${index}${extension}`
    )
  } while (usedFilePaths.indexOf(newFilePath) !== -1)
  return newFilePath
}
