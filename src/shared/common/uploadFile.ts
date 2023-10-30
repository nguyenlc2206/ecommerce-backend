import multer from 'multer';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '@ecommerce-backend/src/public/images/');
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
