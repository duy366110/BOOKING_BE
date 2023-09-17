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

app.use(express.static(path.join(__dirname, "public")));
app.use(MiddlewareCors.cors);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(multer({storage:cloudinary.storage}).any('photos'));

app.use("/api/admin", RouterAdmin);
app.use("/api/client", RouterClient);
app.use("/api", RouterCommon);

module.exports = app;