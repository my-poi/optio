import * as mysql from 'mysql';

export class WorkTimeDatabase {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: '192.168.1.18',
      user: 'sa',
      password: 'ahoj',
      database: 'OptioWorkTime'
    });
  }

  query(sql: string, values: any, callback: any) {
    this.pool.query(sql, values, (error: any, results: any, fields: any) => {
      if (error) throw error;
      callback(results);
    });
  }
}
