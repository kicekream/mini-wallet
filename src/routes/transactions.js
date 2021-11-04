const express = require("express");
const pool = require("../database/modelIndex");

const { auth } = require("../middleware/auth");

const {
  validateTransfer,
} = require("../utils/validateTransaction");
const { generateTxId } = require("../utils/generateTxId");

const router = express.Router();
router.use(express.json());

const allTransactions = router.get("/all", async(req, res)=>{
const data = `SELECT u.firstname as sender, us.firstname as receiver, t.amount as amount, t.transaction_code as tx_id, w.account_number as receiver_account_number, t.created_at as tx_date  
FROM transactions t
JOIN 
users u
ON t.sender_id = u.user_id
JOIN users us
ON
t.receiver_id = us.user_id 
JOIN wallets w 
ON t.receiver_id = w.wallet_user_id`

    try {
        const {rows} = await pool.query(data)
        if(!rows[0]) return res.status(404).json({ status: 404, data: "No user found" });
        res.json({ status: 200, data: rows });
    } catch(error) {
        res.status(500).send("An error occured fetching all Transactions")
    }
})

const transferFunds = router.post("/transfer", auth, async (req, res) => {
  const regex = /^\d+(\.\d{1,2})?$/;
  const amountTest = regex.test(req.body.amount);
  if (!amountTest)
    return res.status(400).send("Amount must be a number greater than 1");

  const { error } = validateTransfer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { account_number, amount, remark } = req.body;

  let receiver_id;
  try {
    const { rows } = await pool.query(
      `SELECT wallet_user_id FROM wallets where account_number = $1`,
      [account_number]
    );
    if (!rows[0])
      return res.send(res.status(400).send("Recipient does not exist"));
    console.log(rows);
    receiver_id = rows[0].wallet_user_id;

    const data = await pool.query(
      `SELECT amount FROM wallets where wallet_user_id = $1`,
      [req.user.user_id]
    );
    if (amount > data.rows[0].amount)
      return res.status(400).send("Insufficient funds, please top up");

    if (receiver_id === req.user.user_id)
      return res.status(400).send("Cannot transfer to own account");
  } catch (error) {
    console.log(error);
    return res.status(500).send("error initiating transaction");
  }

  try {
    const { user_id } = req.user;
    const result = await pool.query(`call test_transfer($1, $2, $3)`, [
      user_id,
      receiver_id,
      amount,
    ]);

    const txId = generateTxId();
    await pool.query(
      `INSERT INTO transactions(sender_id, receiver_id, amount, transaction_code, remark) 
      VALUES($1, $2, $3, $4, $5)`,
      [user_id, receiver_id, amount, txId, remark]
    );
    // console.log("done");
    res.json({message: "Transaction successful"});
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send("unable to perform transaction, please try again");
    // res.send(auth)
  }
});
module.exports = { transferFunds, allTransactions };
