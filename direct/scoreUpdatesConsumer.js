import { connect } from "amqplib";

/**
 * Receives score updates from the queue.
 *
 * @param {import("amqplib").Channel} channel
 */
async function receiveScoreUpdates(channel) {
  const queueName = "score_updates_queue";

  await channel.assertQueue(queueName, { durable: false });

  channel.consume(queueName, (message) => {
    console.log("Received score updates ", JSON.parse(message.content));
    channel.ack(message);
  });
}

const connection = await connect("amqp://localhost");
const channel = await connection.createChannel();

receiveScoreUpdates(channel);

setTimeout(() => {
  connection.close();
}, 15000);
