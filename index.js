const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');
const methodOverride = require('method-override');
const { closeDelimiter } = require('ejs');

mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true })
    .then(() => {
        console.log("Mongo Connection Open!");
    })
    .catch(() => {
        console.log("Oh on Mongo error");
        console.log(err);
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))

app.get('/products', async (req, res) =>{
    const products = await Product.find({})
    console.log(products)
    res.render('products/index', { products })
})

app.get('/products/new', (req,res) =>{
    res.render('products/new')
})

app.post('/products', async (req,res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
})

app.get('/products/:id', async (req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id)
    console.log(product);
    res.render('products/show', { product })
})

app.get('/products/:id/edit',async (req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product })
})

app.put('/products/:id', async (req,res) => {
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    res.redirect(`/products/${product._id}`)
})

app.listen(3000, () =>{
    console.log("App is listening on port 3000");
})