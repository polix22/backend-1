const express = require("express");
const ProductManager = require("../managers/product-manager.js");
const manager = new ProductManager("./src/data/productos.json");
const router = express.Router();

//Listar todos los productos: 
//http://localhost:8080/api/products?limit=2

router.get("/", async (req, res) => {
    const limit = req.query.limit;
    try {
        const arrayProductos = await manager.getProducts();
        if (limit) {
            res.send(arrayProductos.slice(0, limit));
        } else {
            res.send(arrayProductos);
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
})

//Buscar producto por id: 

router.get("/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        const producto = await manager.getProductById(parseInt(id));

        if (!producto) {
            res.send("Producto no encontrado");
        } else {
            res.send(producto);
        }
    } catch (error) {
        res.send("Error al buscar ese id en los productos");
    }
})


//Agregar nuevo producto: 

router.post("/", async (req, res) => {
    const nuevoProducto = req.body;
    
    try {
        await manager.addProduct(nuevoProducto); 

        res.status(201).send("Producto agregado exitosamente"); 
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
})

// Actualizar producto: 
router.put("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const { title, description, price, img, code, stock, category, thumbnails } = req.body;

    // Validar campos obligatorios
    if (!title || !description || !price || !img || !code || !stock || !category) {
        return res.status(400).json({ status: "error", message: "Todos los campos son obligatorios" });
    }

    const productoActualizado = {
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        thumbnails: thumbnails || [] 
    };

    try {
        const result = await manager.updateProduct(id, productoActualizado);
        if (!result) {
            return res.status(404).send("Producto no encontrado");
        }
        res.send("Producto actualizado exitosamente");
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Eliminar producto: 
router.delete("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    try {
        const result = await manager.deleteProduct(id);
        if (!result) {
            return res.status(404).send("Producto no encontrado");
        }
        res.send("Producto eliminado exitosamente");
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

module.exports = router;