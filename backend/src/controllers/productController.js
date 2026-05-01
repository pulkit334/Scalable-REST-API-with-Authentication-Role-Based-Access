const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  const product = await Product.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    data: product,
  });
};

exports.getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }
  if (req.user.role === "user") {
    filter.createdBy = req.user._id;
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate("createdBy", "name email")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: products,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "createdBy",
    "name email"
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  res.json({
    success: true,
    data: product,
  });
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  if (
    req.user.role !== "admin" &&
    product.createdBy.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "You can only update your own products.",
    });
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: "Product updated successfully.",
    data: updated,
  });
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  if (
    req.user.role !== "admin" &&
    product.createdBy.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "You can only delete your own products.",
    });
  }

  await Product.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Product deleted successfully.",
  });
};
