const GSpace = require('../models/Gspace');

// Create GSpace
exports.createGSpace = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const newGSpace = await GSpace.create({
      title,
      description,
      tags,
      createdBy: req.user.id,
      members: [req.user.id],
    });
    res.status(201).json(newGSpace);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all GSpaces
exports.getAllGSpaces = async (req, res) => {
  try {
    const gspaces = await GSpace.find()
      .populate('members', 'username')
      .populate('createdBy', 'username');
    res.json(gspaces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Join a GSpace by slug
exports.joinGSpace = async (req, res) => {
  try {
    const gspace = await GSpace.findOne({ slug: req.params.slug });
    if (!gspace) return res.status(404).json({ error: 'GSpace not found' });

    if (!gspace.members.includes(req.user.id)) {
      gspace.members.push(req.user.id);
      await gspace.save();
    }
    res.json({ message: 'Joined', gspace });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Leave a GSpace by slug
exports.leaveGSpace = async (req, res) => {
  try {
    const gspace = await GSpace.findOne({ slug: req.params.slug });
    if (!gspace) return res.status(404).json({ error: 'GSpace not found' });

    gspace.members = gspace.members.filter(id => id.toString() !== req.user.id);
    await gspace.save();
    res.json({ message: 'Left', gspace });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Like/Unlike GSpace by slug
exports.toggleLikeGSpace = async (req, res) => {
  try {
    const gspace = await GSpace.findOne({ slug: req.params.slug });
    if (!gspace) return res.status(404).json({ error: 'GSpace not found' });

    const index = gspace.likes.indexOf(req.user.id);
    if (index === -1) {
      gspace.likes.push(req.user.id);
      await gspace.save();
      return res.json({ message: 'Liked', likes: gspace.likes.length });
    } else {
      gspace.likes.splice(index, 1);
      await gspace.save();
      return res.json({ message: 'Unliked', likes: gspace.likes.length });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single GSpace by slug
exports.getGSpaceBySlug = async (req, res) => {
  try {
    const gspace = await GSpace.findOne({ slug: req.params.slug })
      .populate('members', 'username')
      .populate('createdBy', 'username');
    if (!gspace) return res.status(404).json({ error: 'GSpace not found' });
    res.json(gspace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
