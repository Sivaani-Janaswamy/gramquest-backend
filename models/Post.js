// models/Post.js
const mongoose = require('mongoose');   

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  attachments: [String], // URLs or filenames
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  stars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users who starred
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users who upvoted

  replies: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
      },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: String,
      createdAt: { type: Date, default: Date.now },
      
      // New fields for nesting:
      parentReplyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply',  // optional, for clarity; can just be ObjectId
        default: null, // null means this reply is a direct reply to the post
      }
    }
  ]
});


module.exports = mongoose.model('Post', postSchema);
