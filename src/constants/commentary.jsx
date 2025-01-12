export let promptTemplate = `Generate json response with the following format,

{male: "commentary text", female:"commentary text"}

Below are the current status of the game,

<player1> has made <p1SuccessfulHits> hits and <p1HitMiss> misses.
<player1> has an health status of <p1t1Name> with <p1t1health>, <p1t2Name> with <p1t2health>, <p1t3Name> with <p1t3health>.

<player2> has made <p2SuccessfulHits> hits and <p2HitMiss> misses.
<player2> has an health status of <p2t1Name> with <p2t1health>, <p2t2Name> with <p2t2health>, <p2t3Name> with <p2t3health>.

Current move, <currentPlayerName> with <currentPlayerTeamMember> hits <oppositePlayerName> <opponentTeamMember> and caused <currentDamage> damage with <currentPlayerTimeLeft> seconds time left.

Current round status, current round is <currentRound>, <player1> has won <p1RoundWins>, <player2> has won <p2RoundWins>.

The commentary text should be natural, funny and easy to understand. Male voice wil be played before female.
This commentary text is for an action game. if the Damage is 0, it is a miss.
Introduce comparisons from previous moves, compare successful hits, how long the player can hold, who will win, and any more.. add new things each time.

OUTPUT should be just the JSON object and no additional text.

Each commentary should be 10 words maximum.
`;

export const promptReplaceList = [
  "player1",
  "p1SuccessfulHits",
  "p1HitMiss",
  "p1t1Name",
  "p1t1health",
  "p1t2Name",
  "p1t2health",
  "p1t3Name",
  "p1t3health",
  "player2",
  "p2SuccessfulHits",
  "p2HitMiss",
  "p2t1Name",
  "p2t1health",
  "p2t2Name",
  "p2t2health",
  "p2t3Name",
  "p2t3health",
  "currentPlayerName",
    "currentPlayerTeamMember",
  "oppositePlayerName",
  "opponentTeamMember",
  "currentDamage",
  "currentPlayerTimeLeft",
  "currentRound",
  "p1RoundWins",
  "p2RoundWins",
];
