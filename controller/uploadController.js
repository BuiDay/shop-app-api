const {cloudinaryUploading,cloudinaryDelete} = require("../utils/cloudinary.js");
const fs = require("fs");
const asyncHandler = require('express-async-handler');

const uploadImage = asyncHandler(async(req, res)=>{
    try {
        const uploader = (path) => cloudinaryUploading(path,"images");
        const urls = [];
        const files = req.files;
        for( const file of files){
            const {path} = file;
            const newpath = await uploader(path);
            urls.push(newpath)
            fs.unlinkSync(path)
        }
        const images = urls.map(file=>{
            return file
        })
        console.log(files)
        res.json(images)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteImage= asyncHandler(async(req, res)=>{
    const {id} = req.params;
    try {
        const deleted = cloudinaryDelete(id,"images");
        res.json({
            message:"Deleted"
        })
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {uploadImage,deleteImage}