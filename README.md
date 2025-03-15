# 🎲 Dice Game - Fair Play with HMAC

## 📌 Overview
This is a **provably fair dice game** using **HMAC (Hash-based Message Authentication Code)**. The game ensures fairness by making the computer commit to a number **before** the user makes a decision, preventing any possibility of cheating.

## 📌 How the Game Works
1. The **computer commits** to a number using HMAC before revealing it.
2. The **user and computer determine who picks dice first**.
3. The **user selects a die** from three available options.
4. Both the **user and computer roll dice fairly** using HMAC.
5. The final **results are revealed**, and the **winner is determined**.
6. A **probability table** is displayed at the end for reference.

## 📌 Game Steps

### 1️⃣ Import Required Libraries
The game uses the following Node.js libraries:
- **crypto** → For HMAC generation.
- **readline** → For reading user input.
- **cli-table3** → For displaying a formatted table at the end.

### 2️⃣ Setup for User Input
The program uses `readline` to take input from the user.
- A helper function `getUserInput()` allows for **asynchronous input handling**.

### 3️⃣ Ensuring Fairness with HMAC
HMAC ensures that the **computer cannot cheat** by committing to a number before revealing it.

#### How It Works:
- A **random secret key** is generated.
- A **random number (0-5)** is generated.
- The number is hashed using **HMAC**.
- The **HMAC is revealed first**.
- After the user plays, the **secret key is revealed**, allowing verification.

### 4️⃣ Passing Dice from Command Line
- The game **expects three sets of dice**, each containing **six numbers**.
- If incorrect input is given, the game will **exit with an error message**.

### 5️⃣ Determining Who Picks Dice First
- Both the **user and computer generate a secret number (0 or 1)** using HMAC.
- The **HMAC is revealed before** the user selects their number.
- The **first player is determined** using modular addition:  
  `(computerNumber + userNumber) % 2`

### 6️⃣ Dice Selection
- The **program displays available dice**.
- The **user selects one**.
- The **computer picks another die**.

### 7️⃣ Rolling Dice Fairly
- The **computer commits to a roll using HMAC**.
- The **user selects a number between 0-5**.
- The **computer’s secret is revealed after selection**.

### 8️⃣ Fair Calculation of Dice Rolls
- The final **rolls are calculated** using:  
  `(random HMAC value + user’s number) % 6`
- This ensures that **both the user and computer contribute fairly**.

### 9️⃣ Determining the Winner
- **The higher roll wins**.

### 🔟 Displaying the Probability Table
- A **formatted table** (using `cli-table3`) is shown at the end displaying the dice values.

## ✅ Conclusion
- **Fairness is guaranteed using HMAC**.
- The **computer cannot change its decision** after committing.
- The **user has full transparency**.
- The **winner is determined through fair dice rolls**.

## 🚀 Running the Game
### **Install Dependencies**
```
npm install
```
### **Run the Game**
```
node game.js <dice1> <dice2> <dice3>
```
**Example:**
```
node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3
```

## 📜 License
This project is licensed under the MIT License.

---
🎲 **Enjoy the game! May the best roll win!** 🎲

