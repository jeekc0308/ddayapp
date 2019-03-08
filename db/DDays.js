import { SQLite } from "expo";

/**
 *
 * @param {*} db
 */
const transaction = db => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      resolve(tx);
    });
  });
};
/**
 *
 * @param {*} tx
 * @param {string} sql
 * @param {array=} _arguments
 */
const asyncExecuteSql = (tx, sql, _arguments) => {
  return new Promise((resolve, reject) => {
    tx.executeSql(
      sql,
      _arguments,
      (self, ResultSet) => {
        resolve({ self: self, ResultSet: ResultSet });
      },
      (self, error) => {
        resolve({ self: self, error: error });
      }
    );
  });
};
export default class DBDDays {
  constructor() {
    this.db_file = "database1.db";
    this.db = SQLite.openDatabase(this.db_file);
    this.isTableCreated = false;
    transaction(this.db)
      .then(tx => {
        return Promise.all([
          asyncExecuteSql(
            tx,
            "create table if not exists `ddays` (id INTEGER not null PRIMARY KEY AUTOINCREMENT, name varchar(45) not null, date datetime, `memo` TEXT );"
          ),
          asyncExecuteSql(
            tx,
            "create table if not exists `todos` (id INTEGER not null PRIMARY KEY AUTOINCREMENT, name varchar(45) not null, dday INTEGER, isFulfill BOOLEAN default false, FOREIGN KEY(dday) REFERENCES ddays(id) );"
          )
          //asyncExecuteSql(tx, "delete table if exists `ddays`;")
          //asyncExecuteSql(tx, "delete table if exists `todos`;")
        ]);
      })
      .then(value => {
        this.isTableCreated = true;
      })
      .catch(value => {
        console.log(value);
      });
  }
  async getDdays() {
    let tx = await transaction(this.db);
    let datas = await asyncExecuteSql(
      tx,
      "select * from `ddays` order by `date` asc",
      null
    );
    let arr = datas.ResultSet.rows._array;
    let returnDatas = [];
    for (i in arr) {
      let value = arr[i];
      let tx = await transaction(this.db);
      let todos = await asyncExecuteSql(
        tx,
        "select * from `todos` where `dday`=?",
        [value.id]
      );

      returnDatas.push({
        date: value.date,
        id: value.id,
        memo: value.memo,
        name: value.name,
        todos: todos.ResultSet.rows._array
      });
    }
    return returnDatas;
  }
  /**
   *
   * @param {Object} datas
   * @param {string} datas.name
   * @param {Date} datas.date
   * @param {string=} datas.memo
   * @param {array=} datas.todos
   */
  async insertDDays(datas) {
    let tx = await transaction(this.db);
    let data = await asyncExecuteSql(
      tx,
      "insert into `ddays` (name, date, memo) values (?, ?, ?)",
      [datas.name, datas.date, datas.memo]
    );
    let id = data.ResultSet.insertId;
    let todos = datas.todos;
    if (!todos || todos.length < 1) {
      return;
    }
    for (i in todos) {
      let tx = await transaction(this.db);
      await asyncExecuteSql(
        tx,
        "insert into `todos` (name, dday) values (?, ?)",
        [todos[i], id]
      );
    }

    return;
  }
  async deleteDdays(id) {
    let tx = await transaction(this.db);
    await asyncExecuteSql(tx, "delete from `ddays` where id=?", [id]);
    asyncExecuteSql(tx, "delete from `todos` where `dday`=?", [id]);
    return;
  }
  async todoFulfillToggle(id) {
    let tx = await transaction(this.db);
    await asyncExecuteSql(
      tx,
      "update `todos` set `isFulfill`=NOT `isFulfill` where `id`=?",
      [id]
    );
    return;
  }
}
