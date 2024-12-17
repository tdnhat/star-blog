import sharp from 'sharp';

export const resizeImage = async (buffer: Buffer, width: number, height: number): Promise<Buffer> => {
    return sharp(buffer)
        .resize({ width, height })
        .toBuffer();
};
