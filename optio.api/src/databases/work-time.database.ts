import * as mysql from 'mysql2/promise';

export class WorkTimeDatabase {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: '127.0.0.1', // 192.168.1.18
      user: 'sa',
      password: 'ahoj',
      database: 'OptioWorkTime'
    });
  }

  async execute(sql: string, values: any) {
    const [rows, fields] = await this.pool.execute<mysql.RowDataPacket[]>(sql, values);
    return rows;
  }
}
