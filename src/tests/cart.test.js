require('../models')
const request = require("supertest")
const app = require('../app')
const Category = require('../models/Category')
const Product = require('../models/Product')



let TOKEN
let product
let category
const BASE_URL_LOGIN = '/api/v1/users/login'
const BASE_URL = '/api/v1/cart'

let userId
let cart
let cartId


beforeAll(async () => {
    const hits = {
        email: "juan@gmail.com",
        password: "juan1234"
    }

    const res = await request(app)
      .post(BASE_URL_LOGIN)
      .send(hits)
    
    TOKEN = res.body.token
    //console.log(TOKEN);
    userId = res.body.user.id
    //console.log(res.body);

    category = await Category.create({name:'Ropa para dama'})

    product = await Product.create({
        title: "Smart Tv",
        description: "Have 32 inches",
        price: 9.999,
        categoryId: category.id
    })
    
    cart = {
        userId: userId,
        productId: product.id,
        quantity: 3
    }
})

afterAll(async () => {
    await Category.destroy({where: {id: category.id}})
    await Product.destroy({where: {id: product.id}})
})

test("POST -> 'BASE_URL', should return statusCode 201 and res.body.quantity === cart.quantity", async () => {
    const res = await request(app)
       .post(BASE_URL)
       .send(cart)
       .set('Authorization', `Bearer ${TOKEN}`)

    cartId = res.body.id
    //console.log(res.body);
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(cart.quantity)
    expect(res.body.productId).toBe(product.id)
    expect(res.body.userId).toBe(userId)
})

test("GET -> 'BASE_URL', should return statusCode 200, and res.body.length === 1", async () => {
    const res = await request(app)
      .get(BASE_URL)
      .set('Authorization', `Bearer ${TOKEN}`)
      //console.log(res.body);

      expect(res.statusCode).toBe(200)
      expect(res.body).toBeDefined()
      expect(res.body).toHaveLength(1)

      expect(res.body[0].product.id).toBeDefined()
      expect(res.body[0].product.categoryId).toBeDefined()
      expect(res.body[0].product.id).toBe(product.id)
      expect(res.body[0].product.categoryId).toBe(product.categoryId)
})

test("GET -> 'BASE_URL/:id', should return statusCode 200, and res.body.quantity === cart.quantity", async () => {
    const res = await request(app)
      .get(`${BASE_URL}/${cartId}`)
      .set('Authorization', `Bearer ${TOKEN}`)
      //console.log(res.body);

      expect(res.statusCode).toBe(200)
      expect(res.body).toBeDefined()

      expect(res.body.product.id).toBeDefined()
      expect(res.body.product.id).toBe(product.id)

      expect(res.body.product.categoryId).toBeDefined()
      expect(res.body.product.categoryId).toBe(product.categoryId)
})

test("PUT -> 'BASE_URL/:id', should return statusCode 200 and res.body.quantity === updateCart.quantity", async () => {
    const updateCart = {
        quantity: 4
    }
    
    const res = await request(app)
      .put(`${BASE_URL}/${cartId}`)
      .send(updateCart)
      .set('Authorization', `Bearer ${TOKEN}`)
    //console.log(res.body);
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(updateCart.quantity)


})

test("DELETE -> 'BASE_URL/:id', should return statusCode  204", async () => {
    const res = await request(app)
      .delete(`${BASE_URL}/${cartId}`)
      .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(204)
})
