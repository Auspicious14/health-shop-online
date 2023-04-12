const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const mapFiles = async (files: any) => {
  let fls: Array<{}> = [];

  if (files && files?.length > 0) {
    for await (let file of files) {
      fls.push({
        name: file?.name,
        type: file?.type,
        uri: file?.uri.includes("res.cloudinary.com")
          ? file?.uri
          : await upLoadFiles(file?.uri, file?.name),
      });
    }
  }

  return fls;
};

const upLoadFiles = async (file: any, fileName?: any) => {
  const uri = await cloudinary.uploader.upload(file, { public_id: fileName });

  return uri?.secure_url;
};
