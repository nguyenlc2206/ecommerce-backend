// import libs
import multer from 'multer';

// setting upload image/file with multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export default multer({
    storage: storage,
    limits: {
        fileSize: 4 * 1024 * 1024
    }
});
