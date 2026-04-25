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
  // Always prefer CMS products for storefront
  const cmsProducts = getCMSProducts();
  
  if (cmsProducts.length > 0) {
    if (categoryFilter) {
      return cmsProducts.filter(p => p.category === categoryFilter);
    }
    return cmsProducts;
  }
  
  // Fallback to Firebase if CMS is empty
  const firebaseProducts = await getProducts(categoryFilter);
  return firebaseProducts || [];
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
  const featured = cmsProducts.filter(p => p.featured);
  
  if (featured.length > 0) {
    return featured.slice(0, 4);
  }
  
  const firebaseProducts = await getFeaturedProducts();
  return firebaseProducts || [];
}
