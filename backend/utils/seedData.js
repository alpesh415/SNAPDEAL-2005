const categoryModel = require("../models/Category");
const productModel = require("../models/Product");

const seedProducts = require("../seedProducts.json");

// Creates any missing categories/products from seedProducts.json.
// Existing products (matched by name) are left untouched.
const seedAll = async () => {

    const categoryNames = [...new Set(seedProducts.map(p => p.categoryName))];

    const categoryMap = {};

    for (const name of categoryNames) {

        let category = await categoryModel.findOne({ name });

        if (!category) {
            category = await categoryModel.create({ name });
            console.log("Category created:", name);
        }

        categoryMap[name] = category._id;

    }

    let created = 0;
    let skipped = 0;

    for (const p of seedProducts) {

        const exists = await productModel.findOne({ name: p.name });

        if (exists) {
            skipped++;
            continue;
        }

        await productModel.create({
            name: p.name,
            description: p.description,
            price: p.price,
            discountPrice: p.discountPrice,
            image: p.image,
            category: categoryMap[p.categoryName],
            stock: p.stock,
            brand: p.brand,
            rating: p.rating,
            reviews: p.reviews
        });

        created++;

    }

    return { created, skipped };

};

// Used when the server starts: only seeds if the products collection is empty,
// so products deleted later from the Admin Dashboard are not re-created.
const seedIfEmpty = async () => {

    const count = await productModel.countDocuments();

    if (count > 0) {
        console.log(`Products in database: ${count}`);
        return;
    }

    console.log("No products found in database - adding starter products...");

    const { created } = await seedAll();

    console.log(`Starter products added: ${created}`);

};

module.exports = { seedAll, seedIfEmpty };
