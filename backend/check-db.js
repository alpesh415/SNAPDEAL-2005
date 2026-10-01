// Usage (backend folder mein):  node check-db.js
// MongoDB connection test. Password kabhi print nahi hota.
require("dotenv").config({ quiet: true });

const mongoose = require("mongoose");

const uri = process.env.MONGO_URI || "";

const m = uri.match(/^mongodb(?:\+srv)?:\/\/(?:([^:@/]+):([^@]*)@)?([^/?]+)\/?([^?]*)/);

if (!m) {
    console.log("X MONGO_URI missing ya format galat hai. .env mein ye line honi chahiye:");
    console.log("  MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/snepdeal?retryWrites=true&w=majority");
    process.exit(1);
}

const [, user, pass, host, db] = m;

console.log("username        :", user || "(none)");
console.log("password length :", pass ? pass.length : 0);
console.log("host            :", host);
console.log("database        :", db || "(none - /snepdeal add karo)");

if (uri !== uri.trim() || /["'\s]/.test(uri)) {
    console.log("! MONGO_URI mein space ya quote (\" ') hai - use hata do.");
}
if (pass && /[@:/?#%\[\]]/.test(pass)) {
    console.log("! Password mein special character hai (@ : / ? # %). Simple password (letters/numbers) rakho.");
}
if (pass && /^<.*>$/.test(pass)) {
    console.log("! Password mein < > lage hain. Sirf password likho, < > ke bina.");
}

console.log("\nConnecting...");

mongoose
    .connect(uri, { serverSelectionTimeoutMS: 15000 })
    .then(async () => {
        console.log("OK  MongoDB connected. Database:", mongoose.connection.name);
        await mongoose.disconnect();
        process.exit(0);
    })
    .catch((err) => {
        const msg = String(err.message || "");
        console.log("X  Connect nahi hua:", msg);

        if (/bad auth|authentication failed/i.test(msg)) {
            console.log("=> Username ya password galat hai. Atlas > Database Access mein password reset karke .env mein wahi daalo.");
        } else if (/timed out|server selection|ECONNREFUSED/i.test(msg)) {
            console.log("=> Atlas > Network Access mein apna IP (ya 0.0.0.0/0) allow karo, phir 1 minute baad try karo.");
        } else if (/ENOTFOUND|querySrv/i.test(msg)) {
            console.log("=> Host naam galat hai ya internet/DNS problem hai. Atlas se connection string dobara copy karo.");
        }
        process.exit(1);
    });
