const table = require("console.table");
const inquirer = require("inquirer");
const fs = require("fs");
const EmployeeQuery = require("./lib/personnelDatabase");
const employeeQuery = new EmployeeQuery();
const mysql = require("mysql2");
require("dotenv").config();

const init = () => {
  console.log(
    `Caution: This personnel database contains sensitive and confidential information. Access is restricted to authorized personnel only.\n`
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
      // to ensure the await works, all methods from employeeQuery must return a promise. Otherwise, it won't wait for the methods to complete but instead directly jump to isMore()
      try {
        console.log("\n");
        switch (answer.action) {
          case "View all departments":
            await employeeQuery.viewAllDepartments();
            break;

          case "View all roles":
            await employeeQuery.viewAllRoles();
            break;

          case "View all employees":
            await employeeQuery.viewAllEmployees();
            break;

          case "Add a department":
            await employeeQuery.addDepartment();
            break;

          case "Add a role":
            await employeeQuery.addRole();
            break;

          case "Add an employee":
            await employeeQuery.addEmployee();
            break;

          case "Update an employee role":
            await employeeQuery.updateEmployeeRole();
            break;

          default:
            console.log("Terminating App. Goodbye");
            process.exit(0);
        }
        isMore();
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
