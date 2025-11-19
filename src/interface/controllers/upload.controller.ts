import cloudinary from '@/config/cloudinary';
import { Request, Response } from 'express';

export class UploadsController {
  handleNewImageUpload = async (req: any, res: Response) => {
    try {
      if (!req.file) {
        throw new Error('400::No file attached');
      }

      let uploadResult:any;

      // Upload to Cloudinary with temp tag
      await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: 'auto', upload_preset: 'temp_upload' },
            (error, result) => {
              if (error) {
                return reject(
                  new Error(`Cloudinary upload failed: ${error.message}`),
                );
              }
              uploadResult = result;
              resolve(result);
            },
          )
          .end(req.file.buffer);
      });
      console.log('Upload successful:', uploadResult);
      return res.status(200).json({
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      });
 
    } catch (error: any) {
      res.status(error.message.startsWith('400') ? 400 : 500).json({
        error: error.message,
      });
    }
  };

  handleGalleryUpload = async (req: any, res: Response) => {
    const results = [];
    try {
      const files = req.files;
      if (!files || files.length === 0) {
        throw new Error('400::No files attached');
      }

      // Upload each file to Cloudinary
      for (const file of files) {
        let uploadResult;
        await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { resource_type: 'auto', upload_preset: 'temp_upload' },
              (error, result) => {
                if (error) {
                  return reject(
                    new Error(`Cloudinary upload failed: ${error.message}`),
                  );
                }
                uploadResult = result;
                resolve(result);
              },
            )
            .end(file.buffer);
        });

        results.push({
          public_id: uploadResult.public_id,
          url: uploadResult.secure_url,
        });
      }

      res.json({ images: results });
    } catch (error: any) {
      // Clean up any successfully uploaded images if an error occurs
      for (const result of results) {
        await cloudinary.uploader.destroy(result.public_id);
        console.error('Deleted orphaned image:', result.public_id);
      }
      res.status(error.message.startsWith('400') ? 400 : 500).json({
        error: error.message,
      });
    }
  };
}
