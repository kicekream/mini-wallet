CREATE TABLE IF NOT EXISTS users(
          user_id serial PRIMARY KEY,
          firstname VARCHAR(150) NOT NULL,
          lastname VARCHAR(150) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          is_admin BOOLEAN DEFAULT FALSE,
          is_banned BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
CREATE TABLE IF NOT EXISTS wallets(
          wallet_id serial PRIMARY KEY,
          wallet_user_id INT NOT NULL,
          account_number VARCHAR(150) UNIQUE NOT NULL,
          amount DECIMAL(13, 2) DEFAULT 0.00,
          FOREIGN KEY (wallet_user_id)
          REFERENCES users (user_id),
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
CREATE TABLE IF NOT EXISTS transactions(
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
    );

CREATE OR REPLACE PROCEDURE "test_transfer" (sender_id int, receiver_id int, amt decimal(13, 2))
language plpgsql
as $$
BEGIN
update wallets
set amount = amount - amt
where wallet_user_id = sender_id;
update wallets
set amount = amount + amt
where wallet_user_id = receiver_id;
commit;
end;$$
;