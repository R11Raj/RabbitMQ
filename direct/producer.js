import { connect } from "amqplib";

/**
 * Pushes score updates to the queue.
 * 
 * @param {import("amqplib").Channel} channel 
 * @param {Object} message 
 */
async function sendScoreUpdates(channel, message) {
    const exchangeName = "scoreboard";
    const exchangeType = "direct";
    const routingKey = "score_updates";
    const queueName = "score_updates_queue";

    await channel.assertExchange(exchangeName, exchangeType, { durable: false })
    await channel.assertQueue(queueName, { durable: false })
    await channel.bindQueue(queueName, exchangeName, routingKey)

    channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)))
    console.log("Score updates were sent", message)
}

/**
 * Pushes dismissal updates to the queue.
 * 
 * @param {import("amqplib").Channel} channel 
 * @param {Object} message 
 */
async function sendDismissalUpdates(channel, message) {
    const exchangeName = "scoreboard";
    const exchangeType = "direct";
    const routingKey = "dismissal_updates";
    const queueName = "dismissal_updates_queue";

    await channel.assertExchange(exchangeName, exchangeType, { durable: false })
    await channel.assertQueue(queueName, { durable: false })
    await channel.bindQueue(queueName, exchangeName, routingKey)

    channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)))
    console.log("Dismissal updates were sent", message)
}

const connection = await connect("amqp://localhost")
const channel = await connection.createChannel();
const message = {
    score: 254,
    wickets: 4,
    overs: 65,
}
let scoreCount = 0;
const scoresInterval = setInterval(() => {
    message.score += 5
    message.overs += 1
    sendScoreUpdates(channel, message)
    scoreCount += 1

    if (scoreCount > 5) {
        clearInterval(scoresInterval)
    }
}, 1000)

let dismassalCount = 0;
const dismassalInterval = setInterval(() => {
    message.wickets += 1
    sendDismissalUpdates(channel, {message: `${message.wickets} wickets has fallen.`})
    dismassalCount += 1

    if (dismassalCount > 3) {
        clearInterval(dismassalInterval)
    }
}, 1000)

setTimeout(() => {
    console.log(message)
    clearInterval(scoresInterval)
    connection.close()
}, 15000)