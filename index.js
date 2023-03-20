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
            const departments = await employeeQuery.viewAllDepartments();
            console.table(departments);
            break;

          case "View all roles":
            const roles = await employeeQuery.viewAllRoles();
            console.table(roles);
            break;

          case "View all employees":
            const employees = await employeeQuery.viewAllEmployees();
            console.table(employees);
            break;

          case "Add a department":
            await employeeQuery.addDepartment();
            break;

          case "Add a role":
            await addRoleQuestion();
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

const addRoleQuestion = async () => {
  try {
    const departmentOb = await employeeQuery.viewAllDepartments();
    const departmentName = await departmentOb.map((el) => el.department_name);
    await inquirer
      .prompt([
        {
          type: "input",
          name: "job_title",
          message: "What is the job_title of the role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
        },
        {
          type: "list",
          name: "department_name",
          message: "which department does this role belong to?",
          choices: departmentName,
        },
      ])
      .then((answer) => {
        employeeQuery.addRole(answer);
        console.log(
          `\n New role [${answer.job_title}] has been added successfully`
        );
      });
  } catch (err) {
    console.error(err);
  }
};

init();
