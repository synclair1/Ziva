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
import { db, handleFirestoreError } from './firebase';
import { getCMSProducts, getCMSProductById } from './cmsService';

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

export async function getProducts(categoryFilter?: string) {
  try {
    // Get CMS products first
    const cmsProducts = getCMSProducts() as Product[];
    
    // Get Firestore products
    const productsRef = collection(db, 'products');
    let q = query(productsRef);
    if (categoryFilter) {
      q = query(productsRef, where('category', '==', categoryFilter));
    }
    const querySnapshot = await getDocs(q);
    const firestoreProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

    // Merge and filter
    let allProducts = [...cmsProducts, ...firestoreProducts];
    
    if (categoryFilter) {
      allProducts = allProducts.filter(p => p.category === categoryFilter);
    }
    
    return allProducts;
  } catch (error) {
    handleFirestoreError(error, 'list', 'products');
    return getCMSProducts() as Product[]; // Fallback to CMS if Firestore fails
  }
}

export async function getFeaturedProducts() {
  try {
    // CMS Featured
    const cmsFeatured = getCMSProducts().filter(p => p.featured) as Product[];
    
    // Firestore Featured
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('featured', '==', true), limit(8));
    const querySnapshot = await getDocs(q);
    const firestoreFeatured = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

    return [...cmsFeatured, ...firestoreFeatured].slice(0, 8);
  } catch (error) {
    handleFirestoreError(error, 'list', 'products');
    return getCMSProducts().filter(p => p.featured) as Product[]; 
  }
}

export async function getProductById(id: string) {
  try {
    // Check CMS first
    const cmsProduct = getCMSProductById(id);
    if (cmsProduct) return cmsProduct as Product;

    // Check Firestore
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, 'get', `products/${id}`);
    return (getCMSProductById(id) as Product) || null;
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

// Helper to seed placeholder data if empty (Disabled for production)
export async function seedProductsIfEmpty() {
  // Seeding disabled to allow user to manage products via CMS
  return;
}
