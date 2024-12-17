
import multer, { Multer } from 'multer';

const storage = multer.memoryStorage();
export const upload: Multer = multer({ storage: storage });
