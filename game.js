import { createHmac, randomBytes } from "crypto";
import { createInterface } from "readline";
import Table from "cli-table3";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, (ans) => res(ans.trim())));

const generateHMAC = (val, key) => createHmac("sha256", key).update(val.toString()).digest("hex");

const generateSecret = () => {
    const key = randomBytes(32).toString("hex");
    const val = Math.floor(Math.random() * 6);
    return { key, val, hmac: generateHMAC(val, key) };
};

const parseDice = (args) => {
    if (args.length < 3) throw new Error("Err: At least three dice are required.");
    return args.map(arg => {
        const numbers = arg.split(",").map(Number);
        if (numbers.length !== 6 || numbers.some(isNaN)) throw new Error("Invalid dice format.");
        return numbers;
    });
};

const playGame = async (dice) => {
    console.log("\nWelcome to the Fair Dice Game!");

    const firstMove = generateSecret();
    console.log(`I selected a value in the range 0..1 (HMAC=${firstMove.hmac}).`);

    console.log("Gess my selection.");
    console.log("0 - 0\n1 - 1\nX - exit\n? - help");
    const userPick = await ask("Your selection: ");
    if (!["0", "1"].includes(userPick)) return console.log("Invalid input. Exiting.");

    console.log(`My selection: ${firstMove.val} (KEY=${firstMove.key}).`);
    const firstMover = (firstMove.val + parseInt(userPick, 10)) % 2 === 0 ? "Computer" : "User";
    console.log(`${firstMover} makes the first move.`);

    const computerChoice = firstMover === "Computer" ? Math.floor(Math.random() * dice.length) : null;
    if (computerChoice !== null) {
        console.log(`I choose the [${dice[computerChoice].join(", ")}] dice.`);
    }

    console.log("Choose your dice:");
    dice.forEach((die, i) => console.log(`${i} - ${die.join(", ")}`));
    const userChoice = await ask("Your selection: ");
    if (!dice[userChoice]) return console.log("Invalid choice. Exiting.");
    console.log(`You choose the [${dice[userChoice].join(", ")}] dice.`);

    const userDie = dice[userChoice];
    const computerDie = dice[computerChoice !== null ? computerChoice : dice.findIndex((_, i) => i !== userChoice)];

    const computerRoll = generateSecret();
    console.log(`I selected a value in the range 0..5 (HMAC=${computerRoll.hmac}).`);
    console.log("Add your number modulo 6.");
    console.log("0 - 0\n1 - 1\n2 - 2\n3 - 3\n4 - 4\n5 - 5\nX - exit\n? - help");

    const userRollChoice = await ask("Your selection: ");
    if (!["0", "1", "2", "3", "4", "5"].includes(userRollChoice)) return console.log("Invalid input. Exiting.");

    console.log(`My number is ${computerRoll.val} (KEY=${computerRoll.key}).`);
    const finalComputerRoll = computerDie[(computerRoll.val + parseInt(userRollChoice, 10)) % 6];
    console.log(`The fair number generation result is ${computerRoll.val} + ${userRollChoice} = ${(computerRoll.val + parseInt(userRollChoice, 10)) % 6} (mod 6).`);
    console.log(`My roll result is ${finalComputerRoll}.`);

    const userRoll = generateSecret();
    console.log(`I selected a value in the range 0..5 (HMAC=${userRoll.hmac}).`);
    console.log("Add your number modulo 6.");

    const userFinalRollChoice = await ask("Your selection: ");
    if (!["0", "1", "2", "3", "4", "5"].includes(userFinalRollChoice)) return console.log("Invalid input. Exiting.");

    console.log(`My number is ${userRoll.val} (KEY=${userRoll.key}).`);
    const finalUserRoll = userDie[(userRoll.val + parseInt(userFinalRollChoice, 10)) % 6];
    console.log(`The fair number generation result is ${userRoll.val} + ${userFinalRollChoice} = ${(userRoll.val + parseInt(userFinalRollChoice, 10)) % 6} (mod 6).`);
    console.log(`Your roll result is ${finalUserRoll}.`);

    if (finalUserRoll > finalComputerRoll) {
        console.log(`You win (${finalUserRoll} > ${finalComputerRoll})!`);
    } else if (finalUserRoll < finalComputerRoll) {
        console.log(`Computer wins (${finalUserRoll} < ${finalComputerRoll})!`);
    } else {
        console.log("It's a tie!");
    }

    const table = new Table({ head: ["Die", "1", "2", "3", "4", "5", "6"] });
    dice.forEach((die, i) => table.push({ [`Dice ${i}`]: die }));
    console.log("\nProbability Table:\n" + table.toString());

    rl.close();
};

try {
    playGame(parseDice(process.argv.slice(2)));
} catch (err) {
    console.error(err.message);
    rl.close();
}



