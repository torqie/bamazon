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
  if(err) {
    console.error("Error Connection: ", err);
  }
  loadMenu();
});

function loadMenu() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    loadOptions(res);
  });
}

function loadOptions() {
inquirer
    .prompt({
      type: "list",
      name: "choice",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
      message: "What would you like to do?"
    })
    .then(function(val) {
      switch (val.choice) {
      case "View Products for Sale":
        console.table(products);
        loadMenu();
        break;
      case "View Low Inventory":
        loadLowInventory();
        break;
      case "Add to Inventory":
        addToInventory(products);
        break;
      case "Add New Product":
        promptForNewProduct(products);
        break;
      default:
        console.log("Goodbye!");
        process.exit(0);
        break;
      }
    });
}