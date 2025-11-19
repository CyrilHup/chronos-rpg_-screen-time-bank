import React, { useState, useMemo } from 'react';
import { Avatar, CosmeticItem } from '../types';
import { COSMETIC_SHOP_ITEMS } from '../constants';
import { Zap, Crown, Sparkles, Lock, Hourglass, Shirt, Moon, Circle, Glasses, Flower, Bug, ArrowLeft, X } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import AvatarRenderer from './AvatarRenderer';

interface AvatarStationProps {
  avatar: Avatar;
  timeBank: number;
  onPurchaseCosmetic: (item: CosmeticItem) => void;
  onEquipCosmetic: (item: CosmeticItem) => void;
  onCheatXP: () => void;
}

const AvatarStation: React.FC<AvatarStationProps> = ({ avatar, timeBank, onPurchaseCosmetic, onEquipCosmetic, onCheatXP }) => {
  const [selectedSlot, setSelectedSlot] = useState<'hat' | 'cape' | 'clothes' | 'background' | 'aura' | null>(null);

  const slots = [
      { id: 'hat', icon: Crown, label: 'Headgear' },
      { id: 'clothes', icon: Shirt, label: 'Outfit' },
      { id: 'cape', icon: Moon, label: 'Back' },
      { id: 'aura', icon: Zap, label: 'Aura' },
      { id: 'background', icon: Sparkles, label: 'Scene' },
  ] as const;

  const filteredItems = useMemo(() => {
      if (!selectedSlot) return [];
      return COSMETIC_SHOP_ITEMS.filter(item => item.type === selectedSlot);
  }, [selectedSlot]);

  return (
    <div className="p-6 pb-24 min-h-full flex flex-col space-y-6 relative">
      {/* Header */}
      <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-zen-text-main">{avatar.name}</h2>
            <p className="text-xs text-zen-text-muted uppercase tracking-widest mb-1">Customize your digital projection</p>
          </div>
      </div>

      {/* 3D Avatar Viewer - Fixed Height and Visibility */}
      <div className="relative h-[350px] w-full bg-zen-paper/30 rounded-3xl border border-white/5 overflow-hidden group shrink-0">
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
            <Hourglass size={14} className="text-yellow-400" />
            <span className="text-sm font-bold text-white">{timeBank} min</span>
        </div>

        {/* Cheat Button - Made more visible */}
        <button 
            onClick={onCheatXP}
            className="absolute top-4 left-4 z-20 p-2 bg-red-500/20 rounded-full border border-red-500/30 hover:bg-red-500/40 text-red-400 transition-all"
            title="Cheat: +50 Minutes"
        >
            <Bug size={16} />
        </button>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zen-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <AvatarRenderer avatar={avatar} className="w-full h-full z-10 relative" />
      </div>

      {/* Evolution Progress */}
      <div className="shrink-0 bg-zen-paper/20 p-4 rounded-2xl border border-white/5">
          <div className="flex justify-between items-end mb-2">
            <div>
                <h3 className="text-sm font-bold text-zen-text-main">Evolution Progress</h3>
                <p className="text-[10px] text-zen-text-muted">
                    {avatar.evolutionStage >= 5 ? 'Max Evolution Reached' : `Next evolution at Level ${avatar.evolutionStage * 5}`}
                </p>
            </div>
            <span className="text-xs font-bold text-zen-primary">Stage {avatar.evolutionStage}/5</span>
          </div>
          
          {/* Level Progress */}
          <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-zen-primary/50 to-zen-primary transition-all duration-500 relative" 
                style={{ width: `${(avatar.experience / (avatar.level * 100)) * 100}%` }} 
              >
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-[2px]" />
              </div>
          </div>
          
          <div className="flex justify-between items-center mt-1.5">
              <span className="text-[10px] text-zen-text-muted">Lvl {avatar.level}</span>
              <span className="text-[10px] font-mono text-zen-primary">{avatar.experience} / {avatar.level * 100} XP</span>
              <span className="text-[10px] text-zen-text-muted">Lvl {avatar.level + 1}</span>
          </div>
      </div>

      {/* Main Content Area: Swaps between Slots and Shop */}
      <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
              {!selectedSlot ? (
                  <motion.div 
                    key="slots"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                      <h3 className="text-lg font-bold text-zen-text-main">Equipment</h3>
                      <div className="grid grid-cols-5 gap-3">
                          {slots.map((slot) => {
                              const equippedId = avatar.equippedCosmetics[slot.id];
                              const equippedItem = COSMETIC_SHOP_ITEMS.find(i => i.id === equippedId);

                              return (
                                  <button 
                                      key={slot.id}
                                      onClick={() => setSelectedSlot(slot.id)}
                                      className="aspect-square rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all bg-zen-paper/20 border-white/5 hover:bg-zen-paper/40 hover:border-white/20"
                                  >
                                      <div className={clsx(
                                          "w-8 h-8 rounded-full flex items-center justify-center",
                                          equippedItem ? "bg-zen-primary text-black" : "bg-black/20 text-zen-text-muted"
                                      )}>
                                          {equippedItem ? (
                                              slot.id === 'hat' ? <Crown size={16} /> :
                                              slot.id === 'clothes' ? <Shirt size={16} /> :
                                              slot.id === 'cape' ? <Moon size={16} /> :
                                              <Sparkles size={16} />
                                          ) : (
                                              <slot.icon size={16} />
                                          )}
                                      </div>
                                      <span className="text-[10px] uppercase tracking-wider font-bold text-zen-text-muted">{slot.label}</span>
                                  </button>
                              );
                          })}
                      </div>
                  </motion.div>
              ) : (
                  <motion.div 
                    key="shop"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4 flex-1 flex flex-col"
                  >
                      <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setSelectedSlot(null)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          >
                              <ArrowLeft size={20} className="text-zen-text-main" />
                          </button>
                          <h3 className="text-lg font-bold text-zen-text-main capitalize">{selectedSlot} Collection</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 pb-4">
                          {/* Unequip Option */}
                          <button 
                            onClick={() => onEquipCosmetic({ type: selectedSlot, id: null } as any)}
                            className={clsx(
                                "relative p-3 rounded-xl border text-left transition-all group flex flex-col gap-2",
                                !avatar.equippedCosmetics[selectedSlot]
                                    ? "bg-zen-primary/20 border-zen-primary"
                                    : "bg-zen-paper/20 border-white/10 hover:border-red-400/50 hover:bg-red-500/10"
                            )}
                          >
                              <div className={clsx(
                                  "w-8 h-8 rounded-full flex items-center justify-center",
                                  !avatar.equippedCosmetics[selectedSlot] ? "bg-zen-primary text-black" : "bg-gray-800 text-gray-400"
                              )}>
                                  <X size={14} />
                              </div>
                              <div className="font-bold text-white text-xs">None</div>
                              <div className="text-[10px] text-gray-400">Unequip item</div>
                          </button>
                          {filteredItems.length === 0 ? (
                              <div className="col-span-2 text-center py-8 text-zen-text-muted italic">
                                  No items available for this slot yet.
                              </div>
                          ) : (
                              filteredItems.map((item) => {
                                  const isOwned = avatar.ownedCosmetics.includes(item.id);
                                  const isEquipped = avatar.equippedCosmetics[item.type] === item.id;
                                  const isLocked = avatar.level < item.minLevel;
                                  const canAfford = timeBank >= item.cost;

                                  return (
                                      <button 
                                        key={item.id}
                                        disabled={(!isOwned && !canAfford) || isLocked}
                                        onClick={() => isOwned ? onEquipCosmetic(item) : onPurchaseCosmetic(item)}
                                        className={clsx(
                                            "relative p-3 rounded-xl border text-left transition-all group",
                                            isEquipped
                                                ? "bg-zen-primary/20 border-zen-primary"
                                                : isOwned 
                                                    ? "bg-zen-paper/30 border-white/10 hover:bg-zen-paper/50" 
                                                    : isLocked
                                                        ? "bg-gray-900/50 border-white/5 opacity-50 cursor-not-allowed"
                                                        : canAfford
                                                            ? "bg-zen-paper/20 border-white/10 hover:border-zen-primary hover:bg-zen-paper/40"
                                                            : "bg-zen-paper/20 border-red-500/20 cursor-not-allowed"
                                        )}
                                      >
                                          <div className="flex justify-between items-start mb-2">
                                              <div className={clsx(
                                                  "w-8 h-8 rounded-full flex items-center justify-center",
                                                  isEquipped ? "bg-zen-primary text-black" : isOwned ? "bg-zen-primary/20 text-zen-primary" : "bg-gray-800 text-gray-400"
                                              )}>
                                                  {item.icon === 'Circle' && <Circle size={14} />}
                                                  {item.icon === 'Glasses' && <Glasses size={14} />}
                                                  {item.icon === 'Code' && <Zap size={14} />}
                                                  {item.icon === 'Feather' && <Crown size={14} />}
                                                  {item.icon === 'Flower' && <Flower size={14} />}
                                                  {item.icon === 'Shirt' && <Shirt size={14} />}
                                                  {item.icon === 'Moon' && <Moon size={14} />}
                                              </div>
                                              {isLocked && <Lock size={12} className="text-gray-500" />}
                                              {isEquipped && <div className="w-2 h-2 rounded-full bg-zen-primary animate-pulse" />}
                                          </div>
                                          
                                          <div className="space-y-0.5">
                                              <div className="font-bold text-white text-xs">{item.name}</div>
                                              <div className="text-[10px] text-gray-400 line-clamp-1">{item.description}</div>
                                          </div>

                                          <div className="mt-2 flex items-center justify-between">
                                              {isOwned ? (
                                                  <span className={clsx("text-[10px] font-bold uppercase tracking-wider", isEquipped ? "text-zen-primary" : "text-gray-500")}>
                                                      {isEquipped ? "Equipped" : "Owned"}
                                                  </span>
                                              ) : (
                                                  <div className={clsx("flex items-center gap-1 text-xs font-bold", canAfford ? "text-yellow-400" : "text-red-400")}>
                                                      <Hourglass size={10} />
                                                      {item.cost} min
                                                  </div>
                                              )}
                                              {isLocked && (
                                                  <span className="text-[10px] text-gray-500 uppercase">Lvl {item.minLevel}</span>
                                              )}
                                          </div>
                                      </button>
                                  );
                              })
                          )}
                      </div>
                  </motion.div>
              )}
          </AnimatePresence>
      </div>
    </div>
  );
};

export default AvatarStation;
