const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

// console.log("Cloud Name:", process.env.CLOUD_NAME); 
console.log("Key exists:", !!process.env.CLOUD_API_KEY);
console.log("Cloud Name:", !!process.env.CLOUD_NAME);
console.log("API Key:", !!process.env.CLOUD_API_KEY);
console.log("API Secret:", !!process.env.CLOUD_API_SECRET);

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params:{ 
//         folder:"Wanderlust_DEV",
//         allowed_formats:["jpeg","jpg","png"],
//         resource_type: "image", 
//     },
// });

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "Wanderlust_DEV",
      resource_type: "image",
      allowedFormats:["jpeg","jpg","png"]
    };
  },
});

module.exports = {
    cloudinary,
    storage
}