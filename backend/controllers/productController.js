import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

// @route GET /api/products
// Supports ?search=&category=&featured=&sort=&page=&limit=
export const getProducts = asyncHandler(async (req, res) => {
  const { search, category, featured, sort, page = 1, limit = 12 } = req.query;

  const query = { isAvailable: true };
  if (search) query.$text = { $search: search };
  if (featured) query.isFeatured = featured === "true";

  if (category) {
    // Product.category stores a Category ObjectId, but the frontend passes a
    // human-readable slug (e.g. "cakes") in the URL for clean, shareable
    // links. Resolve the slug to its real _id before filtering — comparing
    // the raw slug string against an ObjectId field would never match.
    const categoryDoc = await Category.findOne({ slug: category });
    if (!categoryDoc) {
      return res.json({ products: [], total: 0, page: Number(page), pages: 0, empty: true, message: "No delicious treats found!" });
    }
    query.category = categoryDoc._id;
  }

  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { basePrice: 1 };
  if (sort === "price_desc") sortOption = { basePrice: -1 };
  if (sort === "rating") sortOption = { rating: -1 };

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(query).populate("category", "name slug").sort(sortOption).skip(skip).limit(Number(limit)),
    Product.countDocuments(query),
  ]);

  if (!products.length) {
    return res.json({ products: [], total: 0, page: Number(page), pages: 0, empty: true, message: "No delicious treats found!" });
  }

  res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @route GET /api/products/:slug
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate("category", "name slug");
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @route POST /api/products (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// @route PUT /api/products/:id (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @route DELETE /api/products/:id (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ message: "Product removed" });
});

// @route POST /api/products/:id/reviews
export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating) {
    res.status(400);
    throw new Error("A rating is required");
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const alreadyReviewed = product.reviews.some((r) => r.user?.toString() === req.user._id.toString());
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You've already reviewed this product");
  }
  product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json(product);
});
