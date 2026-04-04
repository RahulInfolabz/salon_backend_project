const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = "salon_platform";

async function seed() {
  const client = await MongoClient.connect(MONGO_URI);
  const db = client.db(DB_NAME);

  console.log("🌱 Starting seed...");

  // ── Clear existing data ───────────────────────────────────────────────────
  await db.collection("users").deleteMany({});
  await db.collection("service_categories").deleteMany({});
  await db.collection("service_subcategories").deleteMany({});
  await db.collection("services").deleteMany({});
  await db.collection("bookings").deleteMany({});
  await db.collection("payments").deleteMany({});
  await db.collection("feedbacks").deleteMany({});
  await db.collection("general_inquiries").deleteMany({});

  console.log("🗑️  Cleared existing collections");

  // ── Users ─────────────────────────────────────────────────────────────────
  const usersResult = await db.collection("users").insertMany([
    {
      full_name: "Salon Admin",
      email: "admin@salon.com",
      password: "Admin@123",
      mobile_no: "9900000001",
      city: "Ahmedabad",
      profile_image: "",
      role: "Admin",
      status: "Active",
      created_at: new Date(),
    },
    {
      full_name: "Aarav Shah",
      email: "aarav@gmail.com",
      password: "Aarav@123",
      mobile_no: "9900000002",
      city: "Ahmedabad",
      profile_image: "",
      role: "User",
      status: "Active",
      created_at: new Date(),
    },
    {
      full_name: "Nisha Patel",
      email: "nisha@gmail.com",
      password: "Nisha@123",
      mobile_no: "9900000003",
      city: "Surat",
      profile_image: "",
      role: "User",
      status: "Active",
      created_at: new Date(),
    },
  ]);

  const userIds = Object.values(usersResult.insertedIds);
  console.log("✅ Users seeded");

  // ── Service Categories ────────────────────────────────────────────────────
  const categoriesResult = await db.collection("service_categories").insertMany([
    {
      category_name: "Hair",
      category_description: "Complete hair care services including cuts, coloring, spa, and treatments for all hair types.",
      category_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_name: "Skin",
      category_description: "Advanced skincare services including facials, cleanup, de-tan, and bleach for glowing skin.",
      category_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_name: "Nails",
      category_description: "Professional nail care including manicure, pedicure, and nail extensions.",
      category_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_name: "Makeup",
      category_description: "Professional makeup services for parties, events, and everyday looks.",
      category_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_name: "Grooming",
      category_description: "Men's grooming services including beard styling, shaving, and hair grooming.",
      category_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_name: "Body Spa",
      category_description: "Relaxing full body spa treatments including massages and body wraps.",
      category_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_name: "Bridal Services",
      category_description: "Complete bridal packages for the perfect wedding day look.",
      category_image: "",
      status: "Active",
      created_at: new Date(),
    },
  ]);

  const categoryIds = Object.values(categoriesResult.insertedIds);
  console.log("✅ Service Categories seeded");

  // ── Service SubCategories ─────────────────────────────────────────────────
  const subCategoriesResult = await db.collection("service_subcategories").insertMany([
    // Hair subcategories
    {
      category_id: categoryIds[0],
      subcategory_name: "Haircut",
      subcategory_description: "Precision haircuts tailored to your face shape and style preferences.",
      subcategory_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[0],
      subcategory_name: "Hair Color",
      subcategory_description: "Full color, highlights, balayage, and creative coloring services.",
      subcategory_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[0],
      subcategory_name: "Hair Spa",
      subcategory_description: "Deep conditioning and nourishing hair spa treatments.",
      subcategory_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[0],
      subcategory_name: "Hair Treatment",
      subcategory_description: "Targeted treatments for damaged, frizzy, or thinning hair.",
      subcategory_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[0],
      subcategory_name: "Straightening / Smoothening",
      subcategory_description: "Professional hair straightening and smoothening treatments.",
      subcategory_image: "",
      status: "Active",
      created_at: new Date(),
    },
    // Skin subcategories
    {
      category_id: categoryIds[1],
      subcategory_name: "Facial",
      subcategory_description: "Deep cleansing and rejuvenating facial treatments.",
      subcategory_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[1],
      subcategory_name: "Cleanup",
      subcategory_description: "Quick skin cleanup for fresh and glowing skin.",
      subcategory_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[1],
      subcategory_name: "De-tan",
      subcategory_description: "Effective de-tanning treatments to restore natural skin tone.",
      subcategory_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[1],
      subcategory_name: "Bleach",
      subcategory_description: "Skin lightening bleach treatments for face and body.",
      subcategory_image: "",
      status: "Active",
      created_at: new Date(),
    },
    // Nails subcategories
    {
      category_id: categoryIds[2],
      subcategory_name: "Manicure",
      subcategory_description: "Complete hand and nail care with shaping, cuticle care, and polish.",
      subcategory_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[2],
      subcategory_name: "Pedicure",
      subcategory_description: "Complete foot and nail care with scrubbing, massage, and polish.",
      subcategory_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[2],
      subcategory_name: "Nail Extensions",
      subcategory_description: "Artificial nail extensions for length and style enhancement.",
      subcategory_image: "",
      status: "Active",
      created_at: new Date(),
    },
  ]);

  const subCategoryIds = Object.values(subCategoriesResult.insertedIds);
  console.log("✅ Service SubCategories seeded");

  // ── Services ──────────────────────────────────────────────────────────────
  const servicesResult = await db.collection("services").insertMany([
    // Hair → Haircut
    {
      category_id: categoryIds[0],
      subcategory_id: subCategoryIds[0],
      service_name: "Men Haircut",
      service_description: "Classic and modern men's haircut with wash and blow-dry finish.",
      price: 299.0,
      duration_mins: 30,
      service_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[0],
      subcategory_id: subCategoryIds[0],
      service_name: "Women Haircut",
      service_description: "Precision women's haircut with styling as per your preference.",
      price: 499.0,
      duration_mins: 45,
      service_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[0],
      subcategory_id: subCategoryIds[0],
      service_name: "Kids Haircut",
      service_description: "Gentle and fun haircuts for kids up to 12 years of age.",
      price: 199.0,
      duration_mins: 20,
      service_image: "",
      status: "Active",
      created_at: new Date(),
    },
    // Skin → Facial
    {
      category_id: categoryIds[1],
      subcategory_id: subCategoryIds[5],
      service_name: "Gold Facial",
      service_description: "Luxurious gold facial for deep nourishment and anti-aging benefits.",
      price: 1499.0,
      duration_mins: 60,
      service_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[1],
      subcategory_id: subCategoryIds[5],
      service_name: "Fruit Facial",
      service_description: "Natural fruit extracts facial for brightening and hydration.",
      price: 799.0,
      duration_mins: 45,
      service_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[1],
      subcategory_id: subCategoryIds[5],
      service_name: "Hydra Facial",
      service_description: "Advanced hydra facial for deep cleansing, exfoliation, and hydration.",
      price: 2499.0,
      duration_mins: 75,
      service_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[1],
      subcategory_id: subCategoryIds[5],
      service_name: "Anti-Aging Facial",
      service_description: "Specialized anti-aging facial to reduce fine lines and wrinkles.",
      price: 1999.0,
      duration_mins: 60,
      service_image: "",
      status: "Active",
      created_at: new Date(),
    },
    // Nails → Nail Extensions
    {
      category_id: categoryIds[2],
      subcategory_id: subCategoryIds[11],
      service_name: "Gel Nail Extension",
      service_description: "Durable and natural-looking gel nail extensions with custom shape and length.",
      price: 1299.0,
      duration_mins: 90,
      service_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[2],
      subcategory_id: subCategoryIds[11],
      service_name: "Acrylic Nail Extension",
      service_description: "Strong and versatile acrylic nail extensions for long-lasting results.",
      price: 999.0,
      duration_mins: 75,
      service_image: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[2],
      subcategory_id: subCategoryIds[11],
      service_name: "Nail Extension Refill",
      service_description: "Maintenance refill for existing nail extensions to keep them looking fresh.",
      price: 599.0,
      duration_mins: 45,
      service_image: "",
      status: "Active",
      created_at: new Date(),
    },
  ]);

  const serviceIds = Object.values(servicesResult.insertedIds);
  console.log("✅ Services seeded");

  // ── Bookings ──────────────────────────────────────────────────────────────
  const bookingsResult = await db.collection("bookings").insertMany([
    {
      user_id: userIds[1], // Aarav
      service_id: serviceIds[0], // Men Haircut
      booking_date: new Date("2025-12-10"),
      time_slot: "10:00 AM",
      booking_status: "Approved",
      payment_status: "Paid",
      total_amount: 299.0,
      notes: "Please trim sides short",
      created_at: new Date("2025-12-08"),
      updated_at: new Date("2025-12-08"),
    },
    {
      user_id: userIds[2], // Nisha
      service_id: serviceIds[5], // Hydra Facial
      booking_date: new Date("2025-12-12"),
      time_slot: "02:00 PM",
      booking_status: "Approved",
      payment_status: "Paid",
      total_amount: 2499.0,
      notes: "Sensitive skin, please use gentle products",
      created_at: new Date("2025-12-09"),
      updated_at: new Date("2025-12-09"),
    },
    {
      user_id: userIds[1], // Aarav
      service_id: serviceIds[3], // Gold Facial
      booking_date: new Date("2025-12-20"),
      time_slot: "",
      booking_status: "Pending",
      payment_status: "Pending",
      total_amount: 1499.0,
      notes: "",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  const bookingIds = Object.values(bookingsResult.insertedIds);
  console.log("✅ Bookings seeded");

  // ── Payments ──────────────────────────────────────────────────────────────
  await db.collection("payments").insertMany([
    {
      user_id: userIds[1],
      booking_id: bookingIds[0],
      razorpay_order_id: "order_demo_001",
      razorpay_payment_id: "pay_demo_001",
      razorpay_signature: "sig_demo_001",
      amount: 299.0,
      payment_status: "Paid",
      payment_date: new Date("2025-12-08"),
    },
    {
      user_id: userIds[2],
      booking_id: bookingIds[1],
      razorpay_order_id: "order_demo_002",
      razorpay_payment_id: "pay_demo_002",
      razorpay_signature: "sig_demo_002",
      amount: 2499.0,
      payment_status: "Paid",
      payment_date: new Date("2025-12-09"),
    },
  ]);

  console.log("✅ Payments seeded");

  // ── Feedbacks ─────────────────────────────────────────────────────────────
  await db.collection("feedbacks").insertMany([
    {
      user_id: userIds[1],
      service_id: serviceIds[0],
      feedback_message: "Excellent haircut! The stylist was very professional and understood exactly what I wanted.",
      rating: 5,
      feedback_date: new Date("2025-12-10"),
    },
    {
      user_id: userIds[2],
      service_id: serviceIds[5],
      feedback_message: "The Hydra Facial was amazing! My skin feels so fresh and hydrated. Highly recommend.",
      rating: 5,
      feedback_date: new Date("2025-12-12"),
    },
    {
      user_id: userIds[1],
      service_id: serviceIds[3],
      feedback_message: "Gold facial was very relaxing and my skin looks visibly brighter. Will book again.",
      rating: 4,
      feedback_date: new Date("2025-12-15"),
    },
  ]);

  console.log("✅ Feedbacks seeded");

  // ── General Inquiries ─────────────────────────────────────────────────────
  await db.collection("general_inquiries").insertMany([
    {
      user_id: userIds[1],
      inquiry_subject: "Bridal Package Pricing",
      inquiry_message: "I am getting married in February. Can you share the complete bridal package details and pricing?",
      inquiry_date: new Date("2025-12-05"),
      status: "Pending",
    },
    {
      user_id: userIds[2],
      inquiry_subject: "Membership / Loyalty Program",
      inquiry_message: "Do you have any membership or loyalty program for regular customers? I visit the salon frequently.",
      inquiry_date: new Date("2025-12-08"),
      status: "Pending",
    },
  ]);

  console.log("✅ General Inquiries seeded");

  console.log("\n🎉 Seed completed successfully!");
  console.log("──────────────────────────────────────────────");
  console.log("👤 Admin   → admin@salon.com    / Admin@123");
  console.log("👤 User 1  → aarav@gmail.com    / Aarav@123");
  console.log("👤 User 2  → nisha@gmail.com    / Nisha@123");
  console.log("──────────────────────────────────────────────");

  await client.close();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
