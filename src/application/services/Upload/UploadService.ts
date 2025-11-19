import multer from 'multer';
import path from 'path';

function ensureIsSupported(file: any, cb: any, fileTypes: RegExp) {
  const extension = fileTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  if (extension) {
    return cb(null, true);
  } else {
    cb(new Error('File type not supported'));
  }
}

const memoryStorage = multer.memoryStorage();

export const uploadImage = multer({
  storage: memoryStorage,
  fileFilter: function (req, file, cb) {
    ensureIsSupported(file, cb, /\.(jpg|jpeg|png|heic|webp)$/i);
  },
});

export const uploadGallery = multer({
  storage: memoryStorage,
  fileFilter: function (req, file, cb) {
    ensureIsSupported(file, cb, /\.(jpg|jpeg|png|heic|webp)$/i);
  },
});
