const fs = require('fs'); // Required for deleting files
const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, body } = req.body;
    const userId = req.user._id;

    if (!title.trim() || !body.trim()) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const attachments = req.files?.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`) || [];

    const post = new Post({
      title,
      body,
      attachments,
      user: user._id,
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name profilePic');
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get posts created by the logged-in user
const getMyPosts = async (req, res) => {
  try {
    const myPosts = await Post.find({ user: req.user._id }).populate('user').select({ replies: 0 });
    res.json(myPosts);
  } catch (err) {
    console.error('Error fetching user posts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name email profilePic')
      .populate('replies.user', 'name profilePic');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error('Error fetching post by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Star a post
const starPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    if (!post.stars.includes(userId)) {
      post.stars.push(userId);
      await post.save();
    }

    res.json(post);
  } catch (err) {
    console.error('Error starring post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Unstar a post
const unstarPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    post.stars = post.stars.filter(id => id.toString() !== userId.toString());
    await post.save();

    res.json(post);
  } catch (err) {
    console.error('Error unstarring post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Upvote a post
const upvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    if (!post.upvotes.includes(userId)) {
      post.upvotes.push(userId);
      await post.save();
    }

    res.json(post);
  } catch (err) {
    console.error('Error upvoting post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Un-upvote a post
const unupvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
    await post.save();

    res.json(post);
  } catch (err) {
    console.error('Error un-upvoting post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Reply to a post
const replyToPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { comment, parentReplyId = null } = req.body;

    if (!comment?.trim()) {
      return res.status(400).json({ message: 'Comment is required' });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (parentReplyId) {
      const parentReplyExists = post.replies.some(reply => reply._id.toString() === parentReplyId.toString());
      if (!parentReplyExists) {
        return res.status(400).json({ message: 'Parent reply not found' });
      }
    }

    post.replies.push({ user: userId, comment, parentReplyId });
    await post.save();

    res.status(200).json({ message: 'Reply added successfully', post });
  } catch (err) {
    console.error('Error replying to post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to edit this post' });
    }

    const { title, body } = req.body;
    if (!title?.trim() || !body?.trim()) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    post.title = title;
    post.body = body;
    await post.save();

    res.json({ message: 'Post updated successfully', post });
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });

    if (post.attachments?.length) {
      post.attachments.forEach(fileUrl => {
        const filePath = `./uploads/${fileUrl.split('/').pop()}`;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getMyPosts,
  starPost,
  unstarPost,
  upvotePost,
  unupvotePost,
  replyToPost,
  updatePost,
  deletePost,
  getPostById,
};
