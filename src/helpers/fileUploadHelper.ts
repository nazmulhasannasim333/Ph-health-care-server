import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import * as fs from 'fs';
import { ICloudinaryResponse, IUploadFile } from '../interfaces/file';

cloudinary.config({
    cloud_name: 'dbgrq28js',
    api_key: '173484379744282',
    api_secret: 'eHKsVTxIOLl5oaO_BHxBQWAK3GA'
});

// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//     { public_id: "olympic_flag" },
//     function (error, result) { console.log(result); });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage })

const uploadToCloudinary = async (file: IUploadFile): Promise<ICloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path,
            (error: Error, result: ICloudinaryResponse) => {
                fs.unlinkSync(file.path);
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                }
            })
    })
};

export const FileUploadHelper = {
    uploadToCloudinary,
    upload
}