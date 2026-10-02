import type { Request, Response } from 'express';
import { Product, ProductImage, ProductVideo, ProductVariant, Brand, Category, Country } from '../models/Schema.js';
import { parseNaturalQuery } from '../utils/queryParser.js';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Also cleanup media and variants
    await ProductImage.deleteMany({ productId: req.params.id });
    await ProductVideo.deleteMany({ productId: req.params.id });
    await ProductVariant.deleteMany({ productId: req.params.id });
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const publishProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { status: 'PUBLISHED' }, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const unpublishProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { status: 'DRAFT' }, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      status, search, categoryId, brandId, isFeatured, isTrending, isNewArrival, 
      page = 1, limit = 12, sort, ids, 
      minPrice, maxPrice, condition, minRating, inStock, hasWholesale, countryId
    } = req.query;
    
    const filter: any = {};
    if (status) filter.status = status;
    if (categoryId) filter.categoryId = categoryId;
    if (brandId) filter.brandId = brandId;
    if (countryId) filter.sourceCountryId = countryId;
    if (condition) filter.condition = condition;
    
    if (isFeatured) filter.isFeatured = isFeatured === 'true';
    if (isTrending) filter.isTrending = isTrending === 'true';
    if (isNewArrival) filter.isNewArrival = isNewArrival === 'true';
    if (inStock === 'true') filter.stock = { $gt: 0 };
    if (hasWholesale === 'true') filter.wholesaleStartingPrice = { $gt: 0 };
    
    if (minPrice || maxPrice) {
      filter.retailPrice = {};
      if (minPrice) filter.retailPrice.$gte = Number(minPrice);
      if (maxPrice) filter.retailPrice.$lte = Number(maxPrice);
    }
    
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }
    
    if (ids && typeof ids === 'string') {
      filter._id = { $in: ids.split(',') };
    }
    
    if (search) {
      // PostgreSQL full-text search preparation: right now using MongoDB text index
      filter.$text = { $search: String(search) };
    }

    let sortObj: any = { createdAt: -1 };
    let projection: any = null;
    
    if (sort === 'relevance' && search) {
      sortObj = { score: { $meta: 'textScore' } };
      projection = { score: { $meta: 'textScore' } };
    } else if (sort === 'price_asc') {
      sortObj = { retailPrice: 1 };
    } else if (sort === 'price_desc') {
      sortObj = { retailPrice: -1 };
    } else if (sort === 'newest') {
      sortObj = { createdAt: -1 };
    } else if (sort === 'popular') {
      sortObj = { isTrending: -1, rating: -1, createdAt: -1 };
    } else if (sort === 'rating_desc') {
      sortObj = { rating: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const query = Product.find(filter, projection)
      .populate('categoryId', 'name')
      .populate('brandId', 'name')
      .populate('sourceCountryId', 'name')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    const products = await query.lean();
      
    // Fetch primary images for these products
    const productIds = products.map(p => p._id);
    const images = await ProductImage.find({ productId: { $in: productIds }, isPrimary: true }).lean();
    
    const productsWithImages = products.map(p => {
      const pImages = images.filter(img => img.productId?.toString() === p._id?.toString());
      return { ...p, images: pImages };
    });
      
    const total = await Product.countDocuments(filter);
    
    res.json({
      products: productsWithImages,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'name')
      .populate('brandId', 'name')
      .populate('sourceCountryId', 'name');
      
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Fetch associated variants and media
    const variants = await ProductVariant.find({ productId: req.params.id });
    const images = await ProductImage.find({ productId: req.params.id });
    const videos = await ProductVideo.find({ productId: req.params.id });
    
    res.json({
      ...product.toObject(),
      variants,
      images,
      videos
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Media & Variant Management
export const addMedia = async (req: Request, res: Response) => {
  try {
    const { type, url, isPrimary } = req.body;
    let media;
    if (type === 'image') {
      media = new ProductImage({ productId: req.params.id, url, isPrimary });
    } else {
      media = new ProductVideo({ productId: req.params.id, url });
    }
    await media.save();
    res.status(201).json(media);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const addVariant = async (req: Request, res: Response) => {
  try {
    const variant = new ProductVariant({ ...req.body, productId: req.params.id });
    await variant.save();
    res.status(201).json(variant);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const parseSearchQuery = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') return res.status(400).json({ error: 'Query string q is required' });

    const parsed = await parseNaturalQuery(q);

    // Resolve DB IDs based on text
    const result: any = { ...parsed };
    
    if (parsed.brand) {
      const brand = await Brand.findOne({ name: { $regex: new RegExp(`^${parsed.brand}$`, 'i') } });
      if (brand) {
        result.brandId = brand._id;
        delete result.brand;
      }
    }
    
    if (parsed.country) {
      const country = await Country.findOne({ name: { $regex: new RegExp(`^${parsed.country}$`, 'i') } });
      if (country) {
        result.countryId = country._id;
        delete result.country;
      }
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
