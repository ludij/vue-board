const knox = require('knox');
const fs = require('fs');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env;
} else {
    secrets = require('./secrets');
}
const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: 'vue-board-images'
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        console.log('no file provided');
        return res.json([{errorMsg: 'No file'}]);
    }
    const s3Request = client.put(req.file.filename, {
        'Content-Type': req.file.mimetype,
        'Content-Length': req.file.size,
        'x-amz-acl': 'public-read',
        'x-amz-tagging': 'keep=false'
    });
    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);

    s3Request.on('response', s3Response => {
        if (s3Response.statusCode == 200) {
            fs.unlink(req.file.path, () => {});
            next();
        } else {
            res.sendStatus(500);
        }
    });
};
