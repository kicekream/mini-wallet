module.exports = {
    CREATE_TABLE: `CREATE TABLE IF NOT EXISTS wallets(
          wallet_id serial PRIMARY KEY,
          wallet_user_id INT NOT NULL,
          account_number VARCHAR(150) UNIQUE NOT NULL,
          amount DECIMAL(13, 2) DEFAULT 0.00,
          FOREIGN KEY (wallet_user_id)
          REFERENCES users (user_id),
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
      `
  };