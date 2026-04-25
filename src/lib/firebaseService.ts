/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  getDocs, 
  query, 
  where, 
  limit, 
  addDoc, 
  serverTimestamp, 
  doc, 
  getDoc,
  deleteDoc,
  updateDoc,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  priceNumber: number;
  image: string;
  description: string;
  details: string[];
  tag?: string;
  featured?: boolean;
}

export interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  address: string;
  city: string;
  contact: string;
  items: any[];
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: any;
}

import { handleFirestoreError } from './firebase';

export async function getProducts(categoryFilter?: string) {
  try {
    const productsRef = collection(db, 'products');
    let q = query(productsRef);
    
    if (categoryFilter) {
      q = query(productsRef, where('category', '==', categoryFilter));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    handleFirestoreError(error, 'list', 'products');
  }
}

export async function getFeaturedProducts() {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('featured', '==', true), limit(4));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    handleFirestoreError(error, 'list', 'products');
  }
}

export async function getProductById(id: string) {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, 'get', `products/${id}`);
  }
}

export async function addProduct(productData: Omit<Product, 'id'>) {
  try {
    const productsRef = collection(db, 'products');
    return await addDoc(productsRef, productData);
  } catch (error) {
    handleFirestoreError(error, 'create', 'products');
  }
}

export async function updateProduct(id: string, productData: Partial<Product>) {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, productData);
  } catch (error) {
    handleFirestoreError(error, 'update', `products/${id}`);
  }
}

export async function deleteProduct(id: string) {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, 'delete', `products/${id}`);
  }
}

export async function getOrders() {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  } catch (error) {
    handleFirestoreError(error, 'list', 'orders');
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, 'update', `orders/${orderId}`);
  }
}

export async function createOrder(orderData: any) {
  try {
    const ordersRef = collection(db, 'orders');
    return await addDoc(ordersRef, {
      ...orderData,
      createdAt: serverTimestamp(),
      status: 'pending'
    });
  } catch (error) {
    handleFirestoreError(error, 'create', 'orders');
  }
}

// Helper to seed placeholder data if empty
export async function seedProductsIfEmpty() {
  try {
    const products = await getProducts();
    if (products && products.length === 0) {
      const placeholders = [
        {
          name: 'Azure Block Print Tunic',
          category: '2-Piece Set',
          price: 'Rs. 8,500',
          priceNumber: 8500,
          image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=1200',
          description: 'A masterpiece of traditional block printing meets a contemporary button-down silhouette.',
          details: ['Premium Cotton Lawn', 'Hand Block Printed', 'Minimal Lace Detailing', 'Oversized Fit'],
          featured: true,
          tag: 'New'
        },
        {
          name: 'Sage Organza Fusion',
          category: '3-Piece Set',
          price: 'Rs. 14,200',
          priceNumber: 14200,
          image: 'https://images.unsplash.com/photo-1617175548993-9d33b85651e0?auto=format&fit=crop&q=80&w=1200',
          description: 'Elevate your evening wear with our sheer organza fusion set.',
          details: ['Embroidered Organza', 'Silk Inner Lining', 'Tapered Trousers', 'Matching Stole'],
          featured: true
        },
        {
          name: 'Crimson Khaddar Tunic',
          category: '2-Piece Set',
          price: 'Rs. 7,800',
          priceNumber: 7800,
          image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=1200',
          description: 'Bold textures and deep hues define this khaddar piece.',
          details: ['Winter Khaddar', 'Lace Border', 'Culotte Pants'],
          featured: true,
          tag: 'Essential'
        },
        {
          name: 'Midnight Silk Fusion',
          category: '3-Piece Set',
          price: 'Rs. 18,500',
          priceNumber: 18500,
          image: 'https://images.unsplash.com/photo-1561053720-76cd73ff22c3?auto=format&fit=crop&q=80&w=1200',
          description: 'Luxury at its finest with our raw silk midnight set.',
          details: ['Raw Silk', 'Contemporary Stole', 'Wide Leg Trousers'],
          featured: true
        }
      ];

      for (const p of placeholders) {
        await addDoc(collection(db, 'products'), p);
      }
    }
  } catch (error) {
    handleFirestoreError(error, 'write', 'products');
  }
}
