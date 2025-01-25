import mongoose from "mongoose"

// videofile.js
const videoSchema = new mongoose.Schema({
  videotitle: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  filepath: {
    type: String,
    required: true
  },
  filetype: {
    type: String,
    required: true
  },
  filesize: {
    type: Number,
    required: true
  },
  videochanel: {
    type: String,
    required: true
  },
  uploader: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

export default mongoose.model("VideoFiles", videoSchema)