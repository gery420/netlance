const express = require("express");
const router = express.Router();
const Auth = require("../middleware/Auth");
const { CreateGig, GetGigForSeller, DeleteGig, GetAllGigs, GetGigById, UpdateGig, GetGigsByQuery } = require("../controllers/gig");
const upload = require("../middleware/upload");

router.get("/all", GetAllGigs);
router.get("/search", GetGigsByQuery);
router.post("/create", Auth, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'images', maxCount: 10 }]), CreateGig);
router.get("/", Auth, GetGigForSeller);
router.get("/:id", GetGigById);
router.delete("/:id", Auth, DeleteGig);
router.put("/update/:id", Auth, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'images', maxCount: 10 }]), UpdateGig);

module.exports = router;
