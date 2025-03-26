const ComponentColor = require('../models/user/ComponentColor');
 
// Fetch all component colors
exports.saveColor = async (req, res) => {
  const payload = req.body;

  
  if (!Object.keys(payload).length) {
    return res.status(400).json({ error: "At least one component color is required." });
  }

  try {
    const updateFields = {};

    
    for (const [component, properties] of Object.entries(payload)) {
      if (typeof properties === "object" && properties !== null) {
        for (const [key, value] of Object.entries(properties)) {
          updateFields[`${component}.${key}`] = value;
        }
      }
    }

    // Perform the update with dot notation
    const result = await ComponentColor.updateOne(
      { website_color_combination: true }, 
      {
        $set: {
          ...updateFields,  
          website_color_combination: true,  
        },
      },
      { upsert: true }  
    );

    if (result.upsertedCount > 0) {
      return res.status(201).json({
        message: "New color configuration inserted",
        data: payload,
      });
    }

    return res.status(200).json({
      message: "Color configuration updated successfully",
      data: payload,
    });
  } catch (error) {
    console.error("Error updating colors:", error);
    return res.status(500).json({
      message: "Server error during color update",
      error: error.message,
    });
  }
};




exports.getColors = async (req, res) => {
  try {
    // console.log("c",ComponentColor);

    const colors = await ComponentColor.findOne({ website_color_combination: true });
    if (!colors) {
      return res.status(404).json({ error: 'Color configuration not found.' });
    }
    res.status(200).json(colors);
  } catch (error) {
    console.error('Error fetching colors:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
 