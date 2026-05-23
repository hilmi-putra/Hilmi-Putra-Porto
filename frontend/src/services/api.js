import { supabase } from '../lib/supabaseClient';

/**
 * Reusable utility function to handle Supabase API calls.
 */

// --- READ (GET) ---
export const fetchItems = async (tableName, orderBy = 'sort_order', ascending = true) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order(orderBy, { ascending });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching ${tableName}:`, error);
    return { data: null, error: error.message };
  }
};

// --- CREATE (INSERT) ---
export const createItem = async (tableName, itemData) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert([itemData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error creating in ${tableName}:`, error);
    return { data: null, error: error.message };
  }
};

// --- UPDATE ---
export const updateItem = async (tableName, id, updates) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error updating in ${tableName}:`, error);
    return { data: null, error: error.message };
  }
};

// --- DELETE ---
export const deleteItem = async (tableName, id) => {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting in ${tableName}:`, error);
    return { success: false, error: error.message };
  }
};

// --- BATCH UPDATE ---
export const updateSortOrders = async (tableName, items) => {
  // items should be an array of objects: { id, sort_order }
  try {
    const promises = items.map(item => 
      supabase
        .from(tableName)
        .update({ sort_order: item.sort_order })
        .eq('id', item.id)
    );
    
    await Promise.all(promises);
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error updating sort orders in ${tableName}:`, error);
    return { success: false, error: error.message };
  }
};
