const users = require ("./user");
const transaction = require("./transaction")
const wallet = require("./wallet")

module.exports = async (client) => {
    try {
        await client.query(users.CREATE_TABLE);
        await client.query(transaction.CREATE_TABLE);
        await client.query(wallet.CREATE_TABLE);
        console.log(`Table(s) Created`);
    }
    catch(error) {
        console.log({error});
    }
};
