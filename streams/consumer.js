import { connect } from "amqplib";

/**
 * Receives notifications from the queue.
 *
 * @param {import("amqplib").Channel} channel
 */
async function receiveUpdates(channel) {
  const streamName = "notifications-stream";

  await channel.assertQueue(streamName, {
    arguments: {
      "x-queue-type": "stream",
      "x-max-age": "30s",
      "x-stream-max-segment-size-bytes": 10,
    },
  });
  await channel.prefetch(100);

  const consumeOptions = {
    noAck: false,
    arguments: {
      "x-stream-offset": "first",
    },
  };
  channel.consume(
    streamName,
    (message) => {
      console.log("Notifications ", JSON.parse(message.content));
      channel.ack(message);
    },
    consumeOptions
  );
}

const connection = await connect("amqp://localhost");
const channel = await connection.createChannel();

receiveUpdates(channel);

setTimeout(() => {
  connection.close();
}, 15000);
