import { connect } from "amqplib";

/**
 * Pushes score updates to the queue.
 *
 * @param {import("amqplib").Channel} channel
 * @param {Object} headers
 * @param {Object} message
 */
async function sendUpdates(channel, headers, message) {
  const exchangeName = "scoreboard-headers";
  const exchangeType = "headers";

  await channel.assertExchange(exchangeName, exchangeType, { durable: false });

  channel.publish(exchangeName, "", Buffer.from(JSON.stringify(message)), {
    headers,
  });
  console.log("Score updates were sent", message);
}

const connection = await connect("amqp://localhost");
const channel = await connection.createChannel();

sendUpdates(
  channel,
  { "x-match": "all", "score-type": "runs", "runs-type": "boundary" },
  { batter: "Raj", hitArea: "Long On" }
);
sendUpdates(
  channel,
  { "x-match": "all", "score-type": "runs", "runs-type": "six" },
  { batter: "Raj", hitArea: "Long On", distance: 90 }
);
sendUpdates(
  channel,
  { "x-match": "any", "score-type": "extra", "extra-type-player": "wide" },
  { batter: "Raj", bowler: "Bumrah", runs: 5 }
);
sendUpdates(
  channel,
  { "x-match": "any", "score-type": "exra", "extra-type-team": "leg byes" },
  { batter: "Raj", bowler: "Bumrah", runs: 1 }
);

setTimeout(() => {
  connection.close();
}, 10000);
