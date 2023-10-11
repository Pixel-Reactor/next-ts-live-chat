import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads', // Make sure this path is correct
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default (req: any, res: any) => {
  if (req.method === 'POST') {
    upload.single('avatar')(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        // Handle multer error
        return res.status(400).json({ error: 'Multer Error' });
      } else if (err) {
        // Handle other errors
        return res.status(500).json({ error: 'Internal server error' });
      }

     
      res.status(200).json({ data: 'Success' });
    });
  } else {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
};
