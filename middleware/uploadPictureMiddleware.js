const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"))
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadPictureMiddleware = multer({
    storage:storage,
    limits:{
        fileSize: 1 * 10000000
    },
    fileFilter: function (req, file, cb){
        let ext = path.extname(file.originalname);
        if(ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".gif"){
            return cb(new Error("Only images are allowed."));
        }
        cb(null,true);
    }
});

module.exports = uploadPictureMiddleware;
