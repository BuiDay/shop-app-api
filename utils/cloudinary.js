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
                    asset_id:result.asset_id,
                    public_id:result.public_id
                },
                {
                    resource_type:"auto",
                }
            )
        })
    })
}

const cloudinaryDelete = async(fileToDelete) =>{
    return new Promise((resolve)=>{
        cloudinary.uploader.destroy(fileToDelete,(result)=>{
            resolve(
                {
                    url:result.secure_url,
                    asset_id:result.asset_id,
                    public_id:result.public_id
                },
                {
                    resource_type:"auto",
                }
            )
        })
    })
}


module.exports = {cloudinaryUploading,cloudinaryDelete};