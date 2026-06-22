const fs = require('fs');
const path = require('path');

const fileLimitter = async (req,res,next) =>{
    const file = req.file;
    if(!file){
        return res.status(400).json({message: 'No file uploaded'});
    }
    const fileSize = file.size;
    const maxSize = 5 * 1024 * 1024; // 5MB
    if(fileSize > maxSize){
        fs.unlinkSync(path.join(__dirname, '..', 'uploads', file.filename));
        return res.status(400).json({message: 'File size exceeds the limit of 5MB'});
    }
    next();
}

module.exports = fileLimitter;