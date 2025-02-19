// routes/poll.routes.js
const express = require('express');
const { createPoll , voteOnPoll, getPollResults } = require('../controllers/poll.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

// POST /polls - Create a poll (admin only)
router.post('/create-poll', authenticate, authorize(['admin']), createPoll);
router.post('/vote', authenticate, authorize(['voter']), voteOnPoll);
router.get('/:pollId/results', authenticate, authorize(['admin', 'voter']), getPollResults);


module.exports = router;
