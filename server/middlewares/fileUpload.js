import { error } from 'console';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: path.join(__dirname + '/../avatars'),
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const Upload = multer({
  storage: storage,
  dest: path.join(__dirname + '/../avatars'),
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      return cb(null, true);
    }
   
    return cb(new Error({message:'not allowed file extention'}));
  },
}).single('avatar');

export default  Upload;
