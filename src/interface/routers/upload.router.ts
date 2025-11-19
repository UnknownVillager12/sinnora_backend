import { Router } from 'express';

import {
  uploadGallery,
  uploadImage,
} from '@/application/services/Upload/UploadService';
import { UploadsController } from '../controllers/upload.controller';

const router = Router();

const uploadController = new UploadsController();

router
  .route('/images')
  .post(uploadImage.single('image'), uploadController.handleNewImageUpload);

router
  .route('/gallery')
  .post(
    uploadGallery.array('gallery', 10),
    uploadController.handleGalleryUpload,
  );

export default router;
