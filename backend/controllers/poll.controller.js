const Poll = require('../models/poll.model');

exports.createPoll = async (req, res) => {
    const { title, options, startTime, endTime } = req.body;
    if (!title || !options || options.length < 2 || !startTime || !endTime) {
        return res.status(400).json({ message: 'All fields are required, and at least 2 options must be provided' });
    }

    try {
        const poll = new Poll({
            title,
            options: options.map(opt => ({ option: opt })),
            startTime,
            endTime,
            createdBy: req.user.id,
        });

        await poll.save();
        res.status(201).json({ message: 'Poll created successfully', poll });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not create poll' });
    }
};

exports.voteOnPoll = async (req, res) => {
    const { pollId, optionIndex } = req.body;
    if (!pollId || optionIndex === undefined) {
        return res.status(400).json({ message: 'Poll ID and option index are required' });
    }

    try {
        const poll = await Poll.findById(pollId);
        if (!poll) return res.status(404).json({ message: 'Poll not found' });

        if (new Date() < poll.startTime || new Date() > poll.endTime) {
            return res.status(400).json({ message: 'Poll is not active' });
        }

        poll.options[optionIndex].count += 1;
        await poll.save();
        res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not vote' });
    }
};

exports.getPollResults = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.pollId);
        if (!poll) return res.status(404).json({ message: 'Poll not found' });

        res.status(200).json({ poll });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not fetch poll results' });
    }
};

