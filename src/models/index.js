const User = require("./User")
const Category = require("./Category")
const Product = require("./Product")
const ProductImg = require("./ProductImg")
const Purchase = require("./Purchase")
const Cart = require("./Cart")


// Product --> categoryId
Product.belongsTo(Category)
Category.hasMany(Product)

//Cart -> userId
Cart.belongsTo(User)
User.hasMany(Cart)

//Cart -> productId
Cart.belongsTo(Product)
Product.hasMany(Cart)


//Cart -> userId
Purchase.belongsTo(User)
User.hasMany(Purchase)

//Cart -> productId
Purchase.belongsTo(Product)
Product.hasMany(Purchase)

//ProductImg -> productId
ProductImg.belongsTo(Product)
Product.hasMany(ProductImg)