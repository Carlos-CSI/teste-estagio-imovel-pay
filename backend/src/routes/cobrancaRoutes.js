const express = require("express");
const controller = require("../controllers/cobrancaController");

const router = express.Router();

router.get("/", controller.list);
router.post("/", controller.create);
router.patch("/:id/status", controller.markAsPaid);

module.exports = router;
