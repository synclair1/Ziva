import { getProducts, getProductById, getFeaturedProducts, Product } from '../lib/firebaseService';
import { fetchContentfulProducts, fetchContentfulProductById } from './contentfulService';

const USE_CONTENTFUL = !!(import.meta.env.VITE_CONTENTFUL_SPACE_ID && import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN);

export async function getAllProducts(categoryFilter?: string): Promise<Product[]> {
  if (USE_CONTENTFUL) {
    const products = await fetchContentfulProducts();
    if (categoryFilter) {
      return products.filter(p => p.category === categoryFilter);
    }
    return products;
  }
  
  const firebaseProducts = await getProducts(categoryFilter);
  return firebaseProducts || [];
}

export async function getSingleProduct(id: string): Promise<Product | null> {
  if (USE_CONTENTFUL) {
    // Try Contentful first
    const product = await fetchContentfulProductById(id);
    if (product) return product;
  }
  
  // Fallback to Firebase (useful during migration)
  return await getProductById(id);
}

export async function getHomeFeaturedProducts(): Promise<Product[]> {
  if (USE_CONTENTFUL) {
    const products = await fetchContentfulProducts();
    return products.filter(p => p.featured).slice(0, 4);
  }
  
  const firebaseProducts = await getFeaturedProducts();
  return firebaseProducts || [];
}
