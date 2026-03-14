import { supabase } from './supabaseClient';
export { supabase };

/**
 * Trade Service - Handles all operations for the trades table in Supabase
 */
export const tradeService = {
  /**
   * Fetch all trades for the current user
   */
  async getTrades() {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Create a new trade
   */
  async createTrade(tradeData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('trades')
      .insert([{ ...tradeData, user_id: user.id }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Update an existing trade
   */
  async updateTrade(id, updates) {
    const { data, error } = await supabase
      .from('trades')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Delete a trade
   */
  async deleteTrade(id) {
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  /**
   * Upload an image to Supabase Storage
   */
  async uploadScreenshot(file, path) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('trade-screenshots')
      .upload(fileName, file);
    
    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('trade-screenshots')
      .getPublicUrl(data.path);
    
    return publicUrl;
  }
};

/**
 * Strategy Service - Handles user-defined strategies
 */
export const strategyService = {
  async getStrategies() {
    const { data, error } = await supabase
      .from('strategies')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data.map(s => s.name);
  },

  async addStrategy(name) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('strategies')
      .insert([{ name, user_id: user.id }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteStrategy(name) {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('strategies')
      .delete()
      .eq('name', name)
      .eq('user_id', user.id);
    
    if (error) throw error;
    return true;
  }
};
