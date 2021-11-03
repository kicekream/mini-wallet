const express = require("express");
const pool = require("../database/modelIndex");

const router = express.Router();
router.use(express.json());

const getUsers = router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT  firstname, lastname, email, password, is_admin FROM users ORDER BY user_id ASC`
    );
    if (!rows[0])
      return res.status(404).json({ status: 200, data: "No user found" });
    res.json({ status: 200, data: rows });
  } catch (error) {
    res.status(500).send("Error occured, please try again");
  }
});

const getUser = router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE user_id=$1", [
      req.params.id,
    ]);
    if (!rows[0])
      return res.status(404).json({status: 404, data: "User with Specified ID not found"});
    res.json({status:200, data:rows[0]});
  } catch (error) {
    console.log(error);
    res.status(500).send("Error Occured, Please try again");
  }
});

module.exports = { getUsers, getUser };
