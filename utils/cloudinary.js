const cloudinary = require('cloudinary');

// Configuration 
cloudinary.config({
  cloud_name: "dlqieazbj",
  api_key: "272993419191242",
  api_secret: "GmSHL1ELYDoKv6UfgqrtnRBcFxo"
});

const cloudinaryUploading = async(fileToUpload) =>{
    return new Promise((resolve)=>{
        cloudinary.uploader.upload(fileToUpload,(result)=>{
            resolve(
                {
                    url:result.secure_url,
                },
                {
                    resource_type:"auto",
                }
            )
        })
    })
}


module.exports = cloudinaryUploading;