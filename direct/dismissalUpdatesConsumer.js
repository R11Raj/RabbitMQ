import { connect } from "amqplib";

/**
 * Receives dismassal updates from the queue.
 *
 * @param {import("amqplib").Channel} channel
 */
async function receiveDismissalUpdates(channel) {
  const queueName = "dismissal_updates_queue";

  await channel.assertQueue(queueName, { durable: false });

  channel.consume(queueName, (message) => {
    console.log("Received dismissal updates ", JSON.parse(message.content));
    channel.ack(message);
  });
}

const connection = await connect("amqp://localhost");
const channel = await connection.createChannel();

receiveDismissalUpdates(channel);

setTimeout(() => {
  connection.close();
}, 15000);
