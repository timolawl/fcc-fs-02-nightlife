module.exports = {
    dbURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/timolawlvoting1',
    sessionSecret: process.env.SESSION_SECRET
};
