const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Invite = require('../models/Invite');
const authenticateToken = require('../middleware/authMiddleware');

// Create an invitation link
router.post('/', authenticateToken, async (req, res) => {
  try {
    const code = crypto.randomBytes(16).toString('hex');
    const invite = await Invite.create({ code, inviter: req.user._id });
    res.json({ code });
  } catch (err) {
    console.error('Create invite error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Validate an invitation code (optional endpoint)
router.get('/:code', async (req, res) => {
  try {
    const invite = await Invite.findOne({ code: req.params.code, used: false });
    if (!invite) return res.status(404).json({ valid: false });
    res.json({ valid: true });
  } catch (err) {
    console.error('Validate invite error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
