const spicedPg = require('spiced-pg');
let secrets;
let db;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env;
    db = spicedPg(secrets.DATABASE_URL);
} else {
    secrets = require('./secrets');
    db = spicedPg(`postgres:${secrets.localUsername}:${secrets.localPassword}@localhost:5432/imageboard`);
}

exports.getImgs = id => {
    var query = "";
    var variables = "";
    if (id != 'all') {
        query = "WHERE id < $1 ";
        variables = [id];
    }
    return db.query(
        `SELECT *, (SELECT id FROM images ORDER BY id ASC LIMIT 1) AS last_img_id FROM images ${query}ORDER BY id DESC LIMIT 14`,
        variables
    );
};

exports.getImg = id => {
    return db.query(
        `SELECT *,
            (SELECT id FROM images WHERE id = $1 LIMIT 1) AS prev_img_id,
            (SELECT id FROM images WHERE id = $2 LIMIT 1) AS next_img_id,
            (SELECT id FROM images ORDER BY id ASC LIMIT 1) AS last_img_id,
            (SELECT id FROM images ORDER BY id DESC LIMIT 1) AS first_img_id
        FROM images WHERE id = $3`,
        [parseInt(id)+1, parseInt(id)-1, id]
    );
};

exports.getComments = id => {
    return db.query(
        `SELECT * FROM comments WHERE img_id = $1 ORDER BY created_at DESC;`,
        [id]
    );
};

exports.insertImg = req => {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *`,
        [secrets.amazonUrl + req.file.filename, req.body.username, req.body.title, req.body.desc]
    );
};

exports.insertComment = req => {
    return db.query(
        `INSERT INTO comments (comment, username, img_id) VALUES ($1, $2, $3) RETURNING *`,
        [req.body.comment, req.body.username, req.body.img_id]
    );
};
