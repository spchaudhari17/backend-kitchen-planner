const RoomDetails = require("../models/user/RoomDetails");

// Save or Update Room Details


exports.saveRoomDetails = async (req, res) => {
  const payload = req.body;
  console.log("Received payload:", payload.user_id);

  if (!payload.width || !payload.depth || !payload.description || !payload.subdescription) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Convert height and width to Number
    // const formattedDroppedItems = payload.droppedItems.map(item => ({
    //   name: item.name,
    //   imageSrc: item.imageSrc,
    //   height: Number(item.height),  // Convert to Number
    //   width: Number(item.width)    // Convert to Number
    // }));

    // Save room details to the database
    const roomDetails = new RoomDetails({
      width: payload.width,
      depth: payload.depth,
      description: payload.description,
      subdescription: payload.subdescription,
      notes: payload.notes || {},
      droppedItems: payload.droppedItems,
      user_id: payload.user_id
    });

    const savedDetails = await roomDetails.save();

    res.status(201).json({
      message: "Room details saved successfully.",
      data: savedDetails,
    });
  } catch (error) {
    console.error("Error saving room details:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};




// Fetch All Room Details
exports.getRoomDetails = async (req, res) => {
  try {
    const roomDetails = await RoomDetails.find().sort({ createdAt: -1 });
    if (!roomDetails.length) {
      return res.status(404).json({ error: "No room details found." });
    }
    res.status(200).json(roomDetails);
  } catch (error) {
    console.error("Error fetching room details:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Fetch Room Details by ID
exports.getRoomDetailsById = async (req, res) => {
  const { id } = req.params;

  try {
    const roomDetails = await RoomDetails.findById(id);
    if (!roomDetails) {
      return res.status(404).json({ error: "Room details not found." });
    }
    res.status(200).json(roomDetails);
  } catch (error) {
    console.error("Error fetching room details by ID:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Delete Room Details by ID
exports.deleteRoomDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRoomDetails = await RoomDetails.findByIdAndDelete(id);
    if (!deletedRoomDetails) {
      return res.status(404).json({ error: "Room details not found." });
    }
    res.status(200).json({
      message: "Room details deleted successfully.",
      data: deletedRoomDetails,
    });
  } catch (error) {
    console.error("Error deleting room details:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};



exports.getUserSaveRoomDetails = async (req, res) => {

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required", data: [] });
    }

    // Find all room details associated with the user ID
    const rooms = await RoomDetails.find({ user_id: userId }).populate("user_id", "name email");

 

    if (rooms.length === 0) {
      return res.status(200).json({ message: "No rooms found", data: [] }); // ✅ Proper empty array return karo
    }

    res.status(200).json({
      data:rooms,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
