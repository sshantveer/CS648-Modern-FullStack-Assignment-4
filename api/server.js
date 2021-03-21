/* eslint linebreak-style: ["error", "windows"] */

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const fs = require('fs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.DB_URL || 'mongodb://localhost/cs648_assignment4';

let db;
let aboutMessage = 'Product Inventory API v1.1';

async function allProducts() {
    const products = await db.collection('products').find({}).toArray();
    return products;
}

function setAboutMessage(_, { message }) {
    aboutMessage = message;
    return aboutMessage;
}

async function getNextSequence(name) {
    const result = await db.collection('counters').findOneAndUpdate(
        { _id: name },
        { $inc: { current: 1 } },
        { returnOriginal: false },
    );
    return result.value.current;
}

async function addProduct(_, { product }) {
    product.id = await getNextSequence('products');
    if (product.category === undefined) product.category = Category.Accessories;

    const result = await db.collection('products').insertOne(product);
    const savedProduct = await db.collection('products')
        .findOne({ _id: result.insertedId });
    return savedProduct;
}

const resolvers = {
    Query: {
        about: () => aboutMessage,
        allProducts,
    },
    Mutation: {
        setAboutMessage,
        addProduct,
    },
};

async function connectToDb() {
    const client = new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    console.log('Connected to MongoDB at', url);
    db = client.db();
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    },
});

const app = express();

app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

const port = process.env.API_SERVER_PORT || 3000;

(async function () {
    try {
        await connectToDb();
        app.listen(port, function () {
            console.log('API server started on port ', port);
        });
    } catch (err) {
        console.log('ERROR:', err);
    }
})();