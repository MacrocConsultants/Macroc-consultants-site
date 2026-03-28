const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContentSchema = new Schema(
  {
    _id: { type: String, required: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", ContentSchema);
