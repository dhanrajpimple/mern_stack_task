const product = require("../model/productSchema")

const createProduct = async(req, res)=>{
    const {name, price, description, quantity, image,category} = req.body
    try {
        const newProduct = await product.create({
            name,
            price,
            description,
            quantity,
            image,
            category
        })
        newProduct.save()
       return res.status(200).json({message:"Product created successfully", newProduct})
    } catch (error) {
       return res.status(500).json({message:"Product creation failed", error})
    }
}
const deleteProduct = async(req, res)=>{
   try {
     const {id} = req.params
     const deleteProduct = await product.findByIdAndDelete(id)
     if(!deleteProduct){
         return res.status(404).json({message:"Product not found"})
     }
     return res.status(200).json({message:"Product deleted successfully"})
   } catch (error) {
    return res.status(500).json({message:"Product deletion failed", error})
   }
}   

const updateProduct = async(req, res)=>{
    try {
        const {id} = req.params
        const {name, price, description, quantity, image, category} = req.body
        const updateProduct = await product.findByIdAndUpdate(id, {
            name,
            price,
            description,
            quantity,
            image,
            category
        }, {new:true})
        if(!updateProduct){
            return res.status(404).json({message:"Product not found"})
        }
        return res.status(200).json({message:"Product updated successfully", updateProduct})
    }
    catch (error) {
        return res.status(500).json({message:"Product update failed", error})
    }
}

const getAllProducts = async (req, res) => {
    try {
        let { page, limit, sortBy, order, minprice, maxprice, category, available } = req.query;

      
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        order = order === 'desc' ? -1 : 1;

        const filter = {};

       
        if (minprice || maxprice) {
            filter.price = {};
            if (minprice) filter.price.$gte = parseFloat(minprice);
            if (maxprice) filter.price.$lte = parseFloat(maxprice);
        }

      
    if (category) {
        const categories = category.split(',').map(cat => cat.trim());
        filter.category = categories.length > 1 ? { $in: categories } : categories[0];
    }

        if (available !== undefined) {
            filter.quantity = available ? { $gt: 0 } : { $gte: 0 }; // Ensure it's boolean
        }

        
        const sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = order;
        } else {
            sortOptions.createdAt = -1; 
        }

        const products = await product
            .find(filter)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalProducts = await product.countDocuments(filter);

        return res.status(200).json({
            message: "Products fetched successfully",
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch products", error });
    }
};


module.exports = { getAllProducts, updateProduct, deleteProduct, createProduct }