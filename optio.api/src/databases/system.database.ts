import * as mysql from 'mysql';

export class SystemDatabase {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: '192.168.1.18',
      user: 'sa',
      password: 'ahoj',
      database: 'OptioSystem'
    });
  }

  query(sql: string, parameters: any, callback: any) {
    this.pool.query(sql, parameters, (error: any, results: any, fields: any) => {
      if (error) throw error;
      callback(results);
    });
  }
}
