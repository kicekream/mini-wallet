module.exports = {
CREATE_TABLE: `CREATE TABLE IF NOT EXISTS transactions(
        transaction_id serial PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        amount DECIMAL(13, 2) NOT NULL,
        transaction_code VARCHAR(150) NOT NULL,
        remark VARCHAR(150) DEFAULT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id)
            REFERENCES users (user_id),
        FOREIGN KEY (receiver_id)
            REFERENCES users (user_id)
    )
    `
};

// INSERT INTO 
// transactions(sender_id, receiver_id, amount, transaction_code, remark)
// VALUES(4, 5, 3000.00, 'zxcvb', 'genesis tx');