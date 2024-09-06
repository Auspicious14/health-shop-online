const mongoose = require("mongoose");
// const productModel = require("../models/products");
// const StoreModel = require("../models/store");
import StoreModel from "../models/store";
import productModel from "../models/products";

const { faker } = require("@faker-js/faker");

const dotenv = require("dotenv");
dotenv.config();
let URI = process.env.MONGODB_URL;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Generate Stores and Products
const generateStoresAndProducts = async () => {
  try {
    // Clear existing data
    // await StoreModel.deleteMany({});
    // await productModel.deleteMany({});

    // Create stores
    const stores = [];
    for (let i = 0; i < 10; i++) {
      const store = new StoreModel({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        whatsAppNumber: faker.phone.number(),
        storePhoneNumber: faker.phone.number(),
        description: faker.company.catchPhrase(),
        storeName: faker.company.name(),
        accepted: faker.datatype.boolean(),
        policy: faker.lorem.paragraph(),
        bankName: faker.finance.accountName(),
        bankAccountName: faker.finance.accountName(),
        bankAccountNumber: faker.finance.accountNumber(),
        bankCode: "",
        recipientCode: "",
        storeType: faker.commerce.department(),
        businessNumber: faker.phone.number(),
        storeAddress: faker.location.streetAddress(),
        socialMedia: [
          {
            platform: "Instagram",
            handle: faker.internet.userName(),
            url: faker.internet.url(),
          },
        ],
        images: [
          {
            uri: faker.image.url(),
            name: faker.lorem.word(),
            type: "image/jpeg",
          },
        ],
        identificationImage: [
          {
            uri: faker.image.urlLoremFlickr({
              category: "identification image",
            }),
            name: faker.lorem.word(),
            type: "image/jpeg",
          },
          {
            uri: faker.image.urlLoremFlickr({
              category: "identification image",
            }),
            name: faker.lorem.word(),
            type: "image/jpeg",
          },
        ],
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
        accountType: "storeOwner",
        password: faker.internet.password(),
      });
      await store.save();
      stores.push(store);
    }

    // Create products for each store
    for (const store of stores) {
      for (let i = 0; i < 10; i++) {
        const productName = faker.commerce.productName();
        const product = new productModel({
          name: productName,
          description: faker.commerce.productDescription(),
          storeId: store._id,
          images: [
            {
              uri: faker.image.urlLoremFlickr({
                category: getCategoryFromProductName(productName),
              }),
              name: faker.lorem.word(),
              type: "image/jpeg",
            },
            {
              uri: faker.image.urlLoremFlickr({
                category: getCategoryFromProductName(productName),
              }),
              name: faker.lorem.word(),
              type: "image/jpeg",
            },
            {
              uri: faker.image.urlLoremFlickr({
                category: getCategoryFromProductName(productName),
              }),
              name: faker.lorem.word(),
              type: "image/jpeg",
            },
          ],
          categories: faker.helpers.arrayElement([
            "Electronics",
            "Fashion",
            "Home Appliances",
          ]),
          price: faker.commerce.price(),
          quantity: faker.number.int({ min: 1, max: 100 }).toString(),
          soldout: faker.datatype.boolean(),
          availability: faker.helpers.arrayElement([
            "In Stock",
            "Out of Stock",
          ]),
          brand: faker.company.name(),
          size: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
          color: faker.color.human(),
          rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
        });
        await product.save();
      }
    }

    console.log("Stores and products seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.disconnect(); // Disconnect from MongoDB when done
  }
};

function getCategoryFromProductName(name: string) {
  const words = name.split(" ");
  return words[words.length - 1].toLowerCase();
}

// Run the seeder function
generateStoresAndProducts();
