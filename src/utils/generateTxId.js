const {customAlphabet} = require("nanoid")

function generateTxId() {
    let tx = customAlphabet('1234567890abcdeftuvwxyz', 10)
    let txId = tx()

    return txId
  }

  module.exports = {generateTxId};