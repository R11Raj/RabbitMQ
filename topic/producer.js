import { connect } from "amqplib";

/**
 * Pushes score updates to the queue.
 *
 * @param {import("amqplib").Channel} channel
 * @param {String} routingKey 
 * @param {Object} message
 */
async function sendUpdates(channel, routingKey, message) {
  const exchangeName = "scoreboard-topic";
  const exchangeType = "topic";

  await channel.assertExchange(exchangeName, exchangeType, { durable: false });

  channel.publish(
    exchangeName,
    routingKey,
    Buffer.from(JSON.stringify(message))
  );
  console.log("Score updates were sent", routingKey, message);
}

const connection = await connect("amqp://localhost");
const channel = await connection.createChannel();

sendUpdates(channel, "score.boundary", { batter: "Raj", hitArea: "Long On" });
sendUpdates(channel, "score.six", {
  batter: "Raj",
  hitArea: "Long On",
  distance: 90,
});
sendUpdates(channel, "score.wicket", {
  batter: "Raj",
  bowler: "Bumrah",
  type: "Caught Behind",
});

setTimeout(() => {
  connection.close();
}, 10000);
