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