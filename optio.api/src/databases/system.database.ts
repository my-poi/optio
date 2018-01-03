import * as mysql from 'mysql2/promise';
import { config } from '../config';

export class SystemDatabase {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: config.connectionLimit,
      host: config.host,
      user: config.user,
      password: config.password,
      database: 'OptioSystem'
    });
  }

  async execute(sql: string, values: any) {
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(sql, values);
    return rows;
  }

  async query(sql: string, values: any) {
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(sql, values);
    return rows;
  }

  async transaction(queryList: { sql: string, values: any }[]) {
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: 'OptioWorkTime'
    });

    await connection.beginTransaction();
    queryList.forEach(async (x: any) => await connection.query<mysql.RowDataPacket[]>(x.sql, x.values));
    await connection.commit();
    connection.destroy();
  }
}
