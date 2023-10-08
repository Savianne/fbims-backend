import express, { RequestHandler } from 'express';
import fs from "fs";
import path from "path";
import { customAlphabet, nanoid } from 'nanoid';
import { IUserRequest } from '../types/IUserRequest';
import multer from 'multer';

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './tmp-upload'); // Specify the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, `${nanoid(15)}`); // Set the filename for uploaded files
    },
  });
  
// Create a multer upload instance
export const upload = multer({ storage });

const AvatarUploadRouter = express.Router();

AvatarUploadRouter.use((req, res, next) => {
    const request = req as IUserRequest
    if(!request.user) {
        return res.status(401).json({
            error: "Unautorized Request!"
        })
    }
    else next()
});

AvatarUploadRouter.post('/add-to-temp', (req, res) => {
    upload.single('picture')(req, res, (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        res.status(500).json({success: false, error: "Error uploading file!"});
      } else {
        if (!req.file) {
          console.error('Error uploading file:', err);
          res.status(400).json({success: false, error: "No file uploaded!" });
        } else {
            res.json({success: true, data: { filename: req.file?.filename } });
        }
      }
    });
  });

  AvatarUploadRouter.delete('/delete-temp-upload/:imageName', (req, res) => {
    const imagesFolder = path.join(__dirname, '../../tmp-upload');
    const imageName = req.params.imageName;
    const imagePath = path.join(imagesFolder, imageName);

    try {
      // Check if the image file exists
      if (fs.existsSync(imagePath)) {
        // Delete the image file
        fs.unlinkSync(imagePath);
        res.json({ success: true });
      } else {
        res.json({ success: false, error: "Image not found" });
      }
    } catch (error) {
      res.json({ success: false, error: "Failed to delete image" });
    }
  });

export default AvatarUploadRouter;