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

const TIMEFRAME_BIAS = ['15M', '30M', '1H', '4H', '1D'];

const BIAS_TYPES = ['Continuation', 'Reversal'];

const POI_TYPES = ['Continuous', 'Extreme'];

const SMC_TAGS = [
  'BOS', 'CHoCH', 'FVG', 'Order Block', 
  'Inducement', 'SMT Divergence', 'Internal Structure', 'Swing Structure',
  'Premium/Discount', 'OTE', 'IFVG', 'BPR'
];

const LIQUIDITY_ZONES = [
  'Asia High/Low',
  'London High/Low',
  'New York High/Low',
  'Daily High/Low',
  'Weekly High/Low',
  'Monthly High/Low',
  'Structure High/Low'
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
  'Unicorn Setup',
  'Supply Zone',
  'Demand Zone'
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
  if (!date) return 'London';
  const hours = new Date(date).getUTCHours();
  if (isNaN(hours)) return 'London';
  if (hours >= 0 && hours < 8) return 'Asia';
  if (hours >= 7 && hours < 16) return 'London';
  if (hours >= 12 && hours < 21) return 'New York';
  return 'London';
}

/**
 * Robustly parse any date format into a JS Date object.
 * Handles: ISO strings, local-datetime strings, timestamps, and legacy property names.
 */
export function parseTradeDate(trade) {
  if (!trade) return new Date();
  const rawDate = trade.trade_date || trade.tradeDate || trade.created_at || trade.createdAt || new Date();
  const date = new Date(rawDate);
  return isNaN(date.getTime()) ? new Date() : date;
}

// -------------- Analytics Helpers --------------------

export function getWinRate(trades) {
  if (!trades || !trades.length) return 0;
  const wins = trades.filter(t => t.result === 'Win').length;
  return parseFloat(((wins / trades.length) * 100).toFixed(1));
}

export function getProfitFactor(trades) {
  if (!trades || !trades.length) return 0;
  const wins = trades.filter(t => t.result === 'Win');
  const losses = trades.filter(t => t.result === 'Loss');
  const totalWinRR = wins.reduce((sum, t) => sum + (t.rr || 0), 0);
  const totalLossRR = losses.reduce((sum, t) => sum + 1, 0);
  if (totalLossRR === 0) return totalWinRR > 0 ? 999 : 0;
  return parseFloat((totalWinRR / totalLossRR).toFixed(2));
}

export function getAverageRR(trades = []) {
  if (!Array.isArray(trades) || trades.length === 0) return 0;
  const wins = trades.filter(t => t && t.result === 'Win');
  if (!wins.length) return 0;
  const avg = wins.reduce((sum, t) => sum + (parseFloat(t.rr) || 0), 0) / wins.length;
  return parseFloat(avg.toFixed(2));
}

export function getExpectancy(trades = []) {
  if (!Array.isArray(trades) || trades.length === 0) return 0;
  const wr = getWinRate(trades) / 100;
  const avgRR = getAverageRR(trades);
  // Expectancy = (WR * AvgRR) - (LossRate * 1)
  const expectancy = (wr * avgRR) - (1 - wr);
  const result = parseFloat(expectancy.toFixed(2));
  return isNaN(result) ? 0 : result;
}

export function getTrend(trades = [], key, samples = 10) {
  if (!trades || trades.length < samples * 2) return 0;
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
    const dd = peak === 0 ? 0 : ((balance - peak) / peak) * 100;
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
  if (!trades || !trades.length) return [];
  const sorted = [...trades].sort((a, b) => new Date(a.trade_date || a.tradeDate || a.created_at || a.createdAt) - new Date(b.trade_date || b.tradeDate || b.created_at || b.createdAt));
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
  if (!Array.isArray(trades) || trades.length === 0) return [];
  const groups = {};
  trades.forEach(t => {
    if (!t) return;
    const key = t[groupKey] || 'Unknown';
    if (!groups[key]) groups[key] = { wins: 0, total: 0 };
    groups[key].total++;
    if (t.result === 'Win') groups[key].wins++;
  });
  
  return Object.entries(groups).map(([name, data]) => ({
    name,
    winRate: parseFloat(data.total > 0 ? ((data.wins / data.total) * 100).toFixed(1) : 0),
    trades: data.total,
    wins: data.wins,
    losses: data.total - data.wins,
  })).sort((a, b) => b.trades - a.trades);
}

export function getStrategyInsights(trades) {
  if (!trades || !trades.length) return [];
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
  if (!trades || !trades.length) return [];
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

// -------------- In-Memory RAM Cache System --------------------
let tradesCache = null;
let strategiesCache = null;
let tradesCacheExp = 0;
let strategiesCacheExp = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minute TTL

export function invalidateCache(type = 'all') {
  if (type === 'all' || type === 'trades') {
    tradesCache = null;
    tradesCacheExp = 0;
  }
  if (type === 'all' || type === 'strategies') {
    strategiesCache = null;
    strategiesCacheExp = 0;
  }
}

// -------------- Supabase Bridged Operations --------------------

// Trades
export async function getTrades(forceRefresh = false) {
  if (!forceRefresh && tradesCache && Date.now() < tradesCacheExp) {
    return { success: true, data: tradesCache, error: null };
  }
  try {
    const data = await tradeService.getTrades();
    const parsed = Array.isArray(data) ? data : [];
    tradesCache = parsed;
    tradesCacheExp = Date.now() + CACHE_TTL;
    return { success: true, data: parsed, error: null };
  } catch (e) {
    console.error('[STORAGE API] Fetch trades failed:', e?.message || e?.details || e?.code || e);
    return { success: false, data: [], error: 'Failed to synchronize institutional data.' };
  }
}

export async function canAddTrade() {
  return { success: true, data: true, error: null };
}

export async function saveTrade(trade) {
  try {
    const canAddRes = await canAddTrade();
    if (!canAddRes.data) {
      return { success: false, data: null, error: 'Trade limit reached! Please upgrade to Pro for unlimited trades.' };
    }

    // Hardening: Enforce types and defaults
    const tradeData = {
      ...trade,
      entry_price: parseFloat(trade.entryPrice || trade.entry_price) || 0,
      stop_loss: parseFloat(trade.stopLoss || trade.stop_loss) || null,
      take_profit: parseFloat(trade.takeProfit || trade.take_profit) || null,
      lot_size: parseFloat(trade.lotSize || trade.lot_size) || 0.01,
      rr: parseFloat(trade.rr) || 0,
      pips: parseFloat(trade.pips) || 0,
      trade_date: parseTradeDate(trade).toISOString(),
      smc_tags: Array.isArray(trade.smcTags || trade.smc_tags) ? (trade.smcTags || trade.smc_tags) : [],
      liquidity_sweep: Array.isArray(trade.liquiditySweep || trade.liquidity_sweep) ? (trade.liquiditySweep || trade.liquidity_sweep) : [],
    };

    // Remove legacy/UI/calculated keys to keep DB clean
    const KEYS_TO_REMOVE = [
      'entryPrice', 'stopLoss', 'takeProfit', 'lotSize', 'tradeDate', 
      'smcTags', 'liquiditySweep', 'riskAmount', 'risk_amount',
      'timeframeBias', 'biasType', 'poiType'
    ];
    KEYS_TO_REMOVE.forEach(key => delete tradeData[key]);

    // Strict validation
    if (tradeData.entry_price === 0) {
      return { success: false, data: null, error: 'Entry price is required and must be numeric.' };
    }
    if (tradeData.stop_loss !== null && tradeData.stop_loss === tradeData.entry_price) {
      return { success: false, data: null, error: 'Stop Loss cannot equal Entry Price.' };
    }
    if (tradeData.take_profit !== null && tradeData.take_profit === tradeData.entry_price) {
      return { success: false, data: null, error: 'Take Profit cannot equal Entry Price.' };
    }

    const data = await tradeService.createTrade(tradeData);
    invalidateCache('trades');
    return { success: true, data, error: null };
  } catch (e) {
    console.error('[STORAGE API] Save trade failed:', e);
    // Extract the most useful error message
    const errorMsg = e?.details || e?.message || (typeof e === 'string' ? e : 'Failed to execute trade log.');
    return { 
      success: false, 
      data: null, 
      error: errorMsg,
      code: e?.code 
    };
  }
}

export async function updateTrade(id, updates) {
  try {
    // Hardening: Enforce types for updates
    const hardenedUpdates = { ...updates };
    
    if (updates.entryPrice || updates.entry_price) hardenedUpdates.entry_price = parseFloat(updates.entryPrice || updates.entry_price) || 0;
    if (updates.stopLoss !== undefined || updates.stop_loss !== undefined) hardenedUpdates.stop_loss = parseFloat(updates.stopLoss || updates.stop_loss) || null;
    if (updates.takeProfit !== undefined || updates.take_profit !== undefined) hardenedUpdates.take_profit = parseFloat(updates.takeProfit || updates.take_profit) || null;
    if (updates.lotSize || updates.lot_size) hardenedUpdates.lot_size = parseFloat(updates.lotSize || updates.lot_size) || 0;
    if (updates.rr !== undefined) hardenedUpdates.rr = parseFloat(updates.rr) || 0;
    if (updates.pips !== undefined) hardenedUpdates.pips = parseFloat(updates.pips) || 0;
    if (updates.tradeDate || updates.trade_date) hardenedUpdates.trade_date = parseTradeDate(updates).toISOString();

    // Strict validation if updating prices
    if (hardenedUpdates.entry_price === 0) return { success: false, data: null, error: 'Entry price cannot be zero.' };
    if (hardenedUpdates.stop_loss !== null && hardenedUpdates.stop_loss !== undefined && hardenedUpdates.entry_price !== undefined && hardenedUpdates.stop_loss === hardenedUpdates.entry_price) {
      return { success: false, data: null, error: 'Stop Loss cannot equal Entry Price.' };
    }
    if (hardenedUpdates.take_profit !== null && hardenedUpdates.take_profit !== undefined && hardenedUpdates.entry_price !== undefined && hardenedUpdates.take_profit === hardenedUpdates.entry_price) {
      return { success: false, data: null, error: 'Take Profit cannot equal Entry Price.' };
    }

    // Cleanup
    const KEYS_TO_REMOVE = [
      'entryPrice', 'stopLoss', 'takeProfit', 'lotSize', 'tradeDate', 
      'smcTags', 'liquiditySweep', 'riskAmount', 'risk_amount',
      'timeframeBias', 'biasType', 'poiType'
    ];
    KEYS_TO_REMOVE.forEach(key => delete hardenedUpdates[key]);

    const data = await tradeService.updateTrade(id, hardenedUpdates);
    invalidateCache('trades');
    return { success: true, data, error: null };
  } catch (e) {
    console.error('[STORAGE API] Update trade failed:', e);
    const errorMsg = e?.details || e?.message || (typeof e === 'string' ? e : 'Failed to modify trade sequence.');
    return { 
      success: false, 
      data: null, 
      error: errorMsg,
      code: e?.code
    };
  }
}

export async function deleteTrade(id) {
  try {
    const data = await tradeService.deleteTrade(id);
    invalidateCache('trades');
    return { success: true, data, error: null };
  } catch (e) {
    console.error('[STORAGE API] Delete trade failed:', e?.message || e);
    return { success: false, data: null, error: 'Failed to erase trade log from ledger.' };
  }
}

// Strategies
export async function getStrategies(forceRefresh = false) {
  if (!forceRefresh && strategiesCache && Date.now() < strategiesCacheExp) {
    return { success: true, data: strategiesCache, error: null };
  }
  try {
    const dbStrategies = await strategyService.getStrategies() || [];
    // Merge defaults with DB strategies and deduplicate
    const combined = [...new Set([...DEFAULT_STRATEGIES, ...dbStrategies])]
      .filter(s => s && s.toLowerCase().trim() !== 'supply zonedemand zone');
    strategiesCache = combined;
    strategiesCacheExp = Date.now() + CACHE_TTL;
    return { success: true, data: combined, error: null };
  } catch (e) {
    console.error('[STORAGE API] Fetch strategies failed:', e?.message || e);
    return { success: false, data: DEFAULT_STRATEGIES, error: 'Using local strategy defaults.' };
  }
}

export async function addStrategy(name) {
  try {
    const data = await strategyService.addStrategy(name);
    invalidateCache('strategies');
    return { success: true, data, error: null };
  } catch (e) {
    return { success: false, data: null, error: 'Failed to inject custom strategy.' };
  }
}

export async function deleteStrategy(name) {
  try {
    const data = await strategyService.deleteStrategy(name);
    invalidateCache('strategies');
    return { success: true, data, error: null };
  } catch (e) {
    return { success: false, data: null, error: 'Failed to erase custom strategy.' };
  }
}

// Data Bridge: Local Storage to Cloud Migration
export async function migrateLocalToCloud() {
  const localTrades = JSON.parse(localStorage.getItem('smc_journal_trades') || localStorage.getItem('edge_ledger_trades') || '[]');
  const localStrategies = JSON.parse(localStorage.getItem('smc_journal_strategies') || localStorage.getItem('edge_ledger_strategies') || '[]');
  
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
  localStorage.removeItem('smc_journal_trades');
  localStorage.removeItem('smc_journal_strategies');
  localStorage.removeItem('edge_ledger_trades');
  localStorage.removeItem('edge_ledger_strategies');
  
  return { 
    success: true, 
    message: `Migration complete. Successfully moved ${migratedCount} trades and ${localStrategies.length} strategies to your SMC Journal cloud account.` 
  };
}

// Exports
export { INSTRUMENTS, SESSIONS, SMC_TAGS, LIQUIDITY_ZONES, DEFAULT_STRATEGIES, TIMEFRAME_BIAS, BIAS_TYPES, POI_TYPES };
