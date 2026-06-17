/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShopItem, PetConfig } from '../types';
import { playCoinSynth, playErrorBuzz } from '../utils/sound';
import { ShoppingCart, Heart, Shield, Ticket, Star, Activity, CheckCircle, Clock, Package, ArrowRight } from 'lucide-react';

interface ClubStoreProps {
  coins: number;
  pet: PetConfig | null;
  shopItems: ShopItem[];
  purchasedGifts: { itemId: string; redeemedAt: number; code: string }[];
  inventory: { [itemId: string]: number };
  onPurchaseItem: (itemId: string) => void;
  onPurchaseRealGift: (itemId: string, code: string) => void;
}

export default function ClubStore({
  coins,
  pet,
  shopItems,
  purchasedGifts,
  inventory,
  onPurchaseItem,
  onPurchaseRealGift,
}: ClubStoreProps) {
  const [activeTab, setActiveTab] = useState<'entertain' | 'pragmatic'>('entertain');
  const [notification, setNotification] = useState<string>('');

  const realGiftsCount = purchasedGifts.length;
  const itemsPurchasedCount = Object.values(inventory).reduce((a, b) => a + b, 0);

  const totalActions = realGiftsCount + itemsPurchasedCount;
  const spendRatio = totalActions > 0 ? (itemsPurchasedCount / totalActions) * 100 : 50;
  const saveRatio = totalActions > 0 ? (realGiftsCount / totalActions) * 100 : 50;

  // Render food options filtered
  const foodItems = shopItems.filter(item => item.type === 'FOOD' || item.type === 'TOY');
  const realGiftItems = shopItems.filter(item => item.type === 'REAL_GIFT');

  const handleBuyItem = (item: ShopItem) => {
    if (coins < item.cost) {
      setNotification('🪙 金幣不足！解一些賞金任務賺取 OS 金幣吧！');
      playErrorBuzz();
      return;
    }

    onPurchaseItem(item.id);
    setNotification(`📦 成功購買 ${item.title}！已收入背包。`);
    playCoinSynth();
  };

  const generateClaimCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'OS-G-';
    for (let i = 0; i < 8; i++) {
      if (i === 4) code += '-';
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleBuyRealGift = (item: ShopItem) => {
    if (coins < item.cost) {
      setNotification('🪙 金幣不足！無法兌換實體獎品，存多點再去買吧！');
      playErrorBuzz();
      return;
    }

    if (item.stock <= 0) {
      setNotification('📦 抱歉！該禮物已被搶購一空囉！');
      playErrorBuzz();
      return;
    }

    if (window.confirm(`確定要花費 ${item.cost} OS Coins 兌換【${item.title}】嗎？\n兌換後將會產生領取憑證碼，請務必截圖保存。`)) {
      const uniqueCode = generateClaimCode();
      onPurchaseRealGift(item.id, uniqueCode);
      playCoinSynth();
      setNotification(`🎁 成功兌換 ${item.title}！已生成實體憑證：${uniqueCode}`);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl" id="club-store">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-emerald-400" /> OS 決策商城
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">到底該花費在眼前的萌寵，還是忍痛存到期末換豐富宵夜呢？這是場深刻的心智決策！</p>
      </div>

      <div className="mb-6 p-4 bg-slate-950/60 rounded-xl border border-slate-850">
        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">
          <span className="flex items-center gap-1 text-pink-400">
            <Heart className="w-3.5 h-3.5" /> 娛樂飼養派 (Spend)
          </span>
          <span className="text-slate-400 font-mono">天平 (Save vs Spend)</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <Shield className="w-3.5 h-3.5" /> 務實期末省下派 (Save)
          </span>
        </div>

        <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden flex p-0.5 border border-slate-800/80">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-l-full transition-all duration-500"
            style={{ width: `${spendRatio}%` }}
          />
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-r-full transition-all duration-500"
            style={{ width: `${saveRatio}%` }}
          />
        </div>
      </div>

      {notification && (
        <div className="mb-4 p-3 bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center justify-between gap-2 animate-pulse">
          <span>{notification}</span>
          <button onClick={() => setNotification('')} className="text-emerald-500 font-bold hover:text-white">✕</button>
        </div>
      )}

      <div className="flex border-b border-slate-850 mb-5">
        <button
          onClick={() => setActiveTab('entertain')}
          className={`flex-1 py-2 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'entertain' ? 'border-pink-500 text-pink-300' : 'border-transparent text-slate-400 hover:text-slate-350'
          }`}
        >
          🧁 寵物商店 (背包收藏)
        </button>
        <button
          onClick={() => setActiveTab('pragmatic')}
          className={`flex-1 py-2 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'pragmatic' ? 'border-emerald-500 text-emerald-300' : 'border-transparent text-slate-400 hover:text-slate-350'
          }`}
        >
          🎁 實體福利兌換
        </button>
      </div>

      {activeTab === 'entertain' && (
        <div>
          <div className="grid grid-cols-1 gap-3">
            {foodItems.map((item) => (
              <div key={item.id} className="p-3.5 bg-slate-950/50 border border-slate-850 hover:border-pink-500/30 rounded-xl flex flex-col justify-between gap-3 relative overflow-hidden group transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[10px] font-bold">
                      {item.type === 'TOY' ? '玩具配件' : '寵物食品'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-2">{item.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">{item.description}</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.satietyValue && item.satietyValue > 0 && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        <Activity className="w-3 h-3" />
                        +{item.satietyValue} 飽食
                      </span>
                    )}
                    {item.affectionValue && item.affectionValue > 0 && (
                      <span className="text-[10px] font-bold text-rose-400 flex items-center gap-0.5 bg-rose-500/10 px-1.5 py-0.5 rounded">
                        <Heart className="w-3 h-3" />
                        +{item.affectionValue} 好感
                      </span>
                    )}
                    {item.expValue && item.expValue > 0 && (
                      <span className="text-[10px] font-bold text-violet-400 flex items-center gap-0.5 bg-violet-500/10 px-1.5 py-0.5 rounded">
                        <Star className="w-3 h-3" />
                        +{item.expValue} 經驗
                      </span>
                    )}
                    {inventory[item.id] > 0 && (
                      <span className="text-[10px] font-bold text-slate-300 flex items-center gap-0.5 bg-slate-800 px-1.5 py-0.5 rounded ml-auto border border-slate-700">
                        <Package className="w-3 h-3" />
                        擁有: {inventory[item.id]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-900/60 pt-3">
                  <span className="text-xs text-amber-400 font-mono font-bold">🪙 {item.cost} OS Coins</span>
                  <button
                    onClick={() => handleBuyItem(item)}
                    className="px-3 py-1 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-lg transition-transform hover:scale-[1.03] cursor-pointer"
                  >
                    立刻購買 🧺
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'pragmatic' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {realGiftItems.map((item) => (
              <div key={item.id} className="p-3.5 bg-slate-950/50 border border-slate-850 hover:border-emerald-500/30 rounded-xl flex flex-col justify-between gap-3 relative overflow-hidden group transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold">
                      實物期末獎 (剩餘: {item.stock})
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-2">{item.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">{item.description}</p>
                  <p className="text-[10px] text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 rounded mt-2 inline-block">
                    📢 {item.redemptionNote}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-900/60 pt-3 mt-1">
                  <span className="text-xs text-amber-400 font-mono font-bold">🪙 {item.cost} OS Coins</span>
                  <button
                    onClick={() => handleBuyRealGift(item)}
                    disabled={item.stock <= 0}
                    className={`px-3 py-1 font-bold text-xs rounded-lg transition-transform hover:scale-[1.03] cursor-pointer ${
                      item.stock <= 0
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {item.stock <= 0 ? '已售罄 📦' : '兌換禮品 🏷️'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {purchasedGifts.length > 0 && (
            <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 mt-5">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                <Ticket className="w-4 h-4 text-emerald-400" /> 已兌換實體提貨憑證 (期末憑證)
              </h3>

              <div className="grid grid-cols-1 gap-3 max-h-[180px] overflow-y-auto pr-2">
                {purchasedGifts.map((gift, idx) => {
                  const shopItem = shopItems.find(item => item.id === gift.itemId);
                  if (!shopItem) return null;

                  return (
                    <div key={`${gift.itemId}_${idx}`} className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs relative overflow-hidden">
                      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none font-bold text-3xl font-mono rotate-12 -mr-2">OS</div>
                      
                      <div className="flex items-center justify-between mb-1.5 border-b border-slate-850 pb-1.5">
                        <span className="font-bold text-slate-100 flex items-center gap-1">
                          <span>{shopItem.icon}</span> {shopItem.title}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(gift.redeemedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400">社團提貨代碼為：</span>
                        <code className="text-xs text-yellow-300 font-mono font-bold bg-slate-950 px-2.5 py-1 rounded border border-slate-850 tracking-widest text-center select-all block">
                          {gift.code}
                        </code>
                        <span className="text-[9px] text-emerald-400 font-medium mt-1 flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3 text-emerald-400" /> {shopItem.redemptionNote}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
