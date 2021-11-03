const {customAlphabet} = require("nanoid")

function createNumber(user_id) {
    let acct = customAlphabet('1234567890', 8)
    let accountNumber = acct()
    accountNumber = `${accountNumber}${user_id}`
    return accountNumber
  }

  module.exports = {createNumber};