const cloudinary = require("cloudinary");
const fs = require("fs-extra");

async function uploadToCloudinary(path, folderName) {
  const result = await cloudinary.v2.uploader.upload(path, {
    folder: folderName,
  });
  let picture = {
    image_url: result.url,
    public_id: result.public_id,
  };
  await fs.unlink(path);
  return picture;
}

module.exports = uploadToCloudinary;
