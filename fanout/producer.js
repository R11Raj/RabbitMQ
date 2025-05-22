import { connect } from "amqplib";

/**
 * Pushes score updates to the queue.
 *
 * @param {import("amqplib").Channel} channel
 * @param {Object} message
 */
async function sendUpdates(channel, message) {
  const exchangeName = "scoreboard-fanout";
  const exchangeType = "fanout";

  await channel.assertExchange(exchangeName, exchangeType, { durable: false });

  channel.publish(exchangeName, "", Buffer.from(JSON.stringify(message)));
  console.log("Score updates were sent", message);
}

const connection = await connect("amqp://localhost");
const channel = await connection.createChannel();
const message = {
  score: 254,
  wickets: 4,
  overs: 65,
};

const scoresInterval = setInterval(() => {
  message.score += 5;
  message.overs += 1;
  sendUpdates(channel, message);
}, 1000);

setTimeout(() => {
  clearInterval(scoresInterval);
  connection.close();
}, 10000);
