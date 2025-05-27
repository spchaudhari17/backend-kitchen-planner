// const mongoose = require("mongoose");
// const {Schema}  = require("mongoose");

// const {ObjectId} = Schema.Types

// const DroppedItemSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   imageSrc: { type: String, required: true },
//   height: { type: Number, required: true },  
//   width: { type: Number, required: true },   
// });

// const RoomDetailsSchema = new mongoose.Schema(
//   {
//     user_id: {type : ObjectId, ref:"User", required: true },
//     width: {
//       type: Number,
//       required: true,
//     },
//     depth: {
//       type: Number,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     subdescription: {
//       type: String,
      
//     },
//     notes: { type: Object, default: {} },
//     droppedItems: { type: [DroppedItemSchema], required: true, default: [] } // Store dropped items
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("RoomDetails", RoomDetailsSchema);
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const { ObjectId } = Schema.Types;

const DroppedItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageSrc: { type: String, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
});

const RoomDetailsSchema = new mongoose.Schema(
  {
    user_id: { type: ObjectId, ref: "User", required: true },
    width: { type: Number, required: true },
    depth: { type: Number, required: true },
    description: { type: String, required: true },
    subdescription: { type: String },
    notes: { type: Object, default: {} },
    droppedItems: { type: [DroppedItemSchema], required: true, default: [] },
    snapshotImage: { type: String, default: "" } // ✅ Fix goes here
  },
  { timestamps: true } // ✅ schema options stay here
);

module.exports = mongoose.model("RoomDetails", RoomDetailsSchema);
