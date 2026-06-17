import React, { useState } from 'react';
import { PetConfig, PetType, PetBreed, CatBreed, DogBreed, MechBreed, ShopItem } from '../types';
import { playMeowSynth, playBarkSynth, playChargeSynth, playLevelUpSynth, playErrorBuzz } from '../utils/sound';
import { Shield, Sparkles, Zap, Heart, Trophy, RefreshCw, Award, Plus, Info, Package, Activity, Star } from 'lucide-react';

interface PetDashboardProps {
  pets: PetConfig[];
  activePetId: string | null;
  inventory: { [itemId: string]: number };
  shopItems: ShopItem[];
  onAdopt: (type: PetType, breed: PetBreed, name: string) => void;
  onSetActivePet: (id: string) => void;
  onReleasePet: (id: string) => void;
  onRename: (newName: string) => void;
  onUseItem: (itemId: string, petId: string) => void;
  onInteract: (type: 'PET' | 'WALK') => void;
}

export default function PetDashboard({ pets, activePetId, inventory, shopItems, onAdopt, onSetActivePet, onReleasePet, onRename, onUseItem, onInteract }: PetDashboardProps) {
  const [petName, setPetName] = useState('');
  const [selectedType, setSelectedType] = useState<PetType>('CAT');
  const [selectedBreed, setSelectedBreed] = useState<PetBreed>('BRITISH');
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameInput, setRenameInput] = useState('');
  const [isInteracting, setIsInteracting] = useState(false);
  const [interactionBubble, setInteractionBubble] = useState<string>('');
  
  // Modals
  const [showInventory, setShowInventory] = useState(false);
  const [showAdoptModal, setShowAdoptModal] = useState(false);

  const activePet = pets.find(p => p.id === activePetId) || null;

  const handleTypeSelect = (type: PetType) => {
    setSelectedType(type);
    if (type === 'CAT') setSelectedBreed('BRITISH');
    else if (type === 'DOG') setSelectedBreed('HUSKY');
    else setSelectedBreed('RACK_SERVER');
  };

  const handleAdoptClick = () => {
    const finalName = petName.trim() || getDefaultName(selectedType, selectedBreed);
    onAdopt(selectedType, selectedBreed, finalName);
    setPetName('');
    setShowAdoptModal(false);
    if (selectedType === 'CAT') playMeowSynth();
    else if (selectedType === 'DOG') playBarkSynth();
    else playChargeSynth();
  };

  const getDefaultName = (type: PetType, breed: PetBreed): string => {
    switch (type) {
      case 'CAT':
        if (breed === 'BRITISH') return '英短胖胖';
        if (breed === 'AMERICAN') return '美短斑斑';
        if (breed === 'MAINE') return '緬因大王';
        if (breed === 'RAGDOLL') return '布偶公主';
        if (breed === 'MIXED_ORANGE') return '大橘為重';
        if (breed === 'MIXED_CALICO') return '三花花';
        if (breed === 'MIXED_BLACK') return '歐斯黑貓';
        return '短毛貓';
      case 'DOG':
        if (breed === 'HUSKY') return '二哈哈';
        if (breed === 'GERMAN_SHEPHERD') return '黑柴柴';
        if (breed === 'BORDER_COLLIE') return '程式狗邊牧';
        return '雪橇犬';
      default:
        if (breed === 'RACK_SERVER') return '守護者 8080';
        if (breed === 'QUANTUM_CORE') return '量子核心 0.1';
        if (breed === 'CYBERDECK') return '極光手持機';
        return '智慧總機 01';
    }
  };

  const handleRenameSubmit = () => {
    if (renameInput.trim()) {
      onRename(renameInput.trim());
      setIsRenaming(false);
    }
  };

  const triggerInteractions = (type: 'CLICK' | 'WALK' | 'PET') => {
    if (!activePet || isInteracting) return;
    setIsInteracting(true);

    if (type !== 'CLICK') {
      onInteract(type);
    }

    let soundType = activePet.type;
    let quotes: string[] = [];

    if (soundType === 'CAT') {
      playMeowSynth();
      quotes = [
        '喵嗚～ 今天的 Bug 改完了嗎？🐱',
        '（呼嚕呼嚕...）人類，再多摸一點！🐾',
        '你的鍵盤看起來很好躺欸...（伸懶腰）',
        '本喵的好感度又增加了呢！😻'
      ];
    } else if (soundType === 'DOG') {
      playBarkSynth();
      quotes = [
        '汪汪！開源好酷！我們一起散步吧！🐶',
        '（用力搖尾巴）最喜歡主人的互動了！汪！',
        '看我跳一個圈圈！我最喜歡社課了！⭐',
        '哈哈哈呼呼（喘氣），今天心情真棒！🍖'
      ];
    } else {
      playChargeSynth();
      quotes = [
        '【系統提示】冷卻風扇運作正常。CPU 負載 2%。🤖',
        '【終端提示】受到實體觸碰，增加機台熟悉度。',
        '【嗶嗶】互動已記錄，效能分析重置中...🔋',
        '【量子狀態】核心穩定，隨時可以處理並行運算！'
      ];
    }

    setInteractionBubble(quotes[Math.floor(Math.random() * quotes.length)]);

    setTimeout(() => {
      setIsInteracting(false);
      setInteractionBubble('');
    }, 2000);
  };
  
  const getBreedDisplayName = (breed: PetBreed): string => {
    switch (breed) {
      case 'BRITISH': return '英國短毛貓';
      case 'AMERICAN': return '美國短毛貓';
      case 'MAINE': return '緬因貓';
      case 'RAGDOLL': return '布偶貓';
      case 'MIXED_ORANGE': return '橘貓';
      case 'MIXED_CALICO': return '玳瑁貓';
      case 'MIXED_BLACK': return '黑貓';
      case 'MIXED_GREY': return '灰貓';
      case 'MIXED_WHITE': return '白貓';
      case 'MIXED_TABBY': return '虎斑貓';
      case 'HUSKY': return '哈士奇';
      case 'GERMAN_SHEPHERD': return '德國牧羊犬';
      case 'BORDER_COLLIE': return '邊境牧羊犬';
      case 'LABRADOR': return '拉不拉多';
      case 'SHIBA': return '柴犬';
      case 'RACK_SERVER': return '機架伺服器';
      case 'QUANTUM_CORE': return '量子核心';
      case 'CYBERDECK': return 'Cyberdeck';
      case 'MAINFRAME': return '超級主機';
      default: return String(breed);
    }
  };

  const inventoryItemsKeys = Object.keys(inventory).filter(k => inventory[k] > 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col relative overflow-hidden" id="pet-dashboard">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Adoption Modal */}
      {showAdoptModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" /> 護法神殿 - 契約締結
              </h2>
              <button onClick={() => setShowAdoptModal(false)} className="text-slate-400 hover:text-white font-bold p-1">&times;</button>
            </div>
            
            <p className="text-xs text-slate-400 mb-6">請選擇陪伴你修課、修 Bug 的程式守護寵物。每種寵物都有不同個性！</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <button onClick={() => handleTypeSelect('CAT')} className={`p-3 rounded-xl border text-center transition-all ${selectedType === 'CAT' ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300' : 'border-slate-800 bg-slate-950/20 text-slate-400'}`}>
                <span className="block text-2xl mb-1">🐱</span>
                <span className="text-xs font-semibold">軟體貓 (Cat)</span>
              </button>
              <button onClick={() => handleTypeSelect('DOG')} className={`p-3 rounded-xl border text-center transition-all ${selectedType === 'DOG' ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300' : 'border-slate-800 bg-slate-950/20 text-slate-400'}`}>
                <span className="block text-2xl mb-1">🐶</span>
                <span className="text-xs font-semibold">開源狗 (Dog)</span>
              </button>
              <button onClick={() => handleTypeSelect('MECH')} className={`p-3 rounded-xl border text-center transition-all ${selectedType === 'MECH' ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300' : 'border-slate-800 bg-slate-950/20 text-slate-400'}`}>
                <span className="block text-2xl mb-1">🤖</span>
                <span className="text-xs font-semibold">終端機甲 (Mech)</span>
              </button>
            </div>

            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">預覽與品種選擇</h3>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden min-h-[250px]">
              {/* List */}
              <div className="overflow-y-auto pr-2 flex flex-col gap-2 custom-scrollbar">
                {selectedType === 'CAT' && (
                  <>
                    <BreedBtn label="🇬🇧 英國短毛貓 (British)" desc="敦厚穩重，四肢粗壯，臉頰豐滿。" val="BRITISH" cur={selectedBreed} onSelect={setSelectedBreed} />
                    <BreedBtn label="🇺🇸 美國短毛貓 (American)" desc="肌肉發達的捕鼠能手，經典銀虎斑。" val="AMERICAN" cur={selectedBreed} onSelect={setSelectedBreed} />
                    <BreedBtn label="獅 緬因貓 (Maine Coon)" desc="溫柔的巨人，體型巨大毛髮濃密。" val="MAINE" cur={selectedBreed} onSelect={setSelectedBreed} />
                    <BreedBtn label="🎀 布偶貓 (Ragdoll)" desc="仙女貓，湛藍眼睛。極度依賴主人。" val="RAGDOLL" cur={selectedBreed} onSelect={setSelectedBreed} />
                    <BreedBtn label="🍊 米克斯橘貓 (Orange)" desc="十隻橘貓九隻胖。食量大也最可愛。" val="MIXED_ORANGE" cur={selectedBreed} onSelect={setSelectedBreed} />
                    <BreedBtn label="🌸 米克斯三花 (Calico)" desc="傲嬌天花板，通常都是母貓！" val="MIXED_CALICO" cur={selectedBreed} onSelect={setSelectedBreed} />
                    <BreedBtn label="🐈‍⬛ 米克斯黑貓 (Black)" desc="黑得發亮！神秘感十足又親人。" val="MIXED_BLACK" cur={selectedBreed} onSelect={setSelectedBreed} />
                  </>
                )}
                {selectedType === 'DOG' && (
                  <>
                    <BreedBtn label="❄️ 哈士奇 (Husky)" desc="眼神二哈，精力旺盛，熱愛到處跳。" val="HUSKY" cur={selectedBreed} onSelect={setSelectedBreed} />
                    <BreedBtn label="💂‍♂️ 德牧 (Shepherd)" desc="忠實英勇，自律代表的守護騎士。" val="GERMAN_SHEPHERD" cur={selectedBreed} onSelect={setSelectedBreed} />
                    <BreedBtn label="🧠 邊境牧羊犬 (Collie)" desc="智商擔當，精力充沛喜歡互動。" val="BORDER_COLLIE" cur={selectedBreed} onSelect={setSelectedBreed} />
                    <BreedBtn label="🦮 拉不拉多 (Labrador)" desc="絕對溫順，超高情商的陪伴使者。" val="LABRADOR" cur={selectedBreed} onSelect={setSelectedBreed} />
                    <BreedBtn label="🐕 柴犬 (Shiba)" desc="固執又可愛，迷因代表犬隻。" val="SHIBA" cur={selectedBreed} onSelect={setSelectedBreed} />
                  </>
                )}
                {selectedType === 'MECH' && (
                  <>
                    <BreedBtn label="📟 機架伺服器 (Server)" desc="經典多層架，最務實的算力後盾。" val="RACK_SERVER" cur={selectedBreed} onSelect={setSelectedBreed} />
                    <BreedBtn label="🌀 量子核心 (Quantum)" desc="科幻懸浮超算核心，預測未來 Bug。" val="QUANTUM_CORE" cur={selectedBreed} onSelect={setSelectedBreed} />
                    <BreedBtn label="🕹️ 極光端 (Cyberdeck)" desc="黑客專屬的可攜帶式微控核心。" val="CYBERDECK" cur={selectedBreed} onSelect={setSelectedBreed} />
                  </>
                )}
              </div>
              
              {/* Preview */}
              <div className="bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-4">
                 <div className="w-32 h-32 md:w-48 md:h-48 relative">
                   <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl" />
                   <RenderPetSVG type={selectedType} breed={selectedBreed} level={1} satiety={100} isInteracting={false} />
                 </div>
                 <div className="mt-4 text-center">
                   <span className="text-emerald-400 font-bold text-sm tracking-widest">{getBreedDisplayName(selectedBreed)}</span>
                 </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-slate-800">
              <input type="text" placeholder={`幫牠取名: ${getDefaultName(selectedType, selectedBreed)}`} value={petName} onChange={(e) => setPetName(e.target.value)} maxLength={15} className="flex-1 px-4 py-2 text-sm bg-slate-950 border border-slate-850 rounded-xl text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600" />
              <button onClick={handleAdoptClick} className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md">
                締結契約 ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {pets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
           <div className="bg-gradient-to-tr from-emerald-500 to-teal-500 p-4 rounded-2xl mb-4 shadow-lg shadow-emerald-500/20">
             <Shield className="w-8 h-8 text-slate-950" />
           </div>
           <h2 className="text-2xl font-bold text-white mb-2">尚未迎來守護神</h2>
           <p className="text-slate-400 mb-6 max-w-sm text-sm">選擇一隻軟體貓、開源狗或終端機甲，陪伴你在這個開源世界中寫碼、除蟲、賺金幣！</p>
           <button onClick={() => setShowAdoptModal(true)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20">
             <Plus className="w-5 h-5" /> 立即前往領養神殿
           </button>
        </div>
      ) : (
        /* Main Dashboard view */
        <div className="flex flex-col h-full">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" /> 寵物宅急便
              </h2>
              <div className="flex gap-2">
                 <button onClick={() => setShowInventory(!showInventory)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 transition-colors">
                   <Package className="w-4 h-4" /> 背包
                   {inventoryItemsKeys.length > 0 && <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />}
                 </button>
                 <button onClick={() => setShowAdoptModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 text-xs font-bold rounded-lg border border-emerald-500/30 transition-colors">
                   <Plus className="w-3.5 h-3.5" /> 多養一隻
                 </button>
              </div>
           </div>

           {/* Top: Pet Roster */}
           <div className="flex overflow-x-auto gap-3 pb-4 custom-scrollbar">
             {pets.map(p => (
               <button 
                 key={p.id} 
                 onClick={() => onSetActivePet(p.id)}
                 className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                   activePetId === p.id ? 'bg-slate-800 border-2 border-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-slate-900 border border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100'
                 }`}
               >
                 <div className="w-12 h-12 pointer-events-none">
                   <RenderPetSVG type={p.type} breed={p.breed} level={p.level} satiety={p.satiety} isInteracting={false} />
                 </div>
               </button>
             ))}
           </div>

           {/* Central Active Pet View */}
           {activePet && (
             <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 relative">
                
                {/* Visual */}
                <div className="md:col-span-5 flex flex-col items-center justify-center relative min-h-[220px]">
                  {activePet.satiety <= 20 && (
                    <div className="absolute top-0 left-0 z-10 flex items-center gap-1.5 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 animate-pulse text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      極度飢餓餓扁中
                    </div>
                  )}

                  {interactionBubble && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 text-slate-100 text-xs py-1.5 px-3 rounded-lg shadow-xl max-w-[200px] text-center z-10 animate-bounce">
                      {interactionBubble}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-2 h-2 bg-slate-800 rotate-45 border-r border-b border-slate-700" />
                    </div>
                  )}

                  <div onClick={() => triggerInteractions('CLICK')} className={`w-full max-w-[180px] h-[180px] flex items-center justify-center cursor-pointer relative ${isInteracting ? 'scale-105' : 'hover:scale-105 duration-300'} transition-all`} title="點擊跟寵物互動！">
                    <RenderPetSVG type={activePet.type} breed={activePet.breed} level={activePet.level} satiety={activePet.satiety} isInteracting={isInteracting} />
                  </div>
                </div>

                {/* Info & Stats */}
                <div className="md:col-span-7 flex flex-col justify-center gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      {isRenaming ? (
                         <div className="flex gap-1 items-center mb-1">
                           <input type="text" value={renameInput} onChange={(e) => setRenameInput(e.target.value)} maxLength={15} className="px-2 py-1 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white font-bold w-32 outline-none" />
                           <button onClick={handleRenameSubmit} className="text-[10px] font-bold text-emerald-400 px-2 py-1.5 bg-slate-800 rounded">OK</button>
                         </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-white tracking-tight">{activePet.name}</h3>
                          <button onClick={() => { setRenameInput(activePet.name); setIsRenaming(true); }} className="text-[10px] text-slate-500 hover:text-emerald-400">(改名)</button>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">LV. {activePet.level}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{getBreedDisplayName(activePet.breed)}</span>
                      </div>
                    </div>
                    
                    <button onClick={() => onReleasePet(activePet.id)} className="text-[10px] text-slate-500 hover:text-rose-400 underline decoration-slate-700 underline-offset-2">送養放生</button>
                  </div>

                  {/* Meters */}
                  <div className="space-y-3">
                    <Meter label="飽食度 (Satiety)" val={activePet.satiety} max={100} icon={<Activity className="w-3.5 h-3.5 text-amber-400" />} color="amber" />
                    <Meter label="好感度 (Affection)" val={activePet.affection} max={100} icon={<Heart className="w-3.5 h-3.5 text-rose-400" />} color="rose" />
                    <Meter label="經驗值 (EXP)" val={activePet.exp} max={activePet.level * 100} isMax={activePet.level >= 10} text={`${activePet.exp} / ${activePet.level * 100}`} icon={<Star className="w-3.5 h-3.5 text-violet-400" />} color="violet" />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-2 border-t border-slate-800 pt-3">
                    <button onClick={() => triggerInteractions('PET')} className="flex-1 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/30 transition-colors flex items-center justify-center gap-1.5">
                      <Heart className="w-4 h-4" /> 摸摸互動
                    </button>
                    <button onClick={() => triggerInteractions('WALK')} className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/30 transition-colors flex items-center justify-center gap-1.5">
                      🚶 帶去散步
                    </button>
                  </div>
                </div>
                
             </div>
           )}

        </div>
      )}

      {/* Inventory Modal Slide up */}
      {showInventory && activePet && (
        <div className="absolute inset-x-0 bottom-0 top-auto h-[60%] bg-slate-900 border-t border-slate-700 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-50 rounded-t-3xl flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2"><Package className="w-5 h-5 text-indigo-400" /> 我的背包</h3>
            <button onClick={() => setShowInventory(false)} className="text-slate-400 hover:text-white font-bold">&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {inventoryItemsKeys.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
                 🎒 背包空空如也，快去商城買點東西吧！
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {inventoryItemsKeys.map(itemId => {
                  const qty = inventory[itemId];
                  const details = shopItems.find(s => s.id === itemId);
                  if (!details) return null;
                  
                  return (
                    <div key={itemId} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl">{details.icon}</span>
                        <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">x {qty}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-200 mb-2 truncate" title={details.title}>{details.title}</h4>
                      <button 
                        onClick={() => { onUseItem(itemId, activePet.id); playMeowSynth(); }}
                        className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        {details.type === 'TOY' ? '給予玩具' : '餵食'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Sub components
function BreedBtn({ label, desc, val, cur, onSelect }: { label: string, desc: string, val: PetBreed, cur: PetBreed, onSelect: (v: PetBreed) => void }) {
  return (
    <button onClick={() => onSelect(val)} className={`p-2.5 rounded-lg text-left text-xs border transition-all ${cur === val ? 'border-emerald-500 bg-slate-800 text-white shadow-md' : 'border-slate-800 bg-slate-950/40 text-slate-400'}`}>
      <span className="font-bold opacity-100">{label}</span>
      <span className="block text-[10px] mt-0.5 opacity-80">{desc}</span>
    </button>
  );
}

function Meter({ label, val, max, isMax, text, icon, color }: { label: string, val: number, max: number, isMax?: boolean, text?: string, icon: React.ReactNode, color: string }) {
  const p = isMax ? 100 : Math.min(100, Math.max(0, (val / max) * 100));
  
  const gradients: Record<string, string> = {
    amber: 'from-amber-500 to-yellow-400',
    rose: 'from-rose-500 to-pink-400',
    violet: 'from-violet-500 to-indigo-500'
  };
  
  return (
    <div>
      <div className="flex justify-between text-[11px] items-center mb-1">
        <span className="text-slate-400 flex items-center gap-1">{icon} {label}</span>
        <span className={`font-semibold text-xs text-${color}-400`}>{text || `${val}%`}</span>
      </div>
      <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
        <div className={`h-full rounded-full bg-gradient-to-r ${gradients[color]} transition-all duration-500`} style={{ width: `${p}%` }} />
      </div>
    </div>
  );
}

// Minimalistic rendering mapping
function RenderPetSVG({ type, breed, level, satiety, isInteracting }: { type: PetType, breed: PetBreed, level: number, satiety: number, isInteracting: boolean }) {
  // Let's use simple nice emoji arts to avoid ugly pure SVGs for the complex new breeds since we can't reliably map beautiful SVGs programmatically for 15+ breeds nicely
  // Wait, I can do a big beautiful circle avatar with Emojis! It's much cuter and cleaner than abstract SVG if SVGs are too complex.
  // The user explicitly stated "現在的圖片是有點醜(比較抽象)" -> "the current images are a bit ugly / abstract". 
  // Replacing with huge Emoji in a nice stylized badge!

  const getEmojiAndBg = () => {
    switch (breed) {
      case 'BRITISH': return { e: '🐱', bg: 'from-slate-400 to-slate-200' };
      case 'AMERICAN': return { e: '🐈', bg: 'from-zinc-400 to-zinc-200' };
      case 'MAINE': return { e: '🦁', bg: 'from-amber-600 to-yellow-500' };
      case 'RAGDOLL': return { e: '🎀', bg: 'from-sky-200 to-white' };
      case 'MIXED_ORANGE': return { e: '🐈', bg: 'from-orange-500 to-yellow-400' };
      case 'MIXED_CALICO': return { e: '🌸', bg: 'from-pink-300 to-orange-200' };
      case 'MIXED_BLACK': return { e: '🐈‍⬛', bg: 'from-slate-800 to-slate-600' };
      case 'MIXED_GREY': return { e: '🐱', bg: 'from-gray-500 to-gray-300' };
      case 'MIXED_WHITE': return { e: '🐱', bg: 'from-gray-100 to-white' };
      case 'MIXED_TABBY': return { e: '🐅', bg: 'from-amber-500 to-orange-400' };
      
      case 'HUSKY': return { e: '🐺', bg: 'from-sky-300 to-slate-200' };
      case 'GERMAN_SHEPHERD': return { e: '🐕', bg: 'from-amber-700 to-yellow-600' };
      case 'BORDER_COLLIE': return { e: '🐶', bg: 'from-slate-900 to-white' };
      case 'LABRADOR': return { e: '🦮', bg: 'from-yellow-400 to-amber-200' };
      case 'SHIBA': return { e: '🐕', bg: 'from-orange-400 to-yellow-300' };
      
      case 'RACK_SERVER': return { e: '🗄️', bg: 'from-slate-600 to-slate-400' };
      case 'QUANTUM_CORE': return { e: '🔮', bg: 'from-indigo-600 to-purple-400' };
      case 'CYBERDECK': return { e: '📟', bg: 'from-emerald-600 to-teal-400' };
      case 'MAINFRAME': return { e: '💻', bg: 'from-blue-600 to-indigo-400' };
      default: return { e: '🐾', bg: 'from-indigo-500 to-purple-500' };
    }
  };

  const { e, bg } = getEmojiAndBg();

  return (
    <div className={`w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br ${bg} shadow-[inset_0_-10px_20px_rgba(0,0,0,0.2)] border-[4px] border-slate-800 relative shadow-2xl`}>
       <div className={`text-6xl md:text-8xl drop-shadow-xl ${isInteracting ? 'animate-bounce' : ''}`}>
         {e}
       </div>
       
       {/* Sunglasses Overlay for LV > 5 */}
       {level >= 5 && type !== 'MECH' && (
         <div className="absolute inset-0 flex items-center justify-center pb-2 pointer-events-none drop-shadow-lg text-4xl md:text-5xl">
           🕶️
         </div>
       )}

       {/* Satiety Alert */}
       {satiety <= 20 && (
         <div className="absolute inset-0 rounded-full ring-4 ring-rose-500/50 animate-pulse bg-rose-500/20 pointer-events-none" />
       )}
    </div>
  );
}
