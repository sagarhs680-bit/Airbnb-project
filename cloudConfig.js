const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Support either:
// 1) CLOUDINARY_URL (cloudinary://<key>:<secret>@<cloud_name>)
// 2) separate env vars: CLOUD_NAME + CLOUD_API_KEY + CLOUD_API_SECRET
//    (also tolerate the older misspelling CLOUD_API_SECRETE used in this repo)
const apiSecret = process.env.CLOUD_API_SECRET || process.env.CLOUD_API_SECRETE;
const cloudinaryUrl = process.env.CLOUDINARY_URL;

if (cloudinaryUrl) {
  cloudinary.config({ cloudinary_url: cloudinaryUrl });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: apiSecret,
  });
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormat:["png","jpg",'jpeg'],
  },
});

module.exports={
    cloudinary,
    storage,
};