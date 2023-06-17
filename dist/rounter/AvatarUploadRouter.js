"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
// Set up multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './tmp-upload'); // Specify the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Set the filename for uploaded files
    },
});
// Create a multer upload instance
exports.upload = (0, multer_1.default)({ storage });
const AvatarUploadRouter = express_1.default.Router();
AvatarUploadRouter.use((req, res, next) => {
    const request = req;
    if (!request.user) {
        return res.status(401).json({
            error: "Unautorized Request!"
        });
    }
    else
        next();
});
AvatarUploadRouter.post('/add-to-temp', (req, res) => {
    exports.upload.single('picture')(req, res, (err) => {
        var _a;
        if (err) {
            console.error('Error uploading file:', err);
            res.status(500).json({ success: false, error: "Error uploading file!" });
        }
        else {
            if (!req.file) {
                console.error('Error uploading file:', err);
                res.status(400).json({ success: false, error: "No file uploaded!" });
            }
            else {
                res.json({ success: true, data: { filename: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename } });
            }
        }
    });
});
AvatarUploadRouter.delete('/delete-temp-upload/:imageName', (req, res) => {
    const imagesFolder = path_1.default.join(__dirname, '../../tmp-upload');
    const imageName = req.params.imageName;
    const imagePath = path_1.default.join(imagesFolder, imageName);
    console.log(imagePath);
    try {
        // Check if the image file exists
        if (fs_1.default.existsSync(imagePath)) {
            // Delete the image file
            fs_1.default.unlinkSync(imagePath);
            res.json({ success: true });
        }
        else {
            res.json({ success: false, error: "Image not found" });
        }
    }
    catch (error) {
        res.json({ success: false, error: "Failed to delete image" });
    }
});
exports.default = AvatarUploadRouter;
