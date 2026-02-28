import { supabase } from './supabase';
import type { Product } from '@/types/databse';

export async function getProductsWithNotes(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
          *,
          product_notes (
            note_type,
            notes (
              id,
              name,
              category
            )
          )
        `);

  if (error) throw error;
  return (data as unknown as Product[]) || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
          *,
          product_notes (
            note_type,
            notes (
              id,
              name,
              category
            )
          )
        `)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data as unknown as Product;
}
