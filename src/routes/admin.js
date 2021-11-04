const express = require("express");
const pool = require("../database/modelIndex");

const { auth } = require("../middleware/auth");
const {admin} = require("../middleware/admin")
const { validateFunding } = require("../utils/validateTransaction");

const router = express.Router();
router.use(express.json());

const fundWallet = router.put("/fund", [auth, admin], async (req, res) => {
  const { error } = validateFunding(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { account_number, amount } = req.body;
  try {
    let { rows } = await pool.query(
      `SELECT account_number, amount FROM wallets
              WHERE account_number = $1`,
      [account_number]
    );
    if (!rows[0]) {
      return res.status(404).send("User with account number not found");
    }
    const old_amount = parseFloat(rows[0].amount);
    const new_amount = amount + old_amount;
    console.log(new_amount);

    const result = await pool.query(
      `UPDATE wallets SET amount = $1
          WHERE account_number = $2 RETURNING amount`,
      [new_amount, account_number]
    );

    res.json({
      message: "Account funded",
      data: { account: account_number, new_balance: result.rows[0].amount },
    });
  } catch (error) {
    res.status(500).send("Error funding wallet");
  }
});

const makeAdmin = router.put("/makeadmin/:id", auth, async(req, res)=> {
    try {
        const {id} = req.params
        let { rows } = await pool.query(
          `SELECT is_admin, email FROM users
                  WHERE user_id = $1`,
          [id]
        );
        if (!rows[0])
        return res.status(404).json({status: 404, data: "User with Specified ID not found"});
    
        const result = await pool.query(
          `UPDATE users SET is_admin = true
              WHERE user_id = $1 RETURNING is_admin, email`,
          [id]
        );
    
        res.json({
          message: "Admin status Granted",
          data: { email: result.rows[0].email, admin: result.rows[0].is_admin },
        });
      } catch (error) {
        res.status(500).send("Error granting admin Access");
      }
})

const banUser = router.delete("/ban/:id", [auth, admin], async(req, res)=>{
    try {
        const {id} = req.params
        let { rows } = await pool.query(
          `SELECT is_banned, email FROM users
                  WHERE user_id = $1`,
          [id]
        );
        if (!rows[0])
        return res.status(404).json({status: 404, data: "User with Specified ID not found"});
    
        const result = await pool.query(
          `UPDATE users SET is_banned = true
              WHERE user_id = $1 RETURNING is_banned, email`,
          [id]
        );
    
        res.json({
          message: "User Banned",
          data: { email: result.rows[0].email, Banned: result.rows[0].is_admin },
        });
      } catch (error) {
        res.status(500).send("Error performing action");
      }
})

const liftBan = router.put("/unban/:id", [auth, admin], async(req, res)=>{
    try {
        const {id} = req.params
        let { rows } = await pool.query(
          `SELECT is_banned, email FROM users
                  WHERE user_id = $1`,
          [id]
        );
        if (!rows[0])
        return res.status(404).json({status: 404, data: "User with Specified ID not found"});
    
        if(rows[0].is_banned === false) return res.status(400).send("User does not have a ban")
        const result = await pool.query(
          `UPDATE users SET is_banned = false
              WHERE user_id = $1 RETURNING is_banned, email`,
          [id]
        );
    
        res.json({
          message: "Ban lifted",
          data: { email: result.rows[0].email, Banned: result.rows[0].is_admin },
        });
      } catch (error) {
        res.status(500).send("Error performing action");
      }
})

module.exports = { fundWallet, makeAdmin, banUser, liftBan };
