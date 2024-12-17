import { Request, Response, NextFunction } from 'express';
import cloudinary from '../config/cloudinary.config';
import { resizeImage } from '../utils/imageProcessor';

interface CloudinaryFile extends Express.Multer.File {
    buffer: Buffer;
}

export const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file as CloudinaryFile;
        if (!file) {
            return next(new Error('No file provided'));
        }

        const resizedBuffer = await resizeImage(file.buffer, 800, 600);

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                folder: 'star-blog',
            },
            (err, result) => {
                if (err) {
                    console.error('Cloudinary upload error:', err);
                    return next(err);
                }
                if (!result) {
                    return next(new Error('Cloudinary upload result is undefined'));
                }
                
                req.body.cloudinaryUrls = [result.secure_url];
                next();
            }
        );
        uploadStream.end(resizedBuffer);
    } catch (error) {
        console.error('Error in uploadToCloudinary middleware:', error);
        next(error);
    }
};