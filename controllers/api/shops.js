const Shop = require('../../models/shop')
const Item = require('../../models/item')
const User = require('../../models/user')
const Category = require('../../models/category')
const cloudinary = require('../../config/cloudinary')
const category = require('../../models/category')
const shop = require('../../models/shop')
/* -----shop controllers-----*/

// Create a new shop
exports.createShop = async (req, res) => {
    try {
        // Create a new shop in the database
        const newShop = await Shop.create({
            seller: req.user._id,
            name: req.body.name,
            heroImage: req.body.heroImage,
            rating: null,
            description: req.body.description
        })

        // Update the user document with the new shop ID
        const user = await User.findOneAndUpdate({ _id: req.user._id }, { shop: newShop._id }, { new: true })
        console.log(user)

        // Respond with user and new shop data
        res.status(200).json({ user, newShop })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Update a shop
exports.updateShop = async (req, res) => {
    try {
        // Find and update the shop with the provided ID
        const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true })

        // Check if the shop was not found
        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' })
        }

        // Respond with the updated shop
        res.status(200).json(shop)
    } catch (error) {
        res.status(400).json({ error: 'Could not update shop' })
    }
}

// Get a single shop by id
exports.getShop = async (req, res) => {
    try {
        // Find and populate the shop with associated products and categories
        const shop = await Shop.findById(req.params.id)
            .populate({
                path: 'products',
                populate: {
                    path: 'category'
                }
            })
            .exec()
        
        // Check if the shop was not found
        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' })
        }

        // Respond with the shop data
        res.status(200).json(shop)
    } catch (error) {
        res.status(400).json({ error: 'Could not find shop' })
    }
}


// Delete a shop
exports.deleteShop = async (req, res) => {
    try {
        // Find and delete the shop iwth the provided ID
        const shop = await Shop.findByIdAndDelete(req.params.id)

        // Check if the shop was not found
        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' })
        }

        // Respond with a success message
        res.json({ message: 'Shop Deleted' })
    } catch (error) {
        res.status(400).json({ error: 'Could not Delete Shop' })
    }
}


/* -----shop-item controllers-----*/
// Add an item to a shop
exports.addItem = async (req, res) => {
    try {
        // Find the shop by its ID
        const shop = await Shop.findById(req.params.id)

        // Check if the shop was not found
        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' })
        }

        // Find the cateogry by name 
        const category = await Category.findOne({ name: req.body.category })
        console.log('category = ' + category)

        // Create a new item in the database
        const item = await Item.create({
            name: req.body.name,
            imageUrl: req.body.imageUrl,
            publicId: req.body.publicId,
            price: req.body.price,
            description: req.body.description,
            category: category._id,
            shop: shop._id
        })

        // Add the created item to the shop's products
        shop.products.addToSet(item)
        await shop.save()

        // Respond with the created item 
        res.status(200).json(item)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Update item to a shop
exports.updateItem = async (req, res) => {
    try {
        // Find the shop by its ID
        const shop = await Shop.findById(req.params.ShopId)

        // Check if the shop was not found
        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' })
        }

        // Get the item ID from request parameters
        const itemId = req.params.itemId
        // Find the index of the updated item 
        const updatedItemIndex = shop.products.findIndex(item => item._id.toString() === itemId)

        // Check if the item was not found
        if (updatedItemIndex === -1) {
            return res.status(404).json({ error: 'Item not found' })
        }

        // Update the item in teh shop's products array
        const updatedItem = req.body
        shop.products[updatedItemIndex] = { ...shop.products[updatedItemIndex], ...updatedItem }
        await shop.save()

        // Respond with the updated shop
        res.json(shop)
    } catch (error) {
        res.status(400).json({ error: 'Could not update item' })
    }
}

// Delete item from shop
exports.deleteItem = async (req, res) => {
    try {
        // Find the shop by its ID
        const shop = await Shop.findById(req.params.id)

         // Check if the shop was not found
        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' })
        }

        // Removes unwanted items from the shop's array
        shop.products.pull({ _id: req.params.itemid })
        await shop.save()

        // Find and delete the item by its ID
        const item = await Item.findOne({ _id: req.params.itemid })
        await item.deleteOne()

        // Respond with a success message
        res.json({ message: 'Item deleted from shop' })
    } catch (error) {
        res.status(400).json({ error: 'Could not delete item' })
    }
}
