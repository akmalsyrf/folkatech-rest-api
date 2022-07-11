const Redis = require("redis")
const client = Redis.createClient({
    port: 6379, host: "127.0.0.1"
})

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    await client.connect()
})()

/**
 * get redis cache
 * @param {string} redis_key
 */

const get = async (redis_key) => {
    const value = await client.get(redis_key)
    return value
}

/**
 * set redis cache
 * @param {string} redis_key
 * @param {string} redis_value
 */

const set = (redis_key, redis_value) => {
    console.log("Success Redis Set", redis_key, redis_value);
    client.set(redis_key, redis_value)
}

module.exports = { get, set }