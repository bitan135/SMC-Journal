'use client';

import { supabase, tradeService, strategyService } from './supabase';

// ============================================================
// SMC Journal — Unified Data Layer (Supabase + Helpers)
// ============================================================

// -------------- Constants --------------------

const INSTRUMENTS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'NAS100', 'US30', 'GBPJPY', 'AUDUSD',
  'USDCAD', 'USDCHF', 'NZDUSD', 'EURJPY', 'SPX500', 'GER40', 'UK100', 'XAGUSD',
  'BTCUSD', 'ETHUSD', 'SOLUSD', 'BNBUSD'
];

const SESSIONS = ['London', 'New York', 'Asia'];

const SMC_TAGS = [
  'Liquidity Sweep', 'BOS', 'CHoCH', 'FVG', 'Order Block', 
  'Inducement', 'SMT Divergence', 'Internal Structure', 'Swing Structure',
  'Premium/Discount', 'OTE', 'IFVG', 'BPR'
];

const DEFAULT_STRATEGIES = [
  'FVG Continuation',
  'Liquidity Sweep Reversal',
  'Breaker Block',
  'Mitigation Block',
  'Order Block Bounce',
  'CHoCH Reversal',
  'Silver Bullet',
  'AMD (Power of 3)',
  'London Open Expansion',
  'NY Killzone Sweep',
  'Unicorn Setup'
];

const DEFAULT_SETTINGS = {
  accountBalance: 10000,
  defaultLotSize: 0.01,
  riskPercentage: 1,
  currency: 'USD',
};

// -------------- Utility Functions (Pure Math) --------------------

export function calculateRR(entry, stopLoss, takeProfit, direction) {
  if (!entry || !stopLoss || !takeProfit) return 0;
  const e = parseFloat(entry);
  const sl = parseFloat(stopLoss);
  const tp = parseFloat(takeProfit);
  
  const risk = Math.abs(e - sl);
  const reward = Math.abs(tp - e);
  
  if (risk === 0) return 0;
  return parseFloat((reward / risk).toFixed(2));
}

export function calculatePips(entry, stopLoss, instrument) {
  if (!entry || !stopLoss) return 0;
  const e = parseFloat(entry);
  const sl = parseFloat(stopLoss);
  const diff = Math.abs(e - sl);
  
  const instr = instrument?.toUpperCase() || '';
  
  if (instr.includes('JPY')) return parseFloat((diff * 100).toFixed(1));
  if (instr.includes('XAU') || instr.includes('GOLD')) return parseFloat((diff * 10).toFixed(1));
  if (instr.includes('XAG') || instr.includes('SILVER')) return parseFloat((diff * 10).toFixed(1));
  
  // Indices & Crypto
  if (instr.includes('NAS') || instr.includes('US30') || instr.includes('SPX') || instr.includes('NDX') || instr.includes('GER') || instr.includes('DAX') || instr.includes('UK100') || instr.includes('DOW')) {
    return parseFloat(diff.toFixed(1));
  }
  if (instr.includes('BTC') || instr.includes('ETH') || instr.includes('SOL') || instr.includes('BNB')) return parseFloat(diff.toFixed(0));
  
  // Standard 4/5 decimal pairs
  return parseFloat((diff * 10000).toFixed(1));
}

export function calculateRiskAmount(lotSize, pips, instrument) {
  if (!lotSize || !pips) return 0;
  const lot = parseFloat(lotSize);
  const instr = instrument?.toUpperCase() || '';
  
  if (instr.includes('NAS') || instr.includes('US30') || instr.includes('SPX') || instr.includes('DOW')) return parseFloat((lot * pips).toFixed(2));
  if (instr.includes('XAU') || instr.includes('GOLD') || instr.includes('XAG') || instr.includes('SILVER')) return parseFloat((lot * 100 * pips / 10).toFixed(2));
  if (instr.includes('JPY')) return parseFloat((lot * 100000 * pips / 100).toFixed(2));
  
  // Standard Forex (100k units)
  return parseFloat((lot * 100000 * pips / 10000).toFixed(2));
}

export function getSessionFromTime(date) {
  const hours = new Date(date).getUTCHours();
  if (hours >= 0 && hours < 8) return 'Asia';
  if (hours >= 7 && hours < 16) return 'London';
  if (hours >= 12 && hours < 21) return 'New York';
  return 'London';
}

// -------------- Analytics Helpers --------------------

export function getWinRate(trades) {
  if (!trades.length) return 0;
  const wins = trades.filter(t => t.result === 'Win').length;
  return parseFloat(((wins / trades.length) * 100).toFixed(1));
}

export function getProfitFactor(trades) {
  const wins = trades.filter(t => t.result === 'Win');
  const losses = trades.filter(t => t.result === 'Loss');
  const totalWinRR = wins.reduce((sum, t) => sum + (t.rr || 0), 0);
  const totalLossRR = losses.reduce((sum, t) => sum + 1, 0);
  if (totalLossRR === 0) return totalWinRR > 0 ? 999 : 0;
  return parseFloat((totalWinRR / totalLossRR).toFixed(2));
}

export function getAverageRR(trades = []) {
  if (!trades || !trades.length) return 0;
  const wins = trades.filter(t => t && t.result === 'Win');
  if (!wins.length) return 0;
  const avg = wins.reduce((sum, t) => sum + (t.rr || 0), 0) / wins.length;
  return parseFloat(avg.toFixed(2));
}

export function getExpectancy(trades = []) {
  if (!trades || !trades.length) return 0;
  const wr = getWinRate(trades) / 100;
  const avgRR = getAverageRR(trades);
  // Expectancy = (WR * AvgRR) - (LossRate * 1)
  const expectancy = (wr * avgRR) - (1 - wr);
  return parseFloat(expectancy.toFixed(2));
}

export function getTrend(trades = [], key, samples = 10) {
  if (trades.length < samples * 2) return 0;
  const recent = trades.slice(0, samples);
  const previous = trades.slice(samples, samples * 2);
  
  let recentMetric, prevMetric;
  if (key === 'winRate') {
    recentMetric = getWinRate(recent);
    prevMetric = getWinRate(previous);
  } else if (key === 'profitFactor') {
    recentMetric = getProfitFactor(recent);
    prevMetric = getProfitFactor(previous);
  } else {
    return 0;
  }
  
  if (prevMetric === 0) return recentMetric > 0 ? 100 : 0;
  return parseFloat(((recentMetric - prevMetric) / prevMetric * 100).toFixed(1));
}

export function getDrawdownCurve(trades = []) {
  if (!trades || !trades.length) return [];
  const sorted = [...trades].sort((a, b) => new Date(a.trade_date || a.tradeDate || a.created_at || a.createdAt) - new Date(b.trade_date || b.tradeDate || b.created_at || b.createdAt));
  
  let balance = 0;
  let peak = 0;
  return sorted.map((t, i) => {
    const r = t.result === 'Win' ? (t.rr || 0) : t.result === 'Break Even' ? 0 : -1;
    balance += r;
    if (balance > peak) peak = balance;
    const dd = peak === 0 ? 0 : ((balance - peak) / (peak || 1)) * 0; // Simplified R-based drawdown
    const ddR = balance - peak;
    return {
      index: i + 1,
      date: new Date(t.trade_date || t.tradeDate || t.created_at || t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      drawdown: parseFloat(ddR.toFixed(2)),
      balance: parseFloat(balance.toFixed(2))
    };
  });
}

export function getMaxDrawdown(trades = []) {
  const curve = getDrawdownCurve(trades);
  if (!curve.length) return 0;
  const max = Math.min(...curve.map(c => c.drawdown));
  return parseFloat(max.toFixed(2));
}

export function getMonthlyPerformance(trades = []) {
  const months = {};
  trades.forEach(t => {
    const date = new Date(t.trade_date || t.tradeDate || t.created_at || t.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!months[key]) months[key] = 0;
    const r = t.result === 'Win' ? (t.rr || 0) : t.result === 'Break Even' ? 0 : -1;
    months[key] += r;
  });

  return Object.entries(months)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, profit]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      profit: parseFloat(profit.toFixed(2))
    }));
}

export function getEquityCurve(trades) {
  const sorted = [...trades].sort((a, b) => new Date(a.created_at || a.createdAt) - new Date(b.created_at || b.createdAt));
  let balance = 0;
  
  // Add an initial zero point if no trades exist to help charting
  const curve = [];
  
  sorted.forEach((trade, i) => {
    if (trade.result === 'Win') balance += (trade.rr || 1);
    else if (trade.result === 'Loss') balance -= 1;
    // Break Even adds 0 to balance
    
    curve.push({
      trade: i + 1,
      balance: parseFloat(balance.toFixed(2)),
      date: new Date(trade.created_at || trade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      result: trade.result,
    });
  });
  
  return curve;
}

export function getWinRateByGroup(trades, groupKey) {
  const groups = {};
  trades.forEach(t => {
    const key = t[groupKey] || 'Unknown';
    if (!groups[key]) groups[key] = { wins: 0, total: 0 };
    groups[key].total++;
    if (t.result === 'Win') groups[key].wins++;
  });
  
  return Object.entries(groups).map(([name, data]) => ({
    name,
    winRate: parseFloat(((data.wins / data.total) * 100).toFixed(1)),
    trades: data.total,
    wins: data.wins,
    losses: data.total - data.wins,
  })).sort((a, b) => b.trades - a.trades);
}

export function getStrategyInsights(trades) {
  const groups = {};
  trades.forEach(t => {
    const key = t.strategy || 'Unknown';
    if (!groups[key]) groups[key] = { wins: 0, total: 0, totalRR: 0 };
    groups[key].total++;
    if (t.result === 'Win') {
      groups[key].wins++;
      groups[key].totalRR += (t.rr || 0);
    }
  });
  
  return Object.entries(groups).map(([name, data]) => {
    const winRate = (data.wins / data.total);
    const avgRR = data.wins > 0 ? (data.totalRR / data.wins) : 0;
    // Expectancy = (WR * AvgRR) - (LossRate * 1)
    const expectancy = (winRate * avgRR) - (1 - winRate);
    
    return {
      name,
      trades: data.total,
      winRate: parseFloat((winRate * 100).toFixed(1)),
      avgRR: parseFloat(avgRR.toFixed(2)),
      expectancy: parseFloat(expectancy.toFixed(2)),
      wins: data.wins,
      losses: data.total - data.wins,
    };
  }).sort((a, b) => b.trades - a.trades);
}

export function getRRDistribution(trades) {
  const buckets = { '0-0.5': 0, '0.5-1': 0, '1-1.5': 0, '1.5-2': 0, '2-2.5': 0, '2.5-3': 0, '3+': 0 };
  trades.filter(t => t.result === 'Win').forEach(t => {
    const rr = t.rr || 0;
    if (rr < 0.5) buckets['0-0.5']++;
    else if (rr < 1) buckets['0.5-1']++;
    else if (rr < 1.5) buckets['1-1.5']++;
    else if (rr < 2) buckets['1.5-2']++;
    else if (rr < 2.5) buckets['2-2.5']++;
    else if (rr < 3) buckets['2.5-3']++;
    else buckets['3+']++;
  });
  return Object.entries(buckets).map(([name, count]) => ({ name, count }));
}

// -------------- Supabase Bridged Operations --------------------

// Profile & Subscription Service Wrapper
export const profileService = {
  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return data;
  },
  async updateProfile(updates) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single();
    return data;
  },
  async getSubscription() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { plan_id: 'free', status: 'none' };
    
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    return data || { plan_id: 'free', status: 'active' };
  }
};

// Trades
export async function getTrades() {
  try {
    return await tradeService.getTrades();
  } catch (e) {
    console.error('Fetch trades failed:', e);
    return [];
  }
}

export async function canAddTrade() {
  // Core journal is now completely free and unlimited for all users
  return true;
}

export async function saveTrade(trade) {
  const canAdd = await canAddTrade();
  if (!canAdd) {
    throw new Error('Trade limit reached! Please upgrade to Pro for unlimited trades.');
  }

  // Handle screenshot uploads if they are base64/files
  const tradeData = { ...trade };
  return await tradeService.createTrade(tradeData);
}

export async function updateTrade(id, updates) {
  return await tradeService.updateTrade(id, updates);
}

export async function deleteTrade(id) {
  return await tradeService.deleteTrade(id);
}

// Strategies
export async function getStrategies() {
  try {
    const strategies = await strategyService.getStrategies();
    return strategies.length > 0 ? strategies : DEFAULT_STRATEGIES;
  } catch {
    return DEFAULT_STRATEGIES;
  }
}

export async function addStrategy(name) {
  return await strategyService.addStrategy(name);
}

export async function deleteStrategy(name) {
  return await strategyService.deleteStrategy(name);
}

// Settings / Profile
export async function getSettings() {
  const profile = await profileService.getProfile();
  if (!profile) return DEFAULT_SETTINGS;
  return {
    accountBalance: profile.account_balance,
    riskPercentage: profile.risk_percentage,
    currency: profile.currency,
  };
}

export async function saveSettings(settings) {
  return await profileService.updateProfile({
    account_balance: settings.accountBalance,
    risk_percentage: settings.riskPercentage,
    currency: settings.currency,
  });
}

// Onboarding
export async function hasOnboarded() {
  const profile = await profileService.getProfile();
  return profile?.has_completed_onboarding === true;
}

export async function setOnboarded() {
  return await profileService.updateProfile({ has_completed_onboarding: true });
}

// Data Bridge: Local Storage to Cloud Migration
export async function migrateLocalToCloud() {
  const localTrades = JSON.parse(localStorage.getItem('edge_ledger_trades') || '[]');
  const localStrategies = JSON.parse(localStorage.getItem('edge_ledger_strategies') || '[]');
  
  if (localTrades.length === 0 && localStrategies.length === 0) {
    return { success: true, message: 'No local data found to migrate.' };
  }

  // 1. Migrate Strategies
  for (const name of localStrategies) {
    try {
      await addStrategy(name);
    } catch (e) {
      console.warn(`Strategy ${name} migration skipped (likely exists).`);
    }
  }

  // 2. Migrate Trades
  let migratedCount = 0;
  for (const trade of localTrades) {
    try {
      // Clean up local trade data for Supabase (remove local IDs if present)
      const { id, ...cleanTrade } = trade;
      await saveTrade(cleanTrade);
      migratedCount++;
    } catch (e) {
      console.error('Trade migration error:', e);
    }
  }

  // 3. Clear Local Storage
  localStorage.removeItem('edge_ledger_trades');
  localStorage.removeItem('edge_ledger_strategies');
  
  return { 
    success: true, 
    message: `Migration complete. Successfully moved ${migratedCount} trades and ${localStrategies.length} strategies to your SMC Journal cloud account.` 
  };
}

// Exports
export { INSTRUMENTS, SESSIONS, SMC_TAGS, DEFAULT_STRATEGIES };
