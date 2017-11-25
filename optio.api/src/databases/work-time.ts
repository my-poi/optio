import * as mysql from 'mysql';

export class WorkTime {
  private pool: mysql.Pool;
  private counter = 0;

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
      this.counter += 1;
      console.log(this.counter);
    });
  }

  // foo(sql: string, values: any, callback: any) {
  //   this.pool.getConnection((err, connection) => {
  //     if (err) throw err;
  //     connection.query(sql, values, (error, result) => {
  //       connection.release();
  //       if (error) throw error;
  //       callback(result);
  //     });
  //   });
  // }
}
