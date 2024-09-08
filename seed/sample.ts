export interface ICategoryMapping {
  description: string[];
  keywords: string[];
  imageCategory: string;
}

export const categoryMappings: Record<string, ICategoryMapping> = {
  Computing: {
    description: [
      "Powerful and efficient computing device for all your professional needs.",
      "The latest in computing technology, designed for performance.",
      "Ideal for gamers, programmers, and professionals.",
    ],
    keywords: ["Laptop", "Desktop", "Monitor", "Keyboard", "Mouse"],
    imageCategory: "computing",
  },
  Electronics: {
    description: [
      "State-of-the-art electronic device that enhances your daily life.",
      "Packed with the latest technology and designed for convenience.",
      "Perfect for tech enthusiasts seeking top-tier performance.",
    ],
    keywords: ["TV", "Smartwatch", "Speaker", "Tablet"],
    imageCategory: "electronics",
  },
  "Home Appliances": {
    description: [
      "Energy-efficient appliance perfect for modern homes.",
      "Reliable and built to make household chores easier.",
      "A must-have appliance for every household.",
    ],
    keywords: ["Washing Machine", "Refrigerator", "Microwave"],
    imageCategory: "home-appliance",
  },
  "Wearable Technology": {
    description: [
      "Innovative wearable tech designed for convenience and health tracking.",
      "Sleek, modern, and loaded with advanced features.",
      "Perfect for tracking your fitness and staying connected.",
    ],
    keywords: ["Smartwatch", "Fitness Tracker"],
    imageCategory: "wearable-tech",
  },
  Sports: {
    description: [
      "High-performance gear designed for athletes and sports enthusiasts.",
      "Built for endurance and perfect for any sporting activity.",
      "Ideal for both professionals and hobbyists.",
    ],
    keywords: ["Football", "Basketball", "Tennis Racket", "Gym Equipment"],
    imageCategory: "sports",
  },
  "Musical Instruments": {
    description: [
      "Premium instrument perfect for musicians of all skill levels.",
      "Designed to deliver exceptional sound quality and durability.",
      "Ideal for live performances and studio recordings.",
    ],
    keywords: ["Guitar", "Piano", "Drums", "Violin"],
    imageCategory: "musical-instruments",
  },
  "Audio Equipment": {
    description: [
      "High-quality audio device designed for superior sound experience.",
      "Perfect for audiophiles who demand the best in audio technology.",
      "Crystal-clear sound and advanced features.",
    ],
    keywords: ["Headphones", "Speakers", "Microphone", "Earbuds"],
    imageCategory: "audio-equipment",
  },
  "Phones & Tablets": {
    description: [
      "Latest smartphone with cutting-edge features and performance.",
      "Sleek, powerful, and perfect for multitasking on the go.",
      "Stay connected with this top-tier device.",
    ],
    keywords: ["Smartphone", "Tablet", "Mobile Accessories"],
    imageCategory: "phones-tablets",
  },
  Fashion: {
    description: [
      "Stylish and trendy outfit designed for the modern individual.",
      "Comfortable yet fashionable for any occasion.",
      "High-quality material that combines durability with style.",
    ],
    keywords: ["Shirt", "Shoes", "Jacket", "Dress"],
    imageCategory: "fashion",
  },
  "Home & Office": {
    description: [
      "Stylish and functional furniture to complete your home or office space.",
      "Designed for comfort and efficiency in any setting.",
      "A must-have for creating a productive work environment.",
    ],
    keywords: ["Desk", "Chair", "Couch", "Bookshelf"],
    imageCategory: "home-office",
  },
  Automobile: {
    description: [
      "High-performance vehicle part designed to enhance your driving experience.",
      "Reliable and durable auto parts for any vehicle type.",
      "Built to provide safety and efficiency on the road.",
    ],
    keywords: ["Car", "Motorcycle", "Tires", "Engine Parts"],
    imageCategory: "automobile",
  },
  Food: {
    description: [
      "Delicious and fresh food items sourced from quality ingredients.",
      "Perfect for a healthy meal or a tasty snack.",
      "Packed with nutrients and flavor for every occasion.",
    ],
    keywords: ["Snacks", "Drinks", "Fruits", "Vegetables"],
    imageCategory: "food",
  },
  Kids: {
    description: [
      "Fun and educational toy designed for children's development.",
      "Safe, durable, and perfect for kids of all ages.",
      "Ideal for learning and playtime.",
    ],
    keywords: ["Toys", "Clothes", "Books", "Games"],
    imageCategory: "kids",
  },
  Men: {
    description: [
      "Fashionable and comfortable apparel designed for men.",
      "Perfect for any occasion, whether casual or formal.",
      "High-quality materials ensure durability and style.",
    ],
    keywords: ["Suit", "T-shirt", "Jeans", "Shoes"],
    imageCategory: "men-fashion",
  },
  Women: {
    description: [
      "Elegant and trendy outfit perfect for the modern woman.",
      "Combines comfort with style for any event.",
      "Made from high-quality fabrics for lasting wear.",
    ],
    keywords: ["Dress", "Blouse", "Heels", "Handbag"],
    imageCategory: "women-fashion",
  },
  "Health & Beauty": {
    description: [
      "Top-quality beauty product designed for flawless skin.",
      "Packed with natural ingredients to enhance your health and appearance.",
      "Perfect for your daily beauty routine.",
    ],
    keywords: ["Skincare", "Makeup", "Haircare", "Vitamins"],
    imageCategory: "health-beauty",
  },
  "Industrial & Scientific": {
    description: [
      "Advanced industrial tool built for precision and durability.",
      "Perfect for laboratory use and heavy-duty industrial tasks.",
      "Designed for professionals who demand the best.",
    ],
    keywords: ["Microscope", "Measuring Tools", "Heavy Machinery"],
    imageCategory: "industrial-scientific",
  },
  Gaming: {
    description: [
      "Top-tier gaming gear for immersive experiences.",
      "Designed for gamers seeking performance and reliability.",
      "Elevate your gaming experience with the latest tech.",
    ],
    keywords: ["Gaming Laptop", "Console", "Controller"],
    imageCategory: "gaming",
  },
  Cameras: {
    description: [
      "High-resolution camera perfect for capturing stunning photos.",
      "Ideal for both amateur photographers and professionals.",
      "Advanced camera features designed to capture life's moments.",
    ],
    keywords: ["Camera", "Lens", "Tripod"],
    imageCategory: "camera",
  },
};

export const categories = [
  { name: "Computing" },
  { name: "Electronics" },
  { name: "Home Appliances" },
  { name: "Wearable Technology" },
  { name: "Sports" },
  { name: "Musical Instruments" },
  { name: "Audio Equipment" },
  { name: "Phones & Tablets" },
  { name: "Fashion" },
  { name: "Home & Office" },
  { name: "Automobile" },
  { name: "Food" },
  { name: "Kids" },
  { name: "Men" },
  { name: "Women" },
  { name: "Health & Beauty" },
  { name: "Industrial & Scientific" },
  { name: "Gaming" },
  { name: "Cameras" },
];
