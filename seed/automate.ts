const mongoose = require("mongoose");
import StoreModel from "../models/store";
import productModel from "../models/products";
import categoryModel from "../models/category";
import { categoryMappings } from "./sample";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

const { faker } = require("@faker-js/faker");

const dotenv = require("dotenv");
dotenv.config();
let URI = process.env.MONGODB_URL;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const generateProductData = (name: string, category: any) => {
  let categoryMatch = categoryMappings[category] || null;

  if (categoryMatch) {
    const randomDescription = faker.helpers.arrayElement(
      categoryMatch.description
    );

    return {
      description: randomDescription,
      images: [
        {
          uri: faker.image.urlLoremFlickr({
            category: categoryMatch.imageCategory.split(" ")[0],
            width: 320,
            height: 240,
          }),
          name,
          type: "image/jpeg",
        },
        {
          uri: faker.image.urlLoremFlickr({
            category: categoryMatch.imageCategory.split(" ")[0],
            width: 320,
            height: 240,
          }),
          name,
          type: "image/jpeg",
        },
      ],
    };
  } else {
    // Fallback if no category match is found
    return {
      description: "This is a high-quality product suitable for various needs.",
      images: [
        {
          uri: faker.image.urlLoremFlickr({
            category: "products",
            width: 320,
            height: 240,
          }),
          name,
          type: "image/jpeg",
        },
        {
          uri: faker.image.urlLoremFlickr({
            category: "products",
            width: 320,
            height: 240,
          }),
          name,
          type: "image/jpeg",
        },
      ],
    };
  }
};

const generateCategoriesStoresAndProducts = async () => {
  try {
    // await categoryModel.deleteMany({});
    await StoreModel.deleteMany({});
    await productModel.deleteMany({});

    // const categoryDocuments = [];
    // for (const category of categories) {
    //   const slug = slugify(category.name, { lower: true, strict: true });
    //   const categoryDoc = new categoryModel({ ...category, slug });
    //   await categoryDoc.save();
    //   categoryDocuments.push(categoryDoc);
    // }

    // console.log("Categories seeded successfully!");

    const categories = await categoryModel.find();

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
              category: "identification",
              width: 320,
              height: 240,
            }),
            name: faker.lorem.word(),
            type: "image/jpeg",
          },
          {
            uri: faker.image.urlLoremFlickr({
              category: "identification",
              width: 320,
              height: 240,
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

    for (const store of stores) {
      for (let i = 0; i < 10; i++) {
        const productName = faker.commerce.productName();

        const productCategory = faker.helpers.arrayElement(
          categories.map((cat) => cat.name)
        );

        const { description, images } = generateProductData(
          productName,
          productCategory
        );

        const productCategories = await categoryModel.find({
          name: productCategory,
        });

        const product = new productModel({
          name: productName,
          description,
          storeId: store._id,
          categories: productCategories.map((cat) => cat._id),
          images,
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
          slug: await generateUniqueSlug(productName),
        });
        await product.save();
      }
    }

    console.log("Stores and products seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.disconnect();
  }
};

generateCategoriesStoresAndProducts();

const generateUniqueSlug = async (name: string) => {
  let slug = slugify(name, { lower: true, strict: true });
  slug = `${slug}-${uuidv4()}`;
  return slug;
};

const addImageToCategories = async () => {
  try {
    const categories = await categoryModel.find();

    for (const category of categories) {
      const images = [
        {
          uri: faker.image.urlLoremFlickr({
            category: category.name?.split(" ")[0].toLowerCase(),
            width: 320,
            height: 240,
          }),
          name: category.name,
          type: "image/jpeg",
        },
        {
          uri: faker.image.urlLoremFlickr({
            category: category.name?.split(" ")[0].toLowerCase(),
            width: 320,
            height: 240,
          }),
          name: category.name,
          type: "image/jpeg",
        },
      ];
      await categoryModel.findByIdAndUpdate(
        category._id,
        {
          $set: { images },
        },
        { new: true }
      );
    }
    console.log("Images added to categories successfully!");
  } catch (error) {
    console.log(error, "error");
  }
};

// addImageToCategories();
