const table = require("console.table");
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log("Connected to the personnel_db database.")
);

class PersonnelManaging {
  viewAllDepartments = () => {
    const sql = `SELECT * FROM departments`;
    return db
      .promise()
      .query(sql)
      .then(([rows]) => console.table(rows))
      .catch((err) => console.log(err));
  };
  viewAllRoles = () => {
    db.query("SELECT * FROM roles", (err, results) => {
      if (err) throw err;
      console.table(results);
    });
  };

  viewAllEmployees = () => {
    db.query("SELECT * FROM employee_data", (err, results) => {
      if (err) throw err;
      console.table(results);
    });
  };

  addDepartment = () => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "What is the name of the department?",
        },
      ])
      .then((answer) => {
        db.query("INSERT INTO departments (department_name) VALUES (?)");
      });
  };
}

module.exports = PersonnelManaging;
