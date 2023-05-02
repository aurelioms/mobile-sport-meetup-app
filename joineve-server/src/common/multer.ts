import multer, { MulterError } from 'multer'
import { nanoid } from 'nanoid'
import path from 'path'

import { ENV } from '../env'
import { createFieldError, InternalStatus } from '../error'
import { Handler } from '../handler'

export const mediaPath = path.join(process.cwd(), ENV.FILE_DIRECTORY)

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    console.log('file', mediaPath)
    callback(null, mediaPath)
  },
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname)
    const filename = path.parse(file.originalname).name

    callback(null, `${filename}-${nanoid(8)}${ext}`)
  },
})

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg']

export const uploadMedia = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname)

    if (ALLOWED_EXTENSIONS.every((ext) => extension !== ext)) {
      return callback(new Error('File not supported'))
    }

    callback(null, true)
  },
}).single('file')

export const mediaUploadHandler: Handler = async (req, res, next) => {
  uploadMedia(req, res, function (error) {
    const { key } = req.body

    if (error instanceof MulterError) {
      return next(
        createFieldError(InternalStatus.BODY_VALIDATION, [
          { key, message: 'Maximum upload size is 5Mb' },
        ]),
      )
    }

    if (error && error.message === 'File not supported') {
      return next(
        createFieldError(InternalStatus.BODY_VALIDATION, [
          { key, message: error.message },
        ]),
      )
    }

    res.json({
      file: req.file,
    })
  })
}
