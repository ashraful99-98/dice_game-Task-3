import { createHmac, randomBytes } from "crypto";
import { createInterface } from "readline";
import Table from "cli-table3";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const getUserInput = (question) => new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));

const generateHMAC = (value, key) => createHmac("sha256", key).update(value.toString()).digest("hex");
const generateFairValue = () => {
    const secretKey = randomBytes(16).toString("hex");
    const value = Math.floor(Math.random() * 6);
    return { secretKey, value, hmac: generateHMAC(value, secretKey) };
};

const parseDice = (args) => {
    if (args.length < 3) throw new Error("Error: Provide at least three sets of dice.");
    return args.map(arg => {
        const numbers = arg.split(",").map(n => parseInt(n, 10));
        if (numbers.length !== 6 || numbers.some(isNaN)) throw new Error("Invalid dice format.");
        return numbers;
    });
};

const displayOptions = (dice) => dice.forEach((die, i) => console.log(`${i + 1}: [${die.join(", ")}]`));

const playGame = async (dice) => {
    console.log("\nWelcome to the Fair Dice Game!");

    const computerFirstHMAC = generateFairValue();
    console.log(`Computer's HMAC: ${computerFirstHMAC.hmac}`);

    const userFirstChoice = parseInt(await getUserInput("Enter 0 or 1 to decide who picks first: "), 10);
    if (![0, 1].includes(userFirstChoice)) return console.log("Invalid input. Exiting.");

    console.log(`Computer's secret: ${computerFirstHMAC.value}`);
    console.log(`You selected: ${userFirstChoice}`);
    console.log(`First move goes to: ${((computerFirstHMAC.value + userFirstChoice) % 2 === 0) ? "Computer" : "User"}`);

    displayOptions(dice);
    const userChoice = parseInt(await getUserInput("Pick a die (1-3): "), 10);
    if (userChoice < 1 || userChoice > dice.length) return console.log("Invalid choice. Exiting.");

    const userDie = dice[userChoice - 1];
    const computerDie = dice.find((_, i) => i !== (userChoice - 1));
    console.log(`You: ${userDie.join(", ")}`);
    console.log(`Computer: ${computerDie.join(", ")}`);

    const userRollHMAC = generateFairValue();
    const computerRollHMAC = generateFairValue();
    console.log(`Computer's roll HMAC: ${computerRollHMAC.hmac}`);

    const userRollChoice = parseInt(await getUserInput("Enter a number (0-5) for your roll: "), 10);
    if (userRollChoice < 0 || userRollChoice > 5) return console.log("Invalid input. Exiting.");

    const finalUserRoll = userDie[(userRollHMAC.value + userRollChoice) % 6];
    const finalComputerRoll = computerDie[(computerRollHMAC.value + userRollChoice) % 6];

    console.log(`Computer's secret: ${computerRollHMAC.value}`);
    console.log(`Final rolls - You: ${finalUserRoll}, Computer: ${finalComputerRoll}`);
    console.log(finalUserRoll > finalComputerRoll ? "You win!" : finalUserRoll < finalComputerRoll ? "Computer wins!" : "It's a tie!");

    const table = new Table({ head: ["Die", "1", "2", "3", "4", "5", "6"] });
    dice.forEach((die, i) => table.push({ [`Dice ${i + 1}`]: die }));
    console.log("\nProbability Table:\n" + table.toString());

    rl.close();
};

try {
    const dice = parseDice(process.argv.slice(2));
    playGame(dice);
} catch (error) {
    console.error(error.message);
    rl.close();
}
