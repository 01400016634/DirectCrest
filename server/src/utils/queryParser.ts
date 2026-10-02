export interface ParsedQuery {
  category?: string;
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  condition?: string;
  color?: string;
  storage?: string;
  ram?: string;
  wholesale?: boolean;
  country?: string;
  search?: string; 
}

const BRANDS = ['nike', 'apple', 'samsung', 'sony', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'lg', 'adidas', 'puma', 'gucci', 'prada'];
const COUNTRIES = ['bangladesh', 'usa', 'uk', 'india', 'china', 'japan', 'korea', 'germany', 'france', 'italy'];
const CONDITIONS = ['new', 'used', 'refurbished', 'open box', 'pre-order'];
const COLORS = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'silver', 'gold', 'gray'];

// AI Abstraction Hook
export const callAIParser = async (query: string): Promise<ParsedQuery | null> => {
  // In a real scenario, this calls Google Gemini API or similar to extract JSON.
  // For now, we return null to fall back to deterministic parsing.
  return null;
};

export const parseNaturalQuery = async (query: string): Promise<ParsedQuery> => {
  // 1. Try AI Parser first for complex queries
  const aiResult = await callAIParser(query);
  if (aiResult) return aiResult;

  // 2. Deterministic Fallback
  const q = query.toLowerCase();
  const parsed: ParsedQuery = {};
  
  // Price
  const underMatch = q.match(/(?:under|below|less than|max)\s*(\d+)\s*(dollars?|usd|taka|bdt|eur|gbp)?/);
  if (underMatch) {
    parsed.maxPrice = parseInt(underMatch[1], 10);
    if (underMatch[2]) parsed.currency = underMatch[2].replace(/s$/, '');
  }
  const overMatch = q.match(/(?:over|above|more than|min)\s*(\d+)\s*(dollars?|usd|taka|bdt|eur|gbp)?/);
  if (overMatch) {
    parsed.minPrice = parseInt(overMatch[1], 10);
    if (overMatch[2]) parsed.currency = overMatch[2].replace(/s$/, '');
  }

  // Storage & RAM
  const storageMatch = q.match(/(\d+)\s*(gb|tb)\s*(?:storage)?/);
  if (storageMatch && !q.includes('ram')) {
    parsed.storage = storageMatch[0];
  }
  const ramMatch = q.match(/(\d+)\s*(gb|tb)\s*ram/);
  if (ramMatch) {
    parsed.ram = ramMatch[0];
  }

  // Wholesale
  if (q.includes('wholesale') || q.includes('bulk')) {
    parsed.wholesale = true;
  }

  // Condition
  for (const cond of CONDITIONS) {
    if (q.includes(cond)) {
      parsed.condition = cond === 'new' ? 'NEW' : cond === 'used' ? 'USED' : cond === 'refurbished' ? 'REFURBISHED' : cond === 'open box' ? 'OPEN_BOX' : 'PRE_ORDER';
      break;
    }
  }

  // Color
  for (const color of COLORS) {
    if (new RegExp(`\\b${color}\\b`).test(q)) {
      parsed.color = color;
      break;
    }
  }

  // Brand
  for (const brand of BRANDS) {
    if (new RegExp(`\\b${brand}\\b`).test(q)) {
      parsed.brand = brand.charAt(0).toUpperCase() + brand.slice(1);
      break;
    }
  }

  // Country
  for (const country of COUNTRIES) {
    if (new RegExp(`\\b${country}\\b`).test(q)) {
      parsed.country = country.charAt(0).toUpperCase() + country.slice(1);
      break;
    }
  }

  // Basic cleanup for "search" term
  let search = q
    .replace(/(?:find|show|search for|get|looking for)\s*/g, '')
    .replace(/(?:under|below|less than|max)\s*(\d+)\s*(dollars?|usd|taka|bdt|eur|gbp)?/g, '')
    .replace(/(?:over|above|more than|min)\s*(\d+)\s*(dollars?|usd|taka|bdt|eur|gbp)?/g, '')
    .replace(/wholesale|bulk/g, '')
    .replace(new RegExp(`\\b(?:${CONDITIONS.join('|')})\\b`, 'g'), '')
    .replace(new RegExp(`\\b(?:${COLORS.join('|')})\\b`, 'g'), '')
    .replace(new RegExp(`\\b(?:${BRANDS.join('|')})\\b`, 'g'), '')
    .replace(new RegExp(`\\b(?:${COUNTRIES.join('|')})\\b`, 'g'), '')
    .replace(/(\d+)\s*(gb|tb)\s*(?:storage|ram)?/g, '')
    .replace(/available in|in/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If search ends up being a category like "sneakers", we could map it.
  if (search) {
    parsed.search = search;
  }

  return parsed;
};
