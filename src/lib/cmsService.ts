
/**
 * Utility to load product data from local JSON files managed by Decap CMS
 */

export interface CMSProduct {
  name: string;
  category: string;
  price: string;
  priceNumber: number;
  image: string;
  description: string;
  details: string[];
  featured?: boolean;
  tag?: string;
  id?: string;
}

// Use any for import.meta to avoid Vite-specific type issues in standard tsc
const productFiles = (import.meta as any).glob('../content/products/*.json', { eager: true });

export const getCMSProducts = (): CMSProduct[] => {
  return Object.entries(productFiles).map(([path, content]: [string, any]) => {
    // Extract ID from filename (e.g., ../content/products/silk-ensemble.json -> silk-ensemble)
    const id = path.split('/').pop()?.replace('.json', '') || '';
    return {
      ...content,
      id
    };
  });
};

export const getCMSProductById = (id: string): CMSProduct | undefined => {
  const products = getCMSProducts();
  return products.find(p => p.id === id);
};
