const express = require("express");
const cors = require("cors");

// Route modules
const outpaintRoutes = require("./outpaint");
const srRoutes = require("./sr");
const removeBackgroundRoutes = require("./rbr");

const router = express.Router();

router.use(cors());
router.use(express.json());


router.use("/outpaint", outpaintRoutes);
router.use("/sr", srRoutes);
router.use("/rbr", removeBackgroundRoutes);


module.exports = router;
