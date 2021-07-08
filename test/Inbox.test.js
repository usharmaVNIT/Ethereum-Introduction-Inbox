const assert = require("assert");

// This is a test so we need a network to test our contract so to know how it
// Behaves in the network so we use ganache cli to create a local
// test network

const ganache = require("ganache-cli");

// Now Web3 has 2 versionings
//      1 ->    0.*.*  this uses callbacks to deal with async calls
//      2 ->    1.*.* this has promises so we can use async await syntax to make it more sync in codeing

// Web3 is a library that connects to the www so it needs a provider as to connect
// to specific networks
//      WEB3 <----------------> Provider( by network)  <----------------> NETWORK
//              Provider is basically a pipeline to communicate with the network

const Web3 = require("web3");

const provider = ganache.provider();

const web3 = new Web3(provider);

const { interface, bytecode } = require("../compile");

let accounts;
let inbox;
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  // All the calls for web3 is async
  // This Contract property helps to deploy a contract or interact with the contract
  // We parse the string rep of interface and tell it that this is the interface
  // of the contract that we want to communnicate (already deployed)
  // with or to to deploy
  // The deploy method creates an object ( copy or transaction ) that is
  // needed to be deployed
  // Then the send method actually creates a transaction and send it to the
  // Network and then the network  will deploy the contract
  // In this cases the to: field in the transaction is empty
  // and it tells the network that it is infact a contract that needs to be deployed

  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ["Initial Message"],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Contract Inbox", () => {
  it("gets Accounts", () => {
    console.log(accounts);
  });
  it("deploys contract", () => {
    assert.ok(inbox.options.address);
  });
  it("has a default message ", async () => {
    const message = await inbox.methods.message().call();
    // So This is basically calling a message and inside the
    // function name we pass argument and then call the .call()
    // method to actually call the unction of the contract that
    // is deployed at a block chain
    // Now if this was a transaction then you would have to actually
    // specify the from parameter inside the send() method
    assert.strictEqual(message, "Initial Message");
  });

  it("can change the message", async () => {
    const transactionHash = await inbox.methods
      .setMessage("Message Changed")
      .send({
        from: accounts[0],
      });
    // Note this is a transaction that is why it has a send from a account
    const message = await inbox.methods.message().call();
    assert.strictEqual(message, "Message Changed");
  });
});
