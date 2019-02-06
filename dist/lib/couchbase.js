const couchbase = require('couchbase')

function getBucket({
    username,
    password,
    bucketName,
    host,
    port
}) {
    return new Promise((resolve, reject) => {
        const cluster = new couchbase.Cluster(`couchbase://${host}/${port}`);
        cluster.authenticate(username, password);
        const bucket = cluster.openBucket(bucketName, function (err) {
            if (err) {
                reject(err) 
            } else {
                resolve(bucket)
            }
        });
    })

}

module.exports = {getBucket}