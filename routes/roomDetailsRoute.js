const express = require("express");
const router = express.Router();
const roomDetailsController = require("../controllers/roomDetailsController");

// Save Room Details
router.post("/save-room-details", roomDetailsController.saveRoomDetails);

// Get All Room Details
router.get("/get-room-details", roomDetailsController.getRoomDetails);

// Get Room Details by ID
router.get("/get-room-details/:id", roomDetailsController.getRoomDetailsById);

// Delete Room Details by ID
router.delete("/delete-room-details/:id", roomDetailsController.deleteRoomDetails);

router.post("/get-save-user-roomdetails", roomDetailsController.getUserSaveRoomDetails);

module.exports = router;
