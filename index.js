const express = require('express');
const app = express();
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
const bodyParser = require('body-parser');
const moment = require('moment');
const {upload} = require('./s3.js');
const db = require('./db.js');
const dbreset = require('./dbreset.js');

app.use(bodyParser.json());
app.use(express.static('./public'));

// get next 14 images
app.get('/imgs/:imgid', function(req, res) {
    db.getImgs(req.params.imgid)
        .then(imgsData => res.json([imgsData.rows]))
        .catch(err => console.log('error in get /imgs:', err));
});

// get specific image for modal
app.get('/img/:imgid', function(req, res) {
    db.getImg(req.params.imgid)
        .then(imgData => res.json([imgData.rows]))
        .catch(() => res.json([{}]));
});

// get comments for specific image in modal
app.get('/comments/:imgid', function(req, res) {
    db.getComments(req.params.imgid)
        .then(commentsData => {
            res.json([convertDate(commentsData)]);
        })
        .catch(() => res.json([{}]));
});

// post and upload selected picture
app.post('/upload', multerWithErrorReturn, upload, function(req, res) {
    db.insertImg(req)
        .then(data => res.json(data.rows))
        .catch(err => console.log('error in post /upload:', err));
});

// post comment on specific picture
app.post('/comment', function(req, res) {
    db.insertComment(req)
        .then(commentData => {
            res.json([convertDate(commentData)]);
        })
        .catch(err => console.log('error in post /comment:', err));
});

// check file before uploading
function multerWithErrorReturn(req, res, next) {
    uploader.single("file")(req, res, function(err) {
        if (err)
            return res.json([{errorMsg: 'Too big'}]);
        else next();
    });
}

// convert date format
function convertDate(data) {
    const convertedCommentData = data.rows.map(data => {
        data.created_at = moment(data.created_at).format("D MMMM YYYY, HH:mm");
        return data;
    });
    return convertedCommentData;
}

// reset database every 2 weeks
setInterval(dbreset.resetdb, 1000*60*60*24*14);

app.listen(process.env.PORT || 8080, () => console.log('listening on port 8080'));
