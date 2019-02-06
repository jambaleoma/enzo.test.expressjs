module.exports = {
    webServer: {
        port: process.env.NODE_ENV === 'production' ? 3000 : 3000
    },
    couchbase: {
        username: process.env.COUCH_USERNAME || 'CCM',
        password: process.env.COUCH_PASSWORD || 'Administrator',
        bucketName: process.env.COUCH_BUCKETNAME || 'CCM',
        host: process.env.COUCH_HOST || 'localhost',
        port: process.env.COUCH_PORT || '8091'
    }
}