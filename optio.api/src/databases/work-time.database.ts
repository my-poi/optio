import * as mysql from 'mysql2/promise';
import { config } from '../config';

export class WorkTimeDatabase {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: config.connectionLimit,
      host: config.host,
      user: config.user,
      password: config.password,
      database: 'OptioWorkTime'
    });
  }

  async execute(sql: string, values: any) {
    const [rows, fields] = await this.pool.execute<mysql.RowDataPacket[]>(sql, values);
    return rows;
  }

  async transaction(queryList: {sql: string, values: any}[]) {
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: 'OptioWorkTime'
    });

    await connection.beginTransaction();
    queryList.forEach(async (x: any) => await connection.query(x.sql, x.values));
    await connection.commit();
    connection.destroy();
  }
}
