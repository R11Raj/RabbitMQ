import { connect } from "amqplib";

/**
 * Pushes score updates to the queue.
 *
 * @param {import("amqplib").Channel} channel
 * @param {Object} message
 */
async function sendUpdates(channel, message) {
  const exchangeName = "scoreboard-streams";
  const exchangeType = "direct";
  const streamName = "notifications-stream";
  const routingKey = "notifications";

  await channel.assertExchange(exchangeName, exchangeType);
  await channel.assertQueue(streamName, {
    arguments: {
      "x-queue-type": "stream",
      "x-max-age": "30s",
      "x-stream-max-segment-size-bytes": 10,
    },
  });
  await channel.bindQueue(streamName, exchangeName, routingKey);

  channel.publish(
    exchangeName,
    routingKey,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
  console.log("Notifications were sent", message);
}

const connection = await connect("amqp://localhost");
const channel = await connection.createChannel();
const message = {
  title: "Team India is nearing X runs.",
};

let runs = 50;
const scoresInterval = setInterval(() => {
  message.title = message.title.replace("X", 50);
  runs += 50;
  sendUpdates(channel, message);
}, 2500);

setTimeout(() => {
  clearInterval(scoresInterval);
  connection.close();
}, 10000);
