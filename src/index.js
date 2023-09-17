const express = require("express");
const bodyParser =  require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const multer = require("multer");
const path = require('path');

require("./util/util.db");
const cloudinary = require("./util/util.cloudinary");
const MiddlewareCors = require("./middleware/middleware-cors");
const RouterAdmin = require("./router/admin/router");
const RouterClient = require("./router/client/router");
const RouterCommon = require("./router/common/router");


const app = express();
app.use(helmet());
app.use(compression());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public', 'images'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Math.random().toString()}${file.originalname}`);
    }
})

const fileFilter = (req, file, cb) => {
    if((file.mimetype == 'image/png') || (file.mimetype == 'image/jpeg') || (file.mimetype == 'image/jpg') || (file.mimetype == 'image/jpng')) {
        cb(null, true);

    } else {
        cb(null, false);
    }
}

app.use(express.static(path.join(__dirname, "public")));
app.use(MiddlewareCors.cors);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(multer({storage:cloudinary.storage}).any('photos'));

app.use("/api/admin", RouterAdmin);
app.use("/api/client", RouterClient);
app.use("/api", RouterCommon);

module.exports = app;