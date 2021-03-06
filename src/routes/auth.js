const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../database/modelIndex");

const { validateUserReg, validateUserLogin } = require("../utils/validateUser");
const { generateAuthToken } = require("../utils/jwt");
const { createNumber } = require("../utils/createWallet");

const router = express.Router();
router.use(express.json());

const signup = router.post("/signup", async (req, res) => {
  const { error } = validateUserReg(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { firstname, lastname, email, password } = req.body;
  try {
    const { rows } = await pool.query(
      "SELECT email FROM users WHERE email = $1",
      [email]
    );
    if (rows.length >= 1) return res.status(400).send("User already exists");
  } catch (err) {
    console.log(`Error verifying User existence`);
    res.status(500).send("Something failed, Error verifying user existence");
  }
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  const { rows } = await pool.query(
    "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING user_id, email, is_admin, is_banned",
    [firstname, lastname, email, password]
  );
  let account_number;
  if (rows) {
    account_number = createNumber(rows[0].user_id);
    const walletDetails = await pool.query(
      `INSERT INTO wallets (wallet_user_id, account_number) VALUES ($1, $2) RETURNING wallet_id, account_number`,
      [rows[0].user_id, account_number]
    );

    console.log(`account number created`);
  }
  const token = generateAuthToken(rows[0]);
  res.header("x-auth-token", token).json({
    message: "Registration successful",
    data: rows[0],
    account_number: account_number,
    "x-auth-token": token,
  });
});

const login = router.post("/login", async (req, res) => {
  try {
    const { error } = validateUserLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;
    const { rows } = await pool.query(
      "SELECT user_id, email, password, is_admin, is_banned FROM users WHERE email = $1",
      [email]
    );

    if (rows.length === 0 || email !== rows[0].email)
      return res.status(400).send("Invalid email provided");

    const compPassword = await bcrypt.compare(password, rows[0].password);
    if (!compPassword)
      return res.status(400).send("Incorrect password provided");

    const token = generateAuthToken(rows[0]);

    res
      .header("x-auth-token", token)
      .json({ message: "logged in", "x-auth-token": token });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed");
  }
});

module.exports = { signup, login };
