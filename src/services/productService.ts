import { getProducts, getProductById, getFeaturedProducts, Product } from '../lib/firebaseService';

// This will load all local JSON files created by the CMS
const productFiles = (import.meta as any).glob('../content/products/*.json', { eager: true });

const getCMSProducts = (): Product[] => {
  return Object.entries(productFiles).map(([path, content]: [string, any]) => {
    // Get the ID from the filename
    const id = path.split('/').pop()?.replace('.json', '') || 'unknown';
    return {
      id,
      ...content,
    } as Product;
  });
};

export async function getAllProducts(categoryFilter?: string): Promise<Product[]> {
  const cmsProducts = getCMSProducts();
  let firebaseProducts: Product[] = [];
  
  try {
    firebaseProducts = await getProducts(categoryFilter);
  } catch (err) {
    console.error("Firebase fetch failed", err);
  }
  
  // Combine both sources
  let all = [...cmsProducts, ...firebaseProducts];
  
  // Apply category filter to combined list if not already filtered by Firebase
  if (categoryFilter) {
    all = all.filter(p => p.category === categoryFilter);
  }
  
  return all;
}

export async function getSingleProduct(id: string): Promise<Product | null> {
  const cmsProducts = getCMSProducts();
  const found = cmsProducts.find(p => p.id === id);
  if (found) return found;
  
  // Fallback to Firebase
  return await getProductById(id);
}

export async function getHomeFeaturedProducts(): Promise<Product[]> {
  const cmsProducts = getCMSProducts();
  const cmsFeatured = cmsProducts.filter(p => p.featured);
  
  let firebaseFeatured: Product[] = [];
  try {
    firebaseFeatured = await getFeaturedProducts();
  } catch (err) {
    console.error("Firebase featured fetch failed", err);
  }

  const combined = [...cmsFeatured, ...firebaseFeatured];
  return combined.slice(0, 8);
}
