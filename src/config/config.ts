import dotenv from 'dotenv';

dotenv.config();

export const config = {
  bcrypt: {
    saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10, // Podrazumevano 10
  },
  server: {
    port: process.env.PORT || 3000,
  },
};
