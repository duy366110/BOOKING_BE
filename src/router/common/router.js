const router = require('express').Router();
const RouterAuth = require("./router-auth");
const RouterSearch = require("./router.search");

router.use("/auth", RouterAuth);
router.use("/search", RouterSearch);

module.exports = router;