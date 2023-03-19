const table = require("console.table");
const inquirer = require("inquirer");
const fs = require("fs");
const EmployeeQuery = require("./lib/personnelDatabase");
const employeeQuery = new EmployeeQuery();
const mysql = require("mysql2");
require("dotenv").config();

// const db = mysql.createConnection(
//   {
//     host: "localhost",
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//   },
//   console.log("Connected to the personnel_db database.")
// );

const init = () => {
  console.log(
    "Caution: This personnel database contains sensitive and confidential information. Access is restricted to authorized personnel only."
  );
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        //it stops the choices from rolling up, which is confusing.
        pageSize: 1000,
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Quit Application",
        ],
      },
    ])
    .then(async function (answer) {
      // Call the appropriate function based on the user's choice
      try {
        switch (answer.action) {
          case "View all departments":
            console.log("\n");
            await employeeQuery.viewAllDepartments();
            isMore();
            break;
          case "View all roles":
            employeeQuery.viewAllRoles();
            break;
          case "View all employees":
            employeeQuery.viewAllEmployees();
            break;
          case "Add a department":
            employeeQuery.addDepartment();
            break;
          case "Add a role":
            employeeQuery.addRole();
            break;
          case "Add an employee":
            employeeQuery.addEmployee();
            break;
          case "Update an employee role":
            employeeQuery.updateEmployeeRole();
            break;
          default:
            console.log("\n");
            console.log("Terminating App. Goodbye");
            process.exit(0);
        }
      } catch (err) {
        console.error(err);
      }
    });
};

const isMore = () => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "isMore",
        message: "If you want to go back to main menu, please type 'Y' ",
      },
    ])
    .then((answer) => {
      if (answer.isMore) {
        console.log("\n");
        init();
      } else {
        console.log("\n");
        console.log("Terminating App. Goodbye");
        process.exit(0);
      }
    });
};

init();
