const path = require("path");

const fs = require("fs");

const solc = require("solc");

const inboxPath = path.resolve(__dirname, "Contracts", "Inbox.sol");

const source = fs.readFileSync(inboxPath, "utf-8");

const compiled = solc.compile(source);

module.exports = compiled.contracts[":Inbox"];
