export const config = {
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: 'sa',
  password: 'ahoj',
  secretKey: 'secret_key',
  salt: 'secret_salt'
};
