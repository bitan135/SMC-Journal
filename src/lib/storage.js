'use client';

// ============================================================
// EdgeLedger — Data Layer (localStorage)
// ============================================================

const STORAGE_KEYS = {
  TRADES: 'edgeledger_trades',
  STRATEGIES: 'edgeledger_strategies',
  SETTINGS: 'edgeledger_settings',
  SEEDED: 'edgeledger_seeded',
};

// -------------- Default Data --------------------

const DEFAULT_STRATEGIES = [
  'FVG Continuation',
  'Liquidity Sweep Reversal',
  'Breaker Block',
  'Mitigation Block',
  'Order Block Bounce',
  'CHoCH Reversal',
];

const INSTRUMENTS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'NAS100', 'US30', 'GBPJPY', 'AUDUSD',
];

const SESSIONS = ['London', 'New York', 'Asia'];

const SMC_TAGS = ['Liquidity Sweep', 'BOS', 'CHoCH', 'FVG', 'Order Block'];

const DEFAULT_SETTINGS = {
  accountBalance: 10000,
  defaultLotSize: 0.01,
  riskPercentage: 1,
  currency: 'USD',
};

// -------------- Utility Functions --------------------

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
  
  // JPY pairs & Gold have different pip values
  if (instrument?.includes('JPY')) {
    return parseFloat((diff * 100).toFixed(1));
  }
  if (instrument?.includes('XAU') || instrument?.includes('GOLD')) {
    return parseFloat((diff * 10).toFixed(1));
  }
  if (instrument?.includes('NAS') || instrument?.includes('US30')) {
    return parseFloat(diff.toFixed(1));
  }
  return parseFloat((diff * 10000).toFixed(1));
}

export function calculateRiskAmount(lotSize, pips, instrument) {
  if (!lotSize || !pips) return 0;
  const lot = parseFloat(lotSize);
  // Rough pip value calculations
  if (instrument?.includes('NAS') || instrument?.includes('US30')) {
    return parseFloat((lot * pips).toFixed(2));
  }
  if (instrument?.includes('XAU') || instrument?.includes('GOLD')) {
    return parseFloat((lot * 100 * pips / 10).toFixed(2));
  }
  if (instrument?.includes('JPY')) {
    return parseFloat((lot * 100000 * pips / 100).toFixed(2));
  }
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
  const totalLossRR = losses.reduce((sum, t) => sum + 1, 0); // Each loss = 1R
  
  if (totalLossRR === 0) return totalWinRR > 0 ? 999 : 0;
  return parseFloat((totalWinRR / totalLossRR).toFixed(2));
}

export function getAverageRR(trades) {
  const wins = trades.filter(t => t.result === 'Win');
  if (!wins.length) return 0;
  const avg = wins.reduce((sum, t) => sum + (t.rr || 0), 0) / wins.length;
  return parseFloat(avg.toFixed(2));
}

export function getEquityCurve(trades) {
  const sorted = [...trades].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  let balance = 0;
  return sorted.map((trade, i) => {
    if (trade.result === 'Win') {
      balance += (trade.rr || 1);
    } else if (trade.result === 'Loss') {
      balance -= 1;
    }
    return {
      trade: i + 1,
      balance: parseFloat(balance.toFixed(2)),
      date: new Date(trade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      result: trade.result,
    };
  });
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
  
  return Object.entries(groups).map(([name, data]) => ({
    name,
    trades: data.total,
    winRate: parseFloat(((data.wins / data.total) * 100).toFixed(1)),
    avgRR: data.wins > 0 ? parseFloat((data.totalRR / data.wins).toFixed(2)) : 0,
    wins: data.wins,
    losses: data.total - data.wins,
  })).sort((a, b) => b.trades - a.trades);
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

// -------------- Storage Operations --------------------

function getFromStorage(key) {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveToStorage(key, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage save failed:', e);
  }
}

// Trades
export function getTrades() {
  return getFromStorage(STORAGE_KEYS.TRADES) || [];
}

export function saveTrade(trade) {
  const trades = getTrades();
  const newTrade = {
    ...trade,
    id: trade.id || crypto.randomUUID(),
    createdAt: trade.createdAt || new Date().toISOString(),
  };
  trades.push(newTrade);
  saveToStorage(STORAGE_KEYS.TRADES, trades);
  return newTrade;
}

export function updateTrade(id, updates) {
  const trades = getTrades();
  const idx = trades.findIndex(t => t.id === id);
  if (idx === -1) return null;
  trades[idx] = { ...trades[idx], ...updates };
  saveToStorage(STORAGE_KEYS.TRADES, trades);
  return trades[idx];
}

export function deleteTrade(id) {
  const trades = getTrades().filter(t => t.id !== id);
  saveToStorage(STORAGE_KEYS.TRADES, trades);
}

// Strategies
export function getStrategies() {
  return getFromStorage(STORAGE_KEYS.STRATEGIES) || DEFAULT_STRATEGIES;
}

export function saveStrategies(strategies) {
  saveToStorage(STORAGE_KEYS.STRATEGIES, strategies);
}

export function addStrategy(name) {
  const strategies = getStrategies();
  if (!strategies.includes(name)) {
    strategies.push(name);
    saveStrategies(strategies);
  }
  return strategies;
}

export function removeStrategy(name) {
  const strategies = getStrategies().filter(s => s !== name);
  saveStrategies(strategies);
  return strategies;
}

// Settings
export function getSettings() {
  return { ...DEFAULT_SETTINGS, ...(getFromStorage(STORAGE_KEYS.SETTINGS) || {}) };
}

export function saveSettings(settings) {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
}

// Export/Import
export function exportAllData() {
  return {
    trades: getTrades(),
    strategies: getStrategies(),
    settings: getSettings(),
    exportedAt: new Date().toISOString(),
  };
}

export function importAllData(data) {
  if (data.trades) saveToStorage(STORAGE_KEYS.TRADES, data.trades);
  if (data.strategies) saveToStorage(STORAGE_KEYS.STRATEGIES, data.strategies);
  if (data.settings) saveToStorage(STORAGE_KEYS.SETTINGS, data.settings);
}

export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}

// -------------- Seed Data --------------------

export function seedDemoData() {
  if (typeof window === 'undefined') return;
  if (getFromStorage(STORAGE_KEYS.SEEDED)) return;
  
  const demoTrades = [];
  const now = new Date();
  
  const tradeConfigs = [
    { instrument: 'EURUSD', strategy: 'FVG Continuation', session: 'London', result: 'Win', rr: 2.1, direction: 'Buy', entry: 1.0850, sl: 1.0830, tp: 1.0892, lot: 0.1, tags: ['FVG', 'BOS'], notes: 'Clean FVG fill after London open. BOS confirmed on M15.' },
    { instrument: 'NAS100', strategy: 'Liquidity Sweep Reversal', session: 'New York', result: 'Win', rr: 3.2, direction: 'Sell', entry: 18450, sl: 18490, tp: 18322, lot: 0.5, tags: ['Liquidity Sweep', 'CHoCH'], notes: 'Swept previous day high, CHoCH on M5.' },
    { instrument: 'GBPUSD', strategy: 'Breaker Block', session: 'London', result: 'Loss', rr: 1.5, direction: 'Buy', entry: 1.2650, sl: 1.2630, tp: 1.2680, lot: 0.1, tags: ['Order Block', 'BOS'], notes: 'Breaker block entry, got stopped out before move.' },
    { instrument: 'XAUUSD', strategy: 'FVG Continuation', session: 'New York', result: 'Win', rr: 1.8, direction: 'Buy', entry: 2025.50, sl: 2020.00, tp: 2035.40, lot: 0.05, tags: ['FVG', 'Liquidity Sweep'], notes: 'Gold swept asia low then pushed up. FVG on M15.' },
    { instrument: 'EURUSD', strategy: 'Order Block Bounce', session: 'London', result: 'Win', rr: 2.5, direction: 'Sell', entry: 1.0920, sl: 1.0940, tp: 1.0870, lot: 0.15, tags: ['Order Block', 'FVG'], notes: 'H1 Order Block rejection during London session.' },
    { instrument: 'USDJPY', strategy: 'Liquidity Sweep Reversal', session: 'Asia', result: 'Loss', rr: 1.2, direction: 'Buy', entry: 150.20, sl: 149.90, tp: 150.56, lot: 0.1, tags: ['Liquidity Sweep'], notes: 'Asia range sweep, but no follow through.' },
    { instrument: 'GBPJPY', strategy: 'CHoCH Reversal', session: 'London', result: 'Win', rr: 2.8, direction: 'Sell', entry: 191.50, sl: 191.80, tp: 190.66, lot: 0.08, tags: ['CHoCH', 'FVG'], notes: 'Beautiful CHoCH on M15 after London open manipulation.' },
    { instrument: 'NAS100', strategy: 'FVG Continuation', session: 'New York', result: 'Win', rr: 1.5, direction: 'Buy', entry: 18200, sl: 18160, tp: 18260, lot: 0.5, tags: ['FVG', 'BOS'], notes: 'FVG on M5 after NY open. Quick scalp.' },
    { instrument: 'EURUSD', strategy: 'Mitigation Block', session: 'London', result: 'Loss', rr: 1.8, direction: 'Buy', entry: 1.0810, sl: 1.0790, tp: 1.0846, lot: 0.1, tags: ['Order Block'], notes: 'Mitigation block didn\'t hold. Weak momentum.' },
    { instrument: 'XAUUSD', strategy: 'Liquidity Sweep Reversal', session: 'New York', result: 'Win', rr: 2.4, direction: 'Sell', entry: 2040.00, sl: 2045.00, tp: 2028.00, lot: 0.05, tags: ['Liquidity Sweep', 'CHoCH', 'FVG'], notes: 'Swept weekly high, M15 CHoCH + FVG.' },
    { instrument: 'US30', strategy: 'Breaker Block', session: 'New York', result: 'Win', rr: 1.9, direction: 'Buy', entry: 39200, sl: 39150, tp: 39295, lot: 0.3, tags: ['BOS', 'Order Block'], notes: 'Breaker block retest after BOS on H1.' },
    { instrument: 'GBPUSD', strategy: 'FVG Continuation', session: 'London', result: 'Win', rr: 2.3, direction: 'Buy', entry: 1.2700, sl: 1.2680, tp: 1.2746, lot: 0.12, tags: ['FVG', 'BOS'], notes: 'M15 FVG after London killzone. Clean setup.' },
    { instrument: 'EURUSD', strategy: 'FVG Continuation', session: 'New York', result: 'Loss', rr: 2.0, direction: 'Sell', entry: 1.0870, sl: 1.0890, tp: 1.0830, lot: 0.1, tags: ['FVG'], notes: 'Tried to catch NY reversal, got caught in consolidation.' },
    { instrument: 'NAS100', strategy: 'CHoCH Reversal', session: 'New York', result: 'Win', rr: 2.7, direction: 'Sell', entry: 18350, sl: 18390, tp: 18242, lot: 0.5, tags: ['CHoCH', 'Liquidity Sweep'], notes: 'M5 CHoCH after sweeping NY AM high.' },
    { instrument: 'AUDUSD', strategy: 'Order Block Bounce', session: 'Asia', result: 'Loss', rr: 1.5, direction: 'Buy', entry: 0.6550, sl: 0.6535, tp: 0.6572, lot: 0.1, tags: ['Order Block'], notes: 'Asia session OB, low volatility killed the trade.' },
    { instrument: 'XAUUSD', strategy: 'FVG Continuation', session: 'London', result: 'Win', rr: 3.1, direction: 'Buy', entry: 2015.00, sl: 2010.00, tp: 2030.50, lot: 0.05, tags: ['FVG', 'BOS', 'Liquidity Sweep'], notes: 'London open sweep of Asia low, BOS + FVG on M15. Held for full TP.' },
    { instrument: 'GBPUSD', strategy: 'Liquidity Sweep Reversal', session: 'New York', result: 'Win', rr: 1.6, direction: 'Sell', entry: 1.2780, sl: 1.2800, tp: 1.2748, lot: 0.1, tags: ['Liquidity Sweep', 'CHoCH'], notes: 'NY session liquidity grab above London high.' },
    { instrument: 'EURUSD', strategy: 'CHoCH Reversal', session: 'London', result: 'Win', rr: 2.0, direction: 'Buy', entry: 1.0800, sl: 1.0785, tp: 1.0830, lot: 0.15, tags: ['CHoCH', 'FVG'], notes: 'Early London CHoCH after overnight consolidation.' },
    { instrument: 'US30', strategy: 'FVG Continuation', session: 'New York', result: 'Loss', rr: 1.3, direction: 'Sell', entry: 39100, sl: 39140, tp: 39048, lot: 0.3, tags: ['FVG'], notes: 'FVG fill but market reversed. Should have waited for confirmation.' },
    { instrument: 'GBPJPY', strategy: 'FVG Continuation', session: 'London', result: 'Win', rr: 2.6, direction: 'Buy', entry: 190.80, sl: 190.50, tp: 191.58, lot: 0.08, tags: ['FVG', 'BOS', 'Order Block'], notes: 'London killzone FVG with confluence from H1 OB.' },
  ];
  
  tradeConfigs.forEach((config, i) => {
    const daysAgo = tradeConfigs.length - i + Math.floor(Math.random() * 3);
    const tradeDate = new Date(now);
    tradeDate.setDate(tradeDate.getDate() - daysAgo);
    tradeDate.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));
    
    demoTrades.push({
      id: crypto.randomUUID(),
      instrument: config.instrument,
      direction: config.direction,
      entryPrice: config.entry.toString(),
      stopLoss: config.sl.toString(),
      takeProfit: config.tp.toString(),
      lotSize: config.lot.toString(),
      result: config.result,
      rr: config.rr,
      session: config.session,
      strategy: config.strategy,
      smcTags: config.tags,
      notes: config.notes,
      screenshotBefore: null,
      screenshotAfter: null,
      createdAt: tradeDate.toISOString(),
    });
  });
  
  saveToStorage(STORAGE_KEYS.TRADES, demoTrades);
  saveToStorage(STORAGE_KEYS.SEEDED, true);
}

// Constants exports
export { INSTRUMENTS, SESSIONS, SMC_TAGS, DEFAULT_STRATEGIES };
