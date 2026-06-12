const productModel = require('../models/product.model');

async function createProduct(req, res) {
    const { name } = req.body;

    const existingProduct = await productModel.findOne({
        name: {
            $regex: `^${name.trim()}$`,
            $options: "i"
        }
    });

    if (existingProduct) {
        return res.status(409).json({
            message: "Product already exists"
        });
    }

    const product = await productModel.create({ name });

    res.status(201).json({ message: 'Product created successfully', product });
}

async function getProducts(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || '';


    const skip = (page - 1) * limit;

   const filter = {};

    if (search) {
        filter.name = {
            $regex: search,
            $options: 'i'
        };
    }

    const products = await productModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const totalProducts = await productModel.countDocuments(filter);

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
        data: products,
        currentPage: page,
        totalPages,
        totalProducts,
    });
}

async function updateProduct(req, res) {

    const { id } = req.params;

    const product = await productModel.findByIdAndUpdate(
        id,
        req.body,
        {
            returnDocument: 'after',
            runValidators: true,
        }
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.status(200).json({ message: 'Product updated successfully', product });

}


module.exports = {
    createProduct,
    getProducts,
    updateProduct,
}