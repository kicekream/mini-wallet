const users = require ("./user");

module.exports = async (client) => {
    try {
        await client.query(users.CREATE_TABLE);
        console.log(`Table(s) Created`);
    }
    catch(error) {
        console.log({error});
    }
};
