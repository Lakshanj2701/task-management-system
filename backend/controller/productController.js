import Product from "../models/product.js";

export function addProduct(req, res) {

  console.log(req.user)

  const data = req.body;
  const newProduct = new Product(data);

  newProduct
    .save()
    .then((product) => {
      res.status(201).json({ message: "Product added successfully" });

    })
    .catch((error) => {
      console.error("Error creating product:", error);
      res.status(500).json({ error: error.message });
    });
}

