const table = require("console.table");
const mysql = require("mysql2");
const inquirer = require("inquirer");
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
      .then(([rows]) => rows)
      .catch((err) => console.log(err));
  };

  viewAllRoles = () => {
    const sql = `SELECT roles.id, roles.job_title, roles.salary, departments.department_name
                 FROM roles LEFT JOIN departments
                 ON roles.department_id = departments.id`;
    return db
      .promise()
      .query(sql)
      .then(([rows]) => rows)
      .catch((err) => console.log(err));
  };

  viewAllEmployees = () => {
    const sql = `SELECT employee_data.id, employee_data.first_name, employee_data.last_name, roles.job_title, departments.department_name, roles.salary,
                 CONCAT(manager.first_name,' ', manager.last_name) AS manager_name
                 FROM employee_data
                 JOIN roles ON employee_data.role_id = roles.id
                 JOIN departments ON roles.department_id = departments.id
                 LEFT JOIN employee_data manager ON employee_data.manager_id = manager.id
                 `;
    return db
      .promise()
      .query(sql)
      .then(([rows]) => rows)
      .catch((err) => console.log(err));
  };
  //I will keep the approach to write this method as a future reference. But for addRole, the function of inquirer will be
  //added to the index.js as I cannot resolve some async issues.
  addDepartment = () => {
    return new Promise((resolve, reject) => {
      inquirer
        .prompt([
          {
            type: "input",
            name: "name",
            message: "What is the name of the department?",
          },
        ])
        .then((answer) => {
          const sql = "INSERT INTO departments (department_name) VALUES (?)";
          //answer.name is a value in the array of the 2nd argument of db.query method. If I have two "? ?" after the VALUES in the sql, the 2nd
          //value of the array will replace the 2nd "?" in the sql respectively
          db.query(sql, [answer.name], (err, result) => {
            if (err) {
              reject(err);
            } else {
              console.log(
                `\n New department [${answer.name}] has been added successfully`
              );
              resolve(result);
            }
          });
        });
    });
  };

  addRole = (answer) => {
    let id;
    const getIdSql = "SELECT id FROM departments WHERE department_name = ?";
    const insertSql =
      "INSERT INTO roles (job_title, salary, department_id) VALUES (?, ?, ?)";
    return db
      .promise()
      .query(getIdSql, [answer.department_name])
      .then(([rows]) => {
        id = rows[0].id;
        return db
          .promise()
          .query(insertSql, [answer.job_title, answer.salary, id])
          .then(([rows]) => {
            // console.log(
            //   `New role [${answer.job_title}] has been added successfully`
            // );
            return rows;
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
}

module.exports = PersonnelManaging;
