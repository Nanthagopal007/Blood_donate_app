const express = require("express");
const router = express.Router();
const { getAllContact, getContact, getCreateContact, getUpdateContact, getDeleteContact } = require("../controllers/contactController");

router.get("/", getAllContact);
router.get("/:id", getContact);
router.post("/", getCreateContact);
router.put("/:id", getUpdateContact);
router.delete("/:id", getDeleteContact);

module.exports = router;
