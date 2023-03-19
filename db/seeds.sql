INSERT INTO departments (department_name)
VALUES ("Finance"),("Service"),("Sales"),("Accounting");

INSERT INTO roles (job_title, salary, department_id)
VALUES ("CFO", "150000", 1),
       ("Receptionist", "50000", 2),
       ("Salesman", "65000", 3),
       ("Controller", "115000", 4);

INSERT INTO employee_data (first_name, last_name, role_id, manager_id)
VALUES ("Joe", "Don", 1, 1),
       ("Adam", "Smith", 2, 2),
       ("Karen", "Ho", 3, NULL),
       ("Amy", "Lee", 4, NULL);



