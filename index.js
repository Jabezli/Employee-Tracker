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
            await addEmployeeQustion();
            break;

          case "Update an employee role":
            await updateRoleQuestion();
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

const addEmployeeQustion = async () => {
  try {
    const roleOb = await employeeQuery.viewAllRoles();
    const roleName = await roleOb.map((el) => el.job_title);
    const employeeOb = await employeeQuery.viewAllEmployees();
    // employeeOb will use the viewAllEmployee method to return an array with objects for all employees.
    // I want to see all the managers but not all the employees are managers. Instead of creating a new method to viewAllManager
    // I first map out all the employees that are managers then using filter to remove nulls.
    // the if statement will each value of the array to see if it doesn't equal to null. If doesn't equal, the name is a manager and will be returned to the new array.
    // At the end of the map, I added the filter function and use Boolean function as the argument. Basically, it removes all the falsy, in here, the nulls.

    const managerList = await employeeOb
      .map((el) => {
        if (el.manager_name !== null) {
          return el.manager_name;
        }
      })
      .filter(Boolean);
    await inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the first name of the employee?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the last name of the employee?",
        },
        {
          type: "list",
          name: "job_title",
          message: "What is the job_title of the role?",
          choices: roleName,
        },
        {
          type: "list",
          name: "manager_name",
          message: "who is the manager of this employee?",
          choices: managerList,
        },
      ])
      .then((answer) => {
        employeeQuery.addEmployee(answer);
      });
  } catch (err) {
    console.error(err);
  }
};
// need to update first last name and role
const updateRoleQuestion = async () => {
  try {
    const employee = await employeeQuery.viewAllEmployees();
    const employeeName = await employee.map((employee) => ({
      fullName: employee.first_name + " " + employee.last_name,
      value: employee.id,
    }));
    const roles = await employeeQuery.viewAllRoles();
    const roleList = roles.map((role) => role.job_title);

    console.log(employeeName);
    await inquirer
      .prompt([
        {
          type: "list",
          name: "employee_name",
          message: "Which employee's rode do you want to update?",
          choices: employeeName.map((employee) => employee.fullName),
        },
        {
          type: "list",
          name: "job_title",
          message: "Which role do you want to assign to the selected employee?",
          choices: roleList,
        },
      ])
      .then((answer) => {
        // in the choices of first prompt, I mapped out the employees' full names from employeeName, which also has corresponding id.
        // using find method to loop out the id of the selected employee. The ".value" is the key of the employee.id.
        const selectedEmployeeId = employeeName.find(
          (employee) => employee.fullName === answer.employee_name
        ).value;
        console.log(selectedEmployeeId);
        employeeQuery.updateRole(answer, selectedEmployeeId);
      });
  } catch (err) {
    console.error(err);
  }
};
init();
