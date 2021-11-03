const express = require("express");
const { sign } = require("jsonwebtoken");
require("dotenv/config");

const {signup, login} = require("./routes/auth")
const {allTransactions, transferFunds} = require("./routes/transactions")
const {getUsers, getUser} = require("./routes/users")
const {fundWallet, makeAdmin, banUser, liftBan} = require("./routes/admin")

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use("/v1", signup);
app.use("/v1", login);
app.use("/v1", allTransactions);
app.use("/v1/admin", fundWallet);
app.use("/v1/admin", makeAdmin);
app.use("/v1/admin", banUser);
app.use("/v1/admin", liftBan)
app.use("/v1/transactions", transferFunds);
app.use("/v1/users", getUsers);
app.use("/v1/users", getUser);


if (!process.env.jwtPrivateKey) {
    console.error("jwtPrivateKey is not defined in env variable");
    process.exit(1);
  }

const server = app.listen(port, () => {
  console.log(
    `App started on port ${port}, database started as ${process.env.NODE_ENV}`
  );
});

module.exports = server;