const { table } = require("console");
const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "dawanzi",
    database: "personnel_db",
  },
  console.log("Connected to the personnel_db database.")
);

db.connect((err) => {
  if (err) throw err;

  init();
});

const init = () => {
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
    .then(function (answer) {
      // Call the appropriate function based on the user's choice
      switch (answer.action) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        default:
          console.log("Terminating App. Goodbye");
          break;
      }
    });
};

const viewAllDepartments = () => {
  db.query("SELECT * FROM departments", (err, results) => {
    if (err) throw err;
    //because I required the build-in module "console" and destructured the "table function from the module - - {table}.
    //I can now just use "table" instead of console.table. No more prefixing.
    table(results);

    init();
  });
};
const viewAllRoles = () => {
  db.query("SELECT * FROM roles", (err, results) => {
    if (err) throw err;
    table(results);
    init();
  });
};
const viewAllEmployees = () => {
  db.query("SELECT * FROM employee_data", (err, results) => {
    if (err) throw err;
    table(results);
    init();
  });
};

const addDepartment = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of the department?",
    },
  ]);
};
