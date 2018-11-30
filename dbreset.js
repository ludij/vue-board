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

exports.resetdb = () => {
    return db.query(
        `DROP TABLE IF EXISTS images, comments;
        CREATE TABLE images(
            id SERIAL PRIMARY KEY,
            url VARCHAR(300) NOT NULL,
            username VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE comments(
            id SERIAL PRIMARY KEY,
            comment VARCHAR(500) NOT NULL,
            username VARCHAR(255) NOT NULL,
            img_id INT NOT NULL REFERENCES images(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}19A73n5-8_jEeGjvYybdlFX6pmITZnjr.jpeg',
            'John',
            'Wood & Flowers',
            'Just some wood and flowers'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}mrORabBNhkGigSzfxrlLFVD36RUS3Wj7.jpeg',
            'Peter',
            'Mysterious',
            'Antlers with a red scarf'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}tpf123Z58WkehtmJ_MtMUOeHQHjw6at4.jpeg',
            'Inge',
            'Dark',
            'Black and white forest'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}NBAlb8h-yY8Rz8db8iYKFDp-ImkBKOB1.jpeg',
            'Judy',
            'Mountains',
            'Blue sky with mountains'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}0afMRlDyeow-fP-hIEiOjc3qw7UFZRsz.jpeg',
            'Grace',
            'Shoes',
            'A pair of shoes'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}iSZ3ue50offa2gH44oPhvRp6UP_yABQk.jpeg',
            'Sylvia',
            'Book',
            'An open book to read'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}GsBIqdWgHXH7ChkeNEBieC7KhMw9dqJe.jpeg',
            'Gary',
            'Water',
            'Surface of a lake'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}_xt2tKQpjxwXzZc_Tsj97iXS-U584pF7.jpeg',
            'Theo',
            'Bridge at Night',
            'Some city view'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}PO4oJl4BlZup1PYGF__F5rkMET3P6TeX.jpeg',
            'Hank',
            'Mountain Pass',
            'Black and white mountain view'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}CFfulvE5yr4_d6xjBPPFv8tSzWuYb1kJ.jpeg',
            'Claire',
            'Lake',
            'Grass and lake in the sun'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}O_cLe7e1cpUbMT0RPa61ioyt6ehvTcLF.jpeg',
            'Glenn',
            'People',
            'Enjoying the view from a bench'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}tCtAdgzYZj2PoMxKYbJ3-Iy2UbTNFFMD.jpeg',
            'Sophie',
            'Beach',
            'Tide on the beach'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}7wYXMAAU47S47jFsecRB7AxMKnKwmxlQ.jpeg',
            'Paul',
            'Street Life',
            'Man walking on the street'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}y9rdTWdVPJAsDxuCWPxIFrTAqNh_ufaB.jpeg',
            'Wayne',
            'Sky & Rock',
            'Beautiful view'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}E0Us6uU_CxdLZznFNNWc2CAqzCM6i1yK.jpeg',
            'Mario',
            'Old Town',
            'Bird view on town'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}g2sw5oMMlnZ0ZkEBWbIHKTbaoVtqcWpb.jpeg',
            'Tim',
            'Road',
            'Low view on the road'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}zQRKNedsoZN7wqlf_VXQF6gdOpWpDnNM.jpeg',
            'Vera',
            'Sandy Beach',
            'A lot of sand'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}KOe6A4h7pz4iRcGf2u8LSEW8CPl-wH2c.jpeg',
            'Luke',
            'Night Sky',
            'Where are the stars?'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}h0nd_o5ydB6bOywGzqxrXuhAYIXCCqRw.jpeg',
            'Marc',
            'Wind Mills',
            'They bring us energy'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}DEvS6vhUhs9AE90Bp3dpZZg5WW1WxLom.jpeg',
            'Selma',
            'Tunnel View',
            'Driving in a tunnel'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}IUhJW9m0H1LsyVEd2H70oQzd3yYGy52v.jpeg',
            'Rob',
            'Wild Water',
            'Sea side water'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}WLirnvxt4r3Eq1XiT9Ou59shEm8a3MgR.jpeg',
            'Sarah',
            'Rain Drops',
            'Drops on the window'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}GumjtZmB88lk-qYJN0KzphYtzrP4w9Eh.jpeg',
            'Alicia',
            'Wanderer',
            'Hiking in the mountains'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}o5a6ckwGD7ZEQLRk2ZUInDmoBHrL6XfT.jpeg',
            'Ben',
            'Hot Air Balloon',
            'Flying in the sky'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}unQ4LlF2KzzjkntwFCDtv1zf0v1XU24H.jpeg',
            'Clark',
            'Lighthouse',
            'Coastline with lighthouse'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}-wfNv1H82Rf_jEhrMxH0q2WhNb-izKRB.jpeg',
            'Nathan',
            'Corn Field',
            'Corn field with blue sky'
        );
        INSERT INTO images (url, username, title, description) VALUES (
            '${secrets.amazonUrl}AVAg99-oEj3vjEE_xUnflJuCMqbK-zmq.jpeg',
            'Gina',
            'Flowers',
            'Purple flowers'
        );
        INSERT INTO comments (comment, username, img_id) VALUES (
            'Wow',
            'Jeremy',
            '12'
        );
        INSERT INTO comments (comment, username, img_id) VALUES (
            'Fantastic picture!',
            'Jennifer',
            '22'
        );
        INSERT INTO comments (comment, username, img_id) VALUES (
            'Nice view :)',
            'Holly',
            '25'
        );
        INSERT INTO comments (comment, username, img_id) VALUES (
            'Fantastic colors',
            'Ida',
            '26'
        );
        INSERT INTO comments (comment, username, img_id) VALUES (
            'Reminds me of my hometown',
            'Timothy',
            '26'
        );
        INSERT INTO comments (comment, username, img_id) VALUES (
            'Great!',
            'Paolo',
            '26'
        );
        INSERT INTO comments (comment, username, img_id) VALUES (
            'Amazing pic!',
            'Gordon',
            '27'
        );`
    );
};
