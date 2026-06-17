/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FortuneResult } from '../types';
import { playCoinSynth, playCardSwipeSynth, playLevelUpSynth, playErrorBuzz } from '../utils/sound';
import { Sparkles, RefreshCw, Layers, Compass, HelpCircle, Activity, Award, Flame } from 'lucide-react';

interface DailyGachaProps {
  coins: number;
  recentFortunes: FortuneResult[];
  onDrawFortune: (result: FortuneResult) => void;
}

// 25 Custom Hand-crafted Witty Programming Fortunes
const FORTUNE_POOL: Omit<FortuneResult, 'date'>[] = [
  {
    luckLevel: '大吉',
    title: '一發 Compile Pass 神蹟',
    quote: '天地失色，唯有編譯器的綠色 PASS 狂喜閃耀。你的 Code 乾淨得連老前輩也流下難言的熱淚！',
    advice: '宜：發 PR 展現傲人身手、與高級資工學姐討論軟工；忌：在鍵盤前摸魚被抓。',
    luckScore: 99,
    luckyColor: '綠色乖乖 (VIM Green)',
    luckyColorHex: '#22c55e',
    luckyWeapon: 'Logitech G913 茶軸機械鍵盤'
  },
  {
    luckLevel: '大吉',
    title: 'Merge 無任何 Conflict',
    quote: '你在分支出神入化地穿梭，多位工程師合流竟然宛如清泉匯海，完全沒有衝突，宛若神助！',
    advice: '宜：重構萬行祖傳程式碼、吃大碗滷肉飯；忌：開口借學長的高配置顯卡。',
    luckScore: 97,
    luckyColor: '開源守護綠 (Open Green)',
    luckyColorHex: '#10b981',
    luckyWeapon: '萬能 ChatGPT O1 尊榮金金板'
  },
  {
    luckLevel: '吉',
    title: 'VIM 安全退出',
    quote: '你不僅成功退出了 VIM，還保存了所有的暫存文本！此等修為，足以在社團聊天室傳誦兩天。',
    advice: '宜：精進 shell 指令、購買社團貼紙；忌：使用 Windows CMD 直接下複雜運算。',
    luckScore: 85,
    luckyColor: '終端黑客紫 (Cyber Violet)',
    luckyColorHex: '#a855f7',
    luckyWeapon: 'ESC 鍵專屬特製貓爪鍵帽'
  },
  {
    luckLevel: '吉',
    title: '傲嬌貓咪躺筆電致敬',
    quote: '守護神貓咪今天沒有踩爛你的 config，而是優雅地趴在鍵盤邊，釋放出極高的 Debug 加持光環！',
    advice: '宜：親手餵食罐罐、整理桌上堆疊的厚厚教科書；忌：對貓咪吹口哨。',
    luckScore: 88,
    luckyColor: '溫暖香橘色 (Peach Orange)',
    luckyColorHex: '#f97316',
    luckyWeapon: '社辦尊享貓抓板 & 貓咪墨鏡'
  },
  {
    luckLevel: '中吉',
    title: 'GitHub Star 暴漲一枚',
    quote: '看來有些人在世界的某個角落，默默點擊了亮晶晶的星星！你的開源專案離改變世界又邁出了萬分之一步。',
    advice: '宜：撰寫更詳細的 README 介紹文模型、出門散步；忌：在凌晨點兩大杯波霸奶茶。',
    luckScore: 78,
    luckyColor: '星星流光金 (Gold Dust)',
    luckyColorHex: '#f59e0b',
    luckyWeapon: '終端機裡的 ASCII 藝術簽名檔'
  },
  {
    luckLevel: '中吉',
    title: '學長姐一眼指出 Bug 所在',
    quote: '「啊，你這裡拼錯了啦！」學姐僅花 0.5 秒就點破你卡了 3 小時的 NullPointer。簡直是魔法！',
    advice: '宜：去期末商城購買免排隊問學長長姐扣打、回請飲料；忌：裝作自己完全懂。',
    luckScore: 75,
    luckyColor: '櫻花岱茂粉 (Mistletoe Pink)',
    luckyColorHex: '#fecdd3',
    luckyWeapon: '社辦最舒服最軟的沙發躺位'
  },
  {
    luckLevel: '小吉',
    title: 'Stack Overflow 終於看懂',
    quote: '在你往下滾動了五頁後，發現了 2013 年某個印度大神的超精妙詳解，直接複製貼上，神奇地動起來了！',
    advice: '宜：感恩叩拜 StackOverflow 的老前輩、泡熱咖啡；忌：問別人這段 line-by-line 是什麼原理。',
    luckScore: 68,
    luckyColor: '論壇海藍色 (Stack Blue)',
    luckyColorHex: '#0284c7',
    luckyWeapon: '多重 Ctrl-C / Ctrl-V 的巨集按鈕'
  },
  {
    luckLevel: '末吉',
    title: '在 Local 竟然能跑',
    quote: '這段 code 很不科學：邏輯漏洞百出、沒封裝、沒測試，但是... 竟然在你的本機跑起來了！雖然去 Prod 必死。',
    advice: '宜：小心翼翼把視窗縮小、祈禱；忌：在幹部或講師面前做現場演示 (Demo)。',
    luckScore: 55,
    luckyColor: '危險警戒黃 (Amber Warn)',
    luckyColorHex: '#d97706',
    luckyWeapon: '綠色椰子乖乖 * 3 包疊加'
  },
  {
    luckLevel: '凶',
    title: '忘記 Git Ignore 後遺症',
    quote: '你把包含私鑰、資料庫明文密碼、以及 2GB 沒意義的 node_modules 全部 Push 上去 GitHub 被警告了... 慘。',
    advice: '宜：緊急發送 git reset --hard、學習寫 .gitignore；忌：繼續傻笑而不做任何更動。',
    luckScore: 30,
    luckyColor: '危樓警示紅 (Alert Rose)',
    luckyColorHex: '#f43f5e',
    luckyWeapon: '專門移除歷史 commit 的隱藏指令'
  },
  {
    luckLevel: '大凶',
    title: '手抖 Push --Force 到 Main 災難',
    quote: '天啊！你以為你是發 PR，結果不小心蓋掉了主要的 production 主分支，伺服器瞬間警報閃紅燈，完蛋了！',
    advice: '宜：向社長自首告罪、吃宵夜壓驚；忌：說這都是伺服器網路延遲導致的。',
    luckScore: 12,
    luckyColor: '深淵寂滅黑 (Pitch Black)',
    luckyColorHex: '#0f172a',
    luckyWeapon: '立刻離職跑路防禦術手冊'
  }
];

export default function DailyGacha({ coins, recentFortunes, onDrawFortune }: DailyGachaProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [currentFortune, setCurrentFortune] = useState<FortuneResult | null>(null);
  const [showCardBack, setShowCardBack] = useState(true);
  const [gachaError, setGachaError] = useState('');

  const triggerGachaPull = () => {
    setGachaError('');
    if (coins < 5) {
      setGachaError('🪙 餘額不足 5 枚 OS Coins！先去賞金任務板賺金幣吧！');
      playErrorBuzz();
      return;
    }

    setIsRolling(true);
    setShowCardBack(true);
    setCurrentFortune(null);
    playCardSwipeSynth();

    // Loop through cards effect
    let count = 0;
    const interval = setInterval(() => {
      // Just sound play
      if (count % 3 === 0) playCardSwipeSynth();
      count++;
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      // Select a random fortune from pool
      const randomIndex = Math.floor(Math.random() * FORTUNE_POOL.length);
      const selected = FORTUNE_POOL[randomIndex];
      
      const newFortune: FortuneResult = {
        ...selected,
        date: new Date().toLocaleDateString()
      };

      setCurrentFortune(newFortune);
      onDrawFortune(newFortune);

      // Animation flip steps
      setIsRolling(false);
      setTimeout(() => {
        setShowCardBack(false);
        if (newFortune.luckLevel.includes('吉')) {
          playLevelUpSynth();
        } else {
          playErrorBuzz();
        }
      }, 300);
    }, 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden" id="daily-gacha">
      <div className="absolute top-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-400" /> 工程師每日程設運勢籤
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">花費 5 枚金幣，測驗今日編譯通過與 Merge 順暢的最佳指數。</p>
        </div>

        {/* Cost sticker */}
        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-[10px] font-bold text-purple-400 font-mono">
          🪙 5 COINS / 抽
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Draw action area */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-950/40 border border-slate-850 rounded-xl min-h-[300px] relative">
          
          {/* Main Card render frame */}
          <div className="w-[180px] h-[260px] relative preserve-3d" style={{ perspective: '1000px' }}>
            {showCardBack || isRolling ? (
              /* Card Back Cyber design */
              <div
                onClick={!isRolling ? triggerGachaPull : undefined}
                className={`w-full h-full rounded-2xl p-4 flex flex-col items-center justify-between border-2 bg-gradient-to-br from-slate-950 to-slate-900 absolute top-0 left-0 cursor-pointer overflow-hidden group select-none shadow-2xl transition-all ${
                  isRolling ? 'border-purple-500 animate-pulse rotate-y-180 scale-105 duration-200' : 'border-slate-800 hover:border-purple-500/50 hover:scale-[1.03]'
                }`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
                <div className="absolute top-2 left-2 right-2 bottom-2 border border-slate-800/40 rounded-xl pointer-events-none" />

                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-600 font-mono">OS Guardian</div>

                {/* Spinning holographic grid */}
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-purple-500/20 flex items-center justify-center relative">
                  <div className={`w-10 h-10 rounded-full border-2 border-double border-purple-400/40 flex items-center justify-center ${isRolling ? 'rotate-180 duration-500 animate-spin' : 'group-hover:scale-105 duration-300'}`}>
                    <Sparkles className={`w-4 h-4 text-purple-400 ${isRolling ? 'animate-bounce' : ''}`} />
                  </div>
                </div>

                <div className="text-center">
                  <button className="px-3 py-1 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-[10px] text-purple-300 font-bold rounded-lg transition-colors cursor-pointer">
                    {isRolling ? '運勢晶片鏈結中...' : '插入硬體抽卡測算!'}
                  </button>
                  <span className="text-[8px] text-slate-500 block mt-1">COST: 5 GOLD COINS</span>
                </div>
              </div>
            ) : (
              /* Card Front Revealed design */
              currentFortune && (
                <div
                  className="w-full h-full rounded-2xl p-4 flex flex-col justify-between border-2 bg-gradient-to-b from-slate-950 to-slate-900 absolute top-0 left-0 shadow-2xl overflow-hidden animate-fade-in"
                  style={{ borderColor: currentFortune.luckyColorHex }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none" style={{ backgroundColor: `${currentFortune.luckyColorHex}15` }} />

                  {/* Header info */}
                  <div className="flex items-center justify-between border-b border-slate-850 pb-1.5">
                    <span className="text-[9px] uppercase font-mono text-slate-500">{currentFortune.date}</span>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold text-slate-950 font-sans"
                      style={{ backgroundColor: currentFortune.luckyColorHex }}
                    >
                      {currentFortune.luckLevel}
                    </span>
                  </div>

                  {/* Fortune Main text */}
                  <div className="my-1.5 text-center flex-1 flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-white tracking-wide" style={{ color: currentFortune.luckyColorHex }}>
                      {currentFortune.title}
                    </h3>
                    <div className="w-8 h-0.5 mx-auto my-1.5" style={{ backgroundColor: currentFortune.luckyColorHex }} />
                    <p className="text-[10px] text-slate-300 leading-relaxed italic mt-1 font-medium">
                      "{currentFortune.quote}"
                    </p>
                  </div>

                  {/* Foot notes with color & weapon */}
                  <div className="border-t border-slate-850 pt-2 text-[9px] space-y-1 text-slate-400">
                    <div>
                      <span className="font-bold text-slate-500">幸運色：</span>
                      <span className="font-mono text-slate-200" style={{ color: currentFortune.luckyColorHex }}>{currentFortune.luckyColor}</span>
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-slate-500">幸運裝備：</span>
                      <span className="font-mono text-slate-200">{currentFortune.luckyWeapon}</span>
                    </div>
                    <div className="flex items-center justify-between text-[8px] text-slate-500 pt-1">
                      <span>護盾值 {currentFortune.luckScore}%</span>
                      <span className="flex items-center gap-0.5"><Flame className="w-2 h-2 text-rose-500" /> OS-GACHA</span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Quick error banner */}
          {gachaError && (
            <p className="text-[10px] text-rose-400 text-center mt-3 max-w-[170px] leading-tight">
              {gachaError}
            </p>
          )}
        </div>

        {/* Historical Fortune stats & card indexes */}
        <div className="md:col-span-7 flex flex-col justify-between h-full min-h-[300px]">
          <div>
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
              <Layers className="w-4 h-4 text-purple-400" /> 歷史抽卡與運勢卡牌
            </h3>
            <p className="text-xs text-slate-500">您在開源守護者中抽認得的所有運勢晶片紀錄。收集完畢必得大師認證！</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 max-h-[190px] overflow-y-auto">
              {recentFortunes.length === 0 ? (
                <div className="col-span-3 py-8 text-center bg-slate-950/20 border border-dashed border-slate-850 rounded-lg text-xs text-slate-500">
                  🧬 尚無抽卡歷史。快投入 5 枚 OS 金幣進行命運連線吧！
                </div>
              ) : (
                [...recentFortunes].reverse().map((f, i) => (
                  <div
                    key={`${f.title}_${i}`}
                    className="p-2 border bg-slate-950/50 rounded-lg text-left transition-all hover:scale-[1.02]"
                    style={{ borderColor: `${f.luckyColorHex}25` }}
                  >
                    <div className="flex items-center justify-between text-[8px] mb-1">
                      <span className="text-slate-500">{f.date}</span>
                      <span className="font-bold" style={{ color: f.luckyColorHex }}>{f.luckLevel}</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 block truncate" style={{ color: f.luckyColorHex }}>
                      {f.title}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 truncate">
                      🛠️ {f.luckyWeapon}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-4 p-3 bg-slate-950/40 border border-slate-850 rounded-xl text-xs flex gap-2 items-start text-slate-400 leading-normal">
            <span className="text-lg">🛎️</span>
            <div>
              <span className="font-bold text-slate-300 block">社課口令彩蛋：</span>
              實體簽到代碼可大幅提升獲得開源金幣概率，每天存起來的金幣，不只可以用來升級寵物，更能去商城兌換真實免費的宵夜！
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
