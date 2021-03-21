/* eslint linebreak-style: ["error", "windows"] */
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL || 'mongodb+srv://som:user@cluster0.iv3su.mongodb.net/cs648_assignment4?retryWrites=true&w=majority';

function testWithCallBack(callback) {
    console.log('---- Test Call Backs ----');
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(function (err, client) {
        if (err) {
            callback(err);
            return;
        }
        console.log('Connected to MongoDB', url);

        const db = client.db();
        const collection = db.collection('products');

        const product = { id: 1, productName: 'A. Callback', price: 15, category: 'Sweater', imageUrl: 'http://google.com/' };
        collection.insertOne(product, function (err, result) {
            if (err) {
                client.close();
                callback(err);
                return;
            }
            console.log('Result of insert:\n', result.insertedId);
            collection.find({ _id: result.insertedId }).toArray(function (err, documents) {
                if (err) {
                    client.close();
                    callback(err);
                    return;
                }

                console.log('Result of find:\n', documents);
                client.close();
                callback(err);
            });
        });
    });
}

testWithCallBack(function (err) {
    if (err) {
        console.log(err);
    }
    testWithAsync();
});


async function testWithAsync() {
    console.log("---- Test Call Backs ----");
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to MongoDB', url);

        const db = client.db();
        const collection = db.collection('products');

        const product = { id: 2, productName: 'B. Callback', price: 25, category: 'Shirt', imageUrl: 'http://google.com/' };
        const result = await collection.insertOne(product);
        console.log('Result of insert:\n', result.insertedId);

        const documents = await collection.find({ _id: result.insertedId }).toArray();
        console.log('Result of find \n', documents);
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}
