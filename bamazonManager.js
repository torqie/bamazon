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

function loadOptions(products) {
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

// Query the DB for low inventory products
function loadLowInventory() {
  // Selects all of the products that have a quantity of 5 or less
  connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res) {
    if (err) throw err;
    // Draw the table in the terminal using the response, load the manager menu
    console.table(res);
    loadMenu();
  });
}

// Prompt the manager for a product to replenish
function addToInventory(inventory) {
  console.table(inventory);
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "What is the ID of the item you would you like add to?",
        validate: function(val) {
          return !isNaN(val);
        }
      }
    ])
    .then(function(val) {
      var choice = parseInt(val.choice);
      var product = checkInventory(choice, inventory);

      // If a product can be found with the chose id...
      if (product) {
        // Pass the chosen product to promptCustomerForQuantity
        promptForQuantity(product);
      }
      else {
        // Otherwise let the user know and re-load the manager menu
        console.log("\nThat item is not in the inventory.");
        loadManagerMenu();
      }
    });
}

// Ask for the quantity that should be added to the chosen product
function promptForQuantity(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like to add?",
        validate: function(val) {
          return val > 0;
        }
      }
    ])
    .then(function(val) {
      var quantity = parseInt(val.quantity);
      addQuantity(product, quantity);
    });
}

// Updates quantity of selected product
function addQuantity(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
    [product.stock_quantity + quantity, product.item_id],
    function(err, res) {
      // Let the user know the purchase was successful, re-run loadProducts
      console.log("\nSuccessfully added " + quantity + " " + product.product_name + "'s!\n");
      loadMenu();
    }
  );
}

// Asks the manager details about the new product
// Adds new product to the db when complete
function promptForNewProduct(products) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "product_name",
        message: "What is the name of the product you would like to add?"
      },
      {
        type: "list",
        name: "department_name",
        choices: getDepartments(products),
        message: "Which department does this product fall into?"
      },
      {
        type: "input",
        name: "price",
        message: "How much does it cost?",
        validate: function(val) {
          return val > 0;
        }
      },
      {
        type: "input",
        name: "quantity",
        message: "How many do we have?",
        validate: function(val) {
          return !isNaN(val);
        }
      }
    ])
    .then(addNewProduct);
}

// Adds a new product to the database, loads the manager menu
function addNewProduct(product) {
  connection.query(
    "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
    [product.product_name, product.department_name, product.price, product.quantity],
    function(err, res) {
      if (err) throw err;
      console.log(product.product_name + " ADDED TO BAMAZON STORE!\n");
      loadMenu();
    }
  );
}

// Take an array of product objects, return an array of their unique departments
function getDepartments(products) {
  var departments = [];
  for (var i = 0; i < products.length; i++) {
    if (departments.indexOf(products[i].department_name) === -1) {
      departments.push(products[i].department_name);
    }
  }
  return departments;
}

// Check to see if the product the user chose exists in the inventory
function checkInventory(choice, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choice) {
      // If a matching product is found, return the product
      return inventory[i];
    }
  }
  // Otherwise return null
  return null;
}
