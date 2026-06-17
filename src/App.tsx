/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameSaveState, PetConfig, Task, PetType, PetBreed, ShopItem, FortuneResult, HelpClaimRequest, Post } from './types';
import PetDashboard from './components/PetDashboard';
import BountyBoard from './components/BountyBoard';
import ClubStore from './components/ClubStore';
import DailyGacha from './components/DailyGacha';
import SocialFeed from './components/SocialFeed';
import { playLevelUpSynth, playCoinSynth, playErrorBuzz } from './utils/sound';
import { Shield, Sparkles, AlertCircle, Info, Heart, Award, Cpu, Flame, Terminal, HelpCircle, Compass, History } from 'lucide-react';

// Default mock shop setup
const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  // CAT foods
  { id: 'food_cat_tuna', type: 'FOOD', title: '🐟 頂級極鮮鮪魚罐罐', description: '貓咪最愛的高級鮪魚。吃了毛髮亮麗，體力倍增。', cost: 15, icon: '🐟', satietyValue: 25, expValue: 40, affectionValue: 5, stock: 999 },
  { id: 'food_cat_grass', type: 'FOOD', title: '🌱 有機舒壓貓草軟糖', description: '傲嬌貓咪必備！能安撫情緒，並微幅提升程式專注力。', cost: 10, icon: '🌱', satietyValue: 15, expValue: 20, affectionValue: 10, stock: 999 },
  // DOG foods
  { id: 'food_dog_bone', type: 'FOOD', title: '🦴 永不磨損開源大骨', description: '特殊尼龍材質開源咬骨，能鍛鍊咬合力，讓開源犬精力充沛！', cost: 15, icon: '🦴', satietyValue: 25, expValue: 40, affectionValue: 5, stock: 999 },
  { id: 'food_dog_beef', type: 'FOOD', title: '🥩 高蛋白炭烤神戶牛肉', description: '肉香四溢的高熱量牛肉乾！能讓狗狗高興地轉三個圈圈。', cost: 25, icon: '🥩', satietyValue: 45, expValue: 70, affectionValue: 10, stock: 999 },
  // MECH Chargers
  { id: 'charge_lithium', type: 'FOOD', title: '🔋 高能鋰離子原電池 (3S)', description: '機甲專用高能快充電池，電量飽滿，散熱極優。', cost: 15, icon: '🔋', satietyValue: 25, expValue: 40, affectionValue: 5, stock: 999 },
  { id: 'charge_nuclear', type: 'FOOD', title: '⚛️ 微型冷核融合核心模組', description: '提供不竭的量子運算電力，並啟動極光級 LED 電音特效。', cost: 35, icon: '⚛️', satietyValue: 60, expValue: 100, affectionValue: 10, stock: 999 },
  // TOYS
  { id: 'toy_laser', type: 'TOY', title: '🔴 追蹤全息激光筆', description: '瘋狂消耗毛孩的精力！大幅提升好感度與少許經驗。', cost: 12, icon: '🔴', affectionValue: 15, expValue: 15, stock: 999 },
  { id: 'toy_ball', type: 'TOY', title: '🎾 超彈力網球', description: '拋接遊戲必備！不僅提振好感，還能稍微回復飽食（因為吃零食獎勵）。', cost: 12, icon: '🎾', satietyValue: 5, affectionValue: 15, expValue: 10, stock: 999 },
  
  // REAL PRIZE Gifts (期末實體兌換)
  { id: 'gift_sticker', type: 'REAL_GIFT', title: '🎨 開源守護社團紀念貼紙', description: '極光雷射防水貼紙，貼在筆電背蓋上直接顯現黑客本色。', cost: 30, icon: '🎨', stock: 100, redemptionNote: '至社辦找副社長(筱雅)憑代碼領取實體' },
  { id: 'gift_noodle', type: 'REAL_GIFT', title: '🍜 傳說夜點：雙倍維力炸醬麵與蛋', description: '寫 code 熬夜必備之神！豪華版附帶爆漿煎蛋與熱騰騰紫菜湯。', cost: 180, icon: '🍜', stock: 15, redemptionNote: '社團期末大會憑領取號碼牌實體盛裝領取' },
  { id: 'gift_question', type: 'REAL_GIFT', title: '🎓 免排隊問學長姐課業解難扣打', description: '期末考週救星！可憑此券至 Discord 高級 VIP 頻道，享有插隊提問大師解答之權。', cost: 120, icon: '🎓', stock: 40, redemptionNote: '憑此碼至 Discord 技術頻道私訊值班學長姐插隊提問' },
  { id: 'gift_sofa', type: 'REAL_GIFT', title: '🛋️ 社辦豪華大沙發專享躺位 2 小時', description: '社辦大沙發上最高級的躺平權利，自帶極靜隔音耳罩。', cost: 85, icon: '🛋️', stock: 6, redemptionNote: '憑票面代碼向當日值班幹部登記使用躺椅優先權' },
  { id: 'gift_vip_row', type: 'REAL_GIFT', title: '🎫 頂級景觀社課第一排 VIP 保留座', description: '每次社課第一排正中央視野最高級的位置，能最佳觀摩講義簡報。', cost: 60, icon: '🎫', stock: 18, redemptionNote: '社課前半小時憑代碼向課堂助教兌換該次座位' }
];

const INITIAL_TASKS: Task[] = [
  { id: 'daily_punch', category: 'daily', title: '[日常] 每日進入網頁簽到', description: '每日簽到好習慣，累積開源硬實力。', reward: 10, completed: false },
  { id: 'attend_class', category: 'daily', title: '[日常] 參加社課代碼驗證', description: '實體社課黑板上將公佈通關字串。', reward: 50, completed: false },
  { id: 'submit_pr', category: 'legendary', title: '[傳說] 提交 PR 到開源專案', description: '為更美好的世界程式鏈貢獻己力！', reward: 500, completed: false }
];

const INITIAL_POSTS: Post[] = [
  { id: 'post_1', author: '筱雅 (副社)', content: '這個週末打算把社團的 CI/CD 流程大更新！我的黑貓已經胖到走不動了 😂', timestamp: Date.now() - 3600000, likes: 5, isUser: false },
  { id: 'post_2', author: '小明學長', content: '有沒有人期末考需要求救的？可以用 OS COINS 換免排隊喔！', timestamp: Date.now() - 7200000, likes: 12, isUser: false },
];

export default function App() {
  const [gameState, setGameState] = useState<GameSaveState>(() => {
    const saved = localStorage.getItem('os_guardian_save');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure standard tasks are present
        if (!parsed.tasks || parsed.tasks.length === 0) parsed.tasks = INITIAL_TASKS;
        if (!parsed.shopItems || !parsed.shopItems.find((i: ShopItem) => i.type === 'TOY')) parsed.shopItems = DEFAULT_SHOP_ITEMS;
        if (!parsed.pets) parsed.pets = parsed.pet ? [parsed.pet] : [];
        if (!parsed.activePetId && parsed.pets.length > 0) parsed.activePetId = parsed.pets[0].id;
        if (!parsed.inventory) parsed.inventory = {};
        if (!parsed.posts) parsed.posts = INITIAL_POSTS;
        
        // delete old pet field if necessary
        delete parsed.pet;
        
        return parsed;
      } catch (e) {
        console.warn('Load state error, resetting default', e);
      }
    }
    return {
      coins: 120, // Start with some initial pocket coin so they can prototype easily
      pets: [],
      activePetId: null,
      inventory: {},
      tasks: INITIAL_TASKS,
      shopItems: DEFAULT_SHOP_ITEMS,
      recentFortunes: [],
      helpClaims: [],
      adminCodeSession: 'OPEN_OS_2026', // Initial technology course black board password
      purchasedGifts: [],
      posts: INITIAL_POSTS
    };
  });

  // Save changes to local storage whenever game state changes
  useEffect(() => {
    localStorage.setItem('os_guardian_save', JSON.stringify(gameState));
  }, [gameState]);

  // Daily task resets and hunger/energy decay interval loop
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Reset daily punch and attendance daily tasks on calendar switch
    const taskResetCheck = () => {
      setGameState((prev) => {
        let isTaskModified = false;
        const checkedTasks = prev.tasks.map((task) => {
          if (task.category === 'daily' && task.completed && task.lastCompletedDate !== todayStr) {
            isTaskModified = true;
            return { ...task, completed: false };
          }
          return task;
        });

        if (isTaskModified) {
          return { ...prev, tasks: checkedTasks };
        }
        return prev;
      });
    };

    taskResetCheck();

    // 2. Hunger Satiety / Power discharge tick (reduce 1% every 45s)
    const decayTimer = setInterval(() => {
      setGameState((prev) => {
        if (prev.pets.length === 0) return prev;
        
        let petsModified = false;
        const decayedPets = prev.pets.map(pet => {
          const currentSatiety = pet.satiety;
          if (currentSatiety > 0) {
            petsModified = true;
            return { ...pet, satiety: Math.max(0, currentSatiety - 1) };
          }
          return pet;
        });
        
        if (!petsModified) return prev;
        
        return {
          ...prev,
          pets: decayedPets
        };
      });
    }, 45000);

    return () => clearInterval(decayTimer);
  }, [gameState.pets]);

  // Adoption trigger
  const handleAdopt = (type: PetType, breed: PetBreed, name: string) => {
    const newId = `pet_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const freshPet: PetConfig = {
      id: newId,
      type,
      breed,
      name,
      level: 1,
      exp: 0,
      satiety: 80, // Start healthy
      affection: 20, // Initial affection
      lastFedTime: Date.now()
    };

    setGameState((prev) => ({
      ...prev,
      pets: [...prev.pets, freshPet],
      activePetId: newId // Set newest adpoted pet as active
    }));
  };

  const handleSetActivePet = (id: string) => {
    setGameState((prev) => ({
      ...prev,
      activePetId: id
    }));
  };

  const handleReleasePet = (petId: string) => {
    if (window.confirm('確定要捨棄目前的寵物嗎？這是不可逆的決定喔！')) {
      setGameState((prev) => {
        const updatedPets = prev.pets.filter(p => p.id !== petId);
        return {
          ...prev,
          pets: updatedPets,
          activePetId: updatedPets.length > 0 ? updatedPets[0].id : null
        };
      });
    }
  };

  // Rename active pet
  const handleRenamePet = (newName: string) => {
    setGameState((prev) => {
      if (!prev.activePetId) return prev;
      return {
        ...prev,
        pets: prev.pets.map(p => p.id === prev.activePetId ? { ...p, name: newName } : p)
      };
    });
  };
  
  // Free interactions (Affection boosts)
  const handleInteract = (interactionType: 'PET' | 'WALK') => {
    setGameState((prev) => {
      if (!prev.activePetId) return prev;
      
      return {
        ...prev,
        pets: prev.pets.map(p => {
          if (p.id === prev.activePetId) {
            const affectionBoost = interactionType === 'PET' ? 2 : 5;
            const satietyDrop = interactionType === 'WALK' ? 3 : 0;
            return {
              ...p,
              affection: Math.min(100, p.affection + affectionBoost),
              satiety: Math.max(0, p.satiety - satietyDrop)
            };
          }
          return p;
        })
      };
    });
  };

  // Task claim complete
  const handleCompleteTask = (taskId: string, coinsGain: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    setGameState((prev) => {
      const updatedTasks = prev.tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            completed: true,
            lastCompletedDate: todayStr
          };
        }
        return t;
      });

      return {
        ...prev,
        coins: prev.coins + coinsGain,
        tasks: updatedTasks
      };
    });
  };

  // Admin session code change
  const handleSetAdminCodeSession = (newCode: string) => {
    setGameState((prev) => ({
      ...prev,
      adminCodeSession: newCode
    }));
  };

  // Add Honor Q&A Submission claim
  const handleAddHelpClaim = (claim: HelpClaimRequest) => {
    setGameState((prev) => ({
      ...prev,
      helpClaims: [...prev.helpClaims, claim]
    }));
  };

  // Approve Q&A claim
  const handleApproveClaim = (claimId: string, coinsReward: number) => {
    setGameState((prev) => {
      const targetClaim = prev.helpClaims.find(c => c.id === claimId);
      if (!targetClaim || targetClaim.status !== 'PENDING') return prev;

      const updatedClaims = prev.helpClaims.map((c) => {
        if (c.id === claimId) {
          return {
            ...c,
            status: 'APPROVED' as const,
            reviewComment: '🛡️ 系統已自動複核通過！辛苦你在社群回覆，100 OS金幣已到手✨'
          };
        }
        return c;
      });

      return {
        ...prev,
        coins: prev.coins + coinsReward,
        helpClaims: updatedClaims
      };
    });
  };

  const handleRejectClaim = (claimId: string) => {
    setGameState((prev) => {
      const updatedClaims = prev.helpClaims.map((c) => {
        if (c.id === claimId) {
          return {
            ...c,
            status: 'REJECTED' as const,
            reviewComment: '❌ 內容審查不完整，請填寫更詳細的解答步驟說明後重新送審。'
          };
        }
        return c;
      });
      return {
        ...prev,
        helpClaims: updatedClaims
      };
    });
  };

  // Spend A: Buy items and store them in inventory
  const handlePurchaseItem = (itemId: string) => {
    setGameState((prev) => {
      const item = prev.shopItems.find(i => i.id === itemId);
      if (!item || prev.coins < item.cost) return prev;

      const currentQty = prev.inventory[itemId] || 0;

      return {
        ...prev,
        coins: prev.coins - item.cost,
        inventory: {
          ...prev.inventory,
          [itemId]: currentQty + 1
        }
      };
    });
  };
  
  // Feed/Use Toy from Inventory
  const handleUseItemFromInventory = (itemId: string, petId: string) => {
    setGameState((prev) => {
      const currentQty = prev.inventory[itemId] || 0;
      const itemConfig = prev.shopItems.find(i => i.id === itemId);
      const targetPet = prev.pets.find(p => p.id === petId);
      
      if (currentQty <= 0 || !itemConfig || !targetPet) return prev;
      
      const satietyValue = itemConfig.satietyValue || 0;
      const expValue = itemConfig.expValue || 0;
      const affectionValue = itemConfig.affectionValue || 0;

      let newExp = targetPet.exp + expValue;
      let newLevel = targetPet.level;
      let neededExp = newLevel * 100;
      let leveledUp = false;

      while (newExp >= neededExp && newLevel < 10) {
        newExp = newExp - neededExp;
        newLevel += 1;
        neededExp = newLevel * 100;
        leveledUp = true;
      }

      if (leveledUp) {
        setTimeout(() => {
          playLevelUpSynth();
        }, 800);
      }
      
      const newInventory = { ...prev.inventory };
      newInventory[itemId] -= 1;
      if (newInventory[itemId] <= 0) delete newInventory[itemId];

      return {
        ...prev,
        inventory: newInventory,
        pets: prev.pets.map(p => {
          if (p.id === petId) {
            return {
              ...p,
              exp: newLevel >= 10 ? 0 : newExp,
              level: newLevel,
              satiety: Math.min(100, p.satiety + satietyValue),
              affection: Math.min(100, p.affection + affectionValue),
              lastFedTime: itemConfig.type === 'FOOD' ? Date.now() : p.lastFedTime
            };
          }
          return p;
        })
      };
    });
  };

  // Spend B: Save funds and buy Real Club session products
  const handlePurchaseRealGift = (itemId: string, code: string) => {
    setGameState((prev) => {
      const item = prev.shopItems.find(i => i.id === itemId);
      if (!item || prev.coins < item.cost || item.stock <= 0) return prev;

      // Deduct stock, log purchase code ledger
      const updatedShopItems = prev.shopItems.map((sh) => {
        if (sh.id === itemId) {
          return { ...sh, stock: Math.max(0, sh.stock - 1) };
        }
        return sh;
      });

      const newGiftPurchase = {
        itemId,
        redeemedAt: Date.now(),
        code
      };

      return {
        ...prev,
        coins: prev.coins - item.cost,
        shopItems: updatedShopItems,
        purchasedGifts: [...prev.purchasedGifts, newGiftPurchase]
      };
    });
  };

  // Add draw fortune
  const handleDrawFortune = (result: FortuneResult) => {
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins - 5,
      recentFortunes: [...prev.recentFortunes, result]
    }));
  };
  
  // Social Feed Handlers
  const handleAddPost = (content: string) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: '我 (目前用戶)',
      content,
      timestamp: Date.now(),
      likes: 0,
      isUser: true,
    };
    setGameState(prev => ({
      ...prev,
      posts: [newPost, ...prev.posts]
    }));
  };
  
  const handleLikePost = (postId: string) => {
    setGameState(prev => ({
      ...prev,
      posts: prev.posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-4 py-4 md:py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 p-2.5 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Shield className="w-6 h-6 text-slate-950 font-black animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-sans">開源守護者</h1>
                <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                  OS Guardian v1.5
                </span>
              </div>
              <p className="text-xs text-slate-450 font-medium">開源養成 × 雙軌決策商城 × 成就打卡 RPG</p>
            </div>
          </div>

          {/* Wallet Tracker */}
          <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-2xl shadow-inner shadow-black/20">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">我的開源幣</span>
              <span className="text-xs text-slate-400 font-medium mt-0.5">OS COINS 餘額</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="flex items-baseline gap-1">
              <span className="text-xl">🪙</span>
              <span className="text-2xl font-mono font-bold text-emerald-400 leading-none">{gameState.coins}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* Banner Alert Advice for testing */}
        <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900/40 to-emerald-950/20 border border-indigo-500/20 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-shrink-0">
          <div className="flex gap-3 items-start">
            <div className="bg-indigo-500/10 text-indigo-400 p-2 rounded-lg border border-indigo-500/20 mt-0.5 md:mt-0 flex-shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-indigo-300 block">💡 智慧守護引導與規則提示</span>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                這是一場社團夥伴的雙軌理財戰役：賺取的 OS 金幣可用作 A 軌（<b>🧁 餵食與升級你的護法寵物，解鎖炫光眼鏡配件</b>）或 B 軌（<b>🎁 忍耐不花錢，在期末商城預約實體零食與插隊發問提貨券</b>）。寵物飽食度每 45 秒下降 1%，降至 20% 以下會有警示閃燈。新增：可藉由互動來提升好感度！
              </p>
            </div>
          </div>
        </div>

        {/* Top Split: Pet Dashboard and Social Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch w-full min-h-[500px]">
          <div className="w-full">
             <PetDashboard
               pets={gameState.pets}
               activePetId={gameState.activePetId}
               inventory={gameState.inventory}
               shopItems={gameState.shopItems}
               onAdopt={handleAdopt}
               onSetActivePet={handleSetActivePet}
               onReleasePet={handleReleasePet}
               onRename={handleRenamePet}
               onUseItem={handleUseItemFromInventory}
               onInteract={handleInteract}
             />
          </div>
          <div className="w-full">
             <SocialFeed 
               posts={gameState.posts}
               onAddPost={handleAddPost}
               onLikePost={handleLikePost}
             />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6 w-full">
          {/* Left Section: Bounty board (7 Cols) */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-6">
            <BountyBoard
              tasks={gameState.tasks}
              coins={gameState.coins}
              adminCodeSession={gameState.adminCodeSession}
              helpClaims={gameState.helpClaims}
              onCompleteTask={handleCompleteTask}
              onSetAdminCodeSession={handleSetAdminCodeSession}
              onAddHelpClaim={handleAddHelpClaim}
              onApproveClaim={handleApproveClaim}
              onRejectClaim={handleRejectClaim}
            />
          </div>

          {/* Right Section: Shop system (5 Cols) */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-6">
             <ClubStore
               coins={gameState.coins}
               inventory={gameState.inventory}
               pet={gameState.pets.find(p => p.id === gameState.activePetId) || null}
               shopItems={gameState.shopItems}
               purchasedGifts={gameState.purchasedGifts}
               onPurchaseItem={handlePurchaseItem}
               onPurchaseRealGift={handlePurchaseRealGift}
             />
             <DailyGacha
               coins={gameState.coins}
               recentFortunes={gameState.recentFortunes}
               onDrawFortune={handleDrawFortune}
             />
          </div>
        </div>
      </main>

      {/* Footer credits */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-6 text-center text-xs text-slate-600 font-mono mt-12 space-y-1">
        <p>開源守護者 (OS Guardian) • 資訊社開源魂專屬福利培育系統</p>
        <p>© 2026 Crafted with Passion for Developer Guilds & Tech Creators</p>
      </footer>
    </div>
  );
}

