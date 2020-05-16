const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connection successful!");
  showProducts();
});

function showProducts() {
  // Displaying an initial list of products for the user, calling promptSupervisor
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    promptQuestions();
  });
}

function promptQuestions() {
  // Giving the user some options for what to do next
  inquirer.prompt([
        {
          type: "list",
          name: "choice",
          message: "What would you like to do?",
          choices: ["View Product Sales by Department", "Create New Department", "Quit"]
        }
      ])
      .then(function(answer) {
        // Checking to see what option the user chose and running the appropriate function
        if (answer.choice === "View Product Sales by Department") {
          viewSales();
        }
        else if (answer.choice === "Create New Department") {
          addDepartment();
        }
        else {
          console.log("Goodbye!");
          process.exit(0);
        }
      });
}

function viewSales() {
  // Selects a few columns from the departments table, calculates a total_profit column
  connection.query(
      "SELECT dept.department_id, dept.department_name, dept.over_head_costs, " +
      "SUM(IFNULL(prod.product_sales, 0)) as product_sales, " +
      "SUM(IFNULL(prod.product_sales, 0)) - dept.over_head_costs as total_profit " +
      "FROM products prod " +
      "RIGHT JOIN departments dept ON prod.department_name = dept.department_name " +
      "GROUP BY " +
      "   dept.department_id, " +
      "   dept.department_name, " +
      "   dept.over_head_costs",
      function(err, res) {
        if(err) throw err;
        console.table(res);
        promptQuestions();
      }
  );
}

function addDepartment() {
  // Asking the user about the department they would like to add
  inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "What is the name of the department?"
        },
        {
          type: "input",
          name: "overhead",
          message: "What is the overhead cost of the department?",
          validate: function(val) {
            return val > 0;
          }
        }
      ])
      .then(function(answer) {
        connection.query(
            "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)",
            [answer.name, answer.overhead], function(err) {
              if (err) throw err;
              console.log("ADDED DEPARTMENT!");
              showProducts();
            }
        );
      });
}