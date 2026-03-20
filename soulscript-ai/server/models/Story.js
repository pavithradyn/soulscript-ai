const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    rawContent: String,
    aiSuggestion: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', StorySchema);