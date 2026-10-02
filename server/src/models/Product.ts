import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  sku: string;
  price: number;
  stock: number;
  images: string[];
  glbModelPath?: string;
  translations: {
    en: { name: string; description: string };
    zh?: { name: string; description: string };
    es?: { name: string; description: string };
  };
}

const ProductSchema: Schema = new Schema({
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  glbModelPath: { type: String },
  translations: {
    en: {
      name: { type: String, required: true },
      description: { type: String, required: true }
    },
    zh: {
      name: { type: String },
      description: { type: String }
    },
    es: {
      name: { type: String },
      description: { type: String }
    }
  }
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);
