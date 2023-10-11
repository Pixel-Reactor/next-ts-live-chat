import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';


export const ImgLink = async (req, res) => {

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const id = req.params.id;
 
  try {
    const img = fs.readFileSync(path.join(__dirname + '/../avatars/' + id))
    if (!img) {
      res.end(fs.readFileSync(path.join(__dirname + '/../avatars/user.png')))
    }
    else {
      res.end(img)
    }
  } catch (error) {
    res.end(fs.readFileSync(path.join(__dirname + '/../avatars/user.png')))

  }

}





