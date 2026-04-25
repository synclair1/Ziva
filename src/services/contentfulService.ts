import { createClient } from 'contentful';
import { Product } from '../lib/firebaseService';

// Note: In Vite, we use import.meta.env
const SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
const ENVIRONMENT = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';

const client = createClient({
  space: SPACE_ID || 'undefined',
  accessToken: ACCESS_TOKEN || 'undefined',
  environment: ENVIRONMENT,
});

export async function fetchContentfulProducts(): Promise<Product[]> {
  if (!SPACE_ID || !ACCESS_TOKEN) {
    console.warn("Contentful credentials not configured in environment variables.");
    return [];
  }
  
  try {
    const response = await client.getEntries({
      content_type: 'product',
      order: ['-sys.createdAt'],
    });

    return response.items.map((item: any) => {
      const { fields, sys } = item;
      return {
        id: sys.id,
        name: fields.name || '',
        category: fields.category || '',
        price: fields.price || 'Rs. 0',
        priceNumber: fields.priceNumber || 0,
        image: fields.image?.fields?.file?.url 
          ? `https:${fields.image.fields.file.url}` 
          : (fields.imageLink || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=1200'),
        description: fields.description || '',
        details: fields.details || [],
        tag: fields.tag || '',
        featured: fields.featured || false,
      } as Product;
    });
  } catch (error) {
    console.error("Error fetching from Contentful:", error);
    return [];
  }
}

export async function fetchContentfulProductById(id: string): Promise<Product | null> {
  if (!SPACE_ID || !ACCESS_TOKEN) return null;

  try {
    const entry: any = await client.getEntry(id);
    const { fields, sys } = entry;
    
    return {
      id: sys.id,
      name: fields.name || '',
      category: fields.category || '',
      price: fields.price || 'Rs. 0',
      priceNumber: fields.priceNumber || 0,
      image: fields.image?.fields?.file?.url 
        ? `https:${fields.image.fields.file.url}` 
        : (fields.imageLink || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=1200'),
      description: fields.description || '',
      details: fields.details || [],
      tag: fields.tag || '',
      featured: fields.featured || false,
    } as Product;
  } catch (error) {
    console.error(`Error fetching product ${id} from Contentful:`, error);
    return null;
  }
}
