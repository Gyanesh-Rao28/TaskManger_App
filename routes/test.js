const express = require("express");
const router = express.Router();


router.get("/test", async (req, res) => {
    console.log("test hello")
    res.send("test hello")
});

module.exports = router;