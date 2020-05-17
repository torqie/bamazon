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
  loadProducts();
});

function loadProducts() {
  const query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products";
  connection.query(query, (err, res) => {
    if(err) throw err;
    console.log("\n\n===============================================================================================\n");
    console.table(res);
    console.log("===============================================================================================\n\n");
    questionItem(res);
  })
}

function questionItem(products) {
  inquirer.prompt({
    type: "input",
    name: "item",
    message: "What is the ID of the item you would like to purchase?"
  }).then(answer => {
    const choice = parseInt(answer.item)
    const product = checkInventory(choice, products);

    if(product) {
      questionQuantity(product)
    } else {
      console.log("\nThat item does not exist in our inventory");
      loadProducts();
    }
  })
}

function questionQuantity(product) {
 inquirer.prompt({
   type: "input",
   name: "quantity",
   message: "How many would you like to purchase?"
 }).then(answer => {
   const quantity = parseInt(answer.quantity);

   if(quantity > product.stock_quantity) {
     console.log("\nNot enough in stock\n");
     loadProducts();
   } else {
     purchase(product, quantity);
   }
 })
}

function checkInventory(choice, products) {
  for(let i = 0; i < products.length; i++) {
    const product = products[i];
    if(product.item_id === choice) {
      return product;
    }
  }
  return null;
}

function purchase(product, quantity) {
  connection.query("UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ? WHERE item_id = ?",
      [quantity, product.price * quantity, product.item_id],
      (err, res) => {
        if(err) throw err;
        console.log("\nYou purchased " + quantity + " " + product.product_name);
        loadProducts();
      });
}
