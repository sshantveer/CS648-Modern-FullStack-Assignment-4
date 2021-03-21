/* eslint linebreak-style: ["error", "windows"] */
//let db;
db.products.remove({});

const productsDB = [
    {
        id: 1,
        productName: 'BLUE Shirt',
        price: 30,
        category: 'Shirts',
        imageUrl: 'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1566927496-button-down-4-1566927485.jpg',
    },
];

db.products.insertMany(productsDB);
const count = db.products.count();

db.counters.remove({ _id: 'products' });
db.counters.insert({ _id: 'products', current: count });

db.products.createIndex({ id: 1 }, { unique: true });
db.products.createIndex({ status: 1 });
db.products.createIndex({ owner: 1 });
db.products.createIndex({ created: 1 });
