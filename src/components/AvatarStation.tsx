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
            <h2 className="text-3xl font-bold text-zen-text-main dark:text-white">{avatar.name}</h2>
            <p className="text-xs text-zen-text-muted dark:text-gray-400 uppercase tracking-widest mb-1">Customize your digital projection</p>
          </div>
      </div>

      {/* 3D Avatar Viewer - Fixed Height and Visibility */}
      <div className="relative h-[350px] w-full bg-white dark:bg-gray-900 rounded-3xl border border-zen-text-muted/10 dark:border-white/10 overflow-hidden group shrink-0">
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-zen-text-muted/10 dark:bg-white/10 px-3 py-1.5 rounded-full border border-zen-text-muted/10 dark:border-white/10">
            <Hourglass size={14} className="text-zen-accent" />
            <span className="text-sm font-bold text-zen-text-main dark:text-white">{timeBank} min</span>
        </div>

        {/* Cheat Button - Made more visible */}
        <button 
            onClick={onCheatXP}
            className="absolute top-4 left-4 z-20 p-2 bg-red-500/10 rounded-full border border-red-500/20 hover:bg-red-500/20 text-red-500 transition-all"
            title="Cheat: +50 Minutes"
        >
            <Bug size={16} />
        </button>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zen-primary/20 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <AvatarRenderer avatar={avatar} className="w-full h-full z-10 relative" />
      </div>

      {/* Evolution Progress */}
      <div className="shrink-0 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-zen-text-muted/10 dark:border-white/10 shadow-sm">
          <div className="flex justify-between items-end mb-2">
            <div>
                <h3 className="text-sm font-bold text-zen-text-main dark:text-white">Evolution Progress</h3>
                <p className="text-[10px] text-zen-text-muted dark:text-gray-400">
                    {avatar.evolutionStage >= 5 ? 'Max Evolution Reached' : `Next evolution at Level ${avatar.evolutionStage * 5}`}
                </p>
            </div>
            <span className="text-xs font-bold text-zen-primary">Stage {avatar.evolutionStage}/5</span>
          </div>
          
          {/* Level Progress */}
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-zen-primary/50 to-zen-primary transition-all duration-500 relative" 
                style={{ width: `${(avatar.experience / (avatar.level * 100)) * 100}%` }} 
              >
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 blur-[2px]" />
              </div>
          </div>
          
          <div className="flex justify-between items-center mt-1.5">
              <span className="text-[10px] text-zen-text-muted dark:text-gray-400">Lvl {avatar.level}</span>
              <span className="text-[10px] font-mono text-zen-primary">{avatar.experience} / {avatar.level * 100} XP</span>
              <span className="text-[10px] text-zen-text-muted dark:text-gray-400">Lvl {avatar.level + 1}</span>
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
                      <h3 className="text-lg font-bold text-zen-text-main dark:text-white">Equipment</h3>
                      <div className="grid grid-cols-5 gap-3">
                          {slots.map((slot) => {
                              const equippedId = avatar.equippedCosmetics[slot.id];
                              const equippedItem = COSMETIC_SHOP_ITEMS.find(i => i.id === equippedId);

                              return (
                                  <button 
                                      key={slot.id}
                                      onClick={() => setSelectedSlot(slot.id)}
                                      className="aspect-square rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all bg-white dark:bg-gray-900 border-zen-text-muted/10 dark:border-white/10 hover:bg-white/80 dark:hover:bg-gray-800 hover:border-zen-text-muted/20 dark:hover:border-white/20 shadow-sm"
                                  >
                                      <div className={clsx(
                                          "w-8 h-8 rounded-full flex items-center justify-center",
                                          equippedItem ? "bg-zen-primary text-white" : "bg-zen-text-muted/10 dark:bg-white/10 text-zen-text-muted dark:text-gray-400"
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
                                      <span className="text-[10px] uppercase tracking-wider font-bold text-zen-text-muted dark:text-gray-400">{slot.label}</span>
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
                            className="p-2 rounded-lg hover:bg-zen-text-muted/10 dark:hover:bg-white/10 transition-colors"
                          >
                              <ArrowLeft size={20} className="text-zen-text-main dark:text-white" />
                          </button>
                          <h3 className="text-lg font-bold text-zen-text-main dark:text-white capitalize">{selectedSlot} Collection</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 pb-4">
                          {/* Unequip Option */}
                          <button 
                            onClick={() => onEquipCosmetic({ type: selectedSlot, id: null } as any)}
                            className={clsx(
                                "relative p-3 rounded-xl border text-left transition-all group flex flex-col gap-2 shadow-sm",
                                !avatar.equippedCosmetics[selectedSlot]
                                    ? "bg-zen-primary/20 border-zen-primary"
                                    : "bg-white dark:bg-gray-900 border-zen-text-muted/10 dark:border-white/10 hover:border-red-400/50 hover:bg-red-500/10"
                            )}
                          >
                              <div className={clsx(
                                  "w-8 h-8 rounded-full flex items-center justify-center",
                                  !avatar.equippedCosmetics[selectedSlot] ? "bg-zen-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-zen-text-muted dark:text-gray-400"
                              )}>
                                  <X size={14} />
                              </div>
                              <div className="font-bold text-zen-text-main dark:text-white text-xs">None</div>
                              <div className="text-[10px] text-zen-text-muted dark:text-gray-400">Unequip item</div>
                          </button>
                          {filteredItems.length === 0 ? (
                              <div className="col-span-2 text-center py-8 text-zen-text-muted dark:text-gray-500 italic">
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
                                            "relative p-3 rounded-xl border text-left transition-all group shadow-sm",
                                            isEquipped
                                                ? "bg-zen-primary/20 border-zen-primary"
                                                : isOwned 
                                                    ? "bg-white dark:bg-gray-900 border-zen-text-muted/10 dark:border-white/10 hover:bg-white/80 dark:hover:bg-gray-800" 
                                                    : isLocked
                                                        ? "bg-gray-100 dark:bg-gray-800 border-zen-text-muted/5 dark:border-white/5 opacity-50 cursor-not-allowed"
                                                        : canAfford
                                                            ? "bg-white dark:bg-gray-900 border-zen-text-muted/10 dark:border-white/10 hover:border-zen-primary hover:bg-white/80 dark:hover:bg-gray-800"
                                                            : "bg-white dark:bg-gray-900 border-red-500/20 cursor-not-allowed"
                                        )}
                                      >
                                          <div className="flex justify-between items-start mb-2">
                                              <div className={clsx(
                                                  "w-8 h-8 rounded-full flex items-center justify-center",
                                                  isEquipped ? "bg-zen-primary text-white" : isOwned ? "bg-zen-primary/20 text-zen-primary" : "bg-gray-200 dark:bg-gray-700 text-zen-text-muted dark:text-gray-400"
                                              )}>
                                                  {item.icon === 'Circle' && <Circle size={14} />}
                                                  {item.icon === 'Glasses' && <Glasses size={14} />}
                                                  {item.icon === 'Code' && <Zap size={14} />}
                                                  {item.icon === 'Feather' && <Crown size={14} />}
                                                  {item.icon === 'Flower' && <Flower size={14} />}
                                                  {item.icon === 'Shirt' && <Shirt size={14} />}
                                                  {item.icon === 'Moon' && <Moon size={14} />}
                                              </div>
                                              {isLocked && <Lock size={12} className="text-zen-text-muted dark:text-gray-400" />}
                                              {isEquipped && <div className="w-2 h-2 rounded-full bg-zen-primary animate-pulse" />}
                                          </div>
                                          
                                          <div className="space-y-0.5">
                                              <div className="font-bold text-zen-text-main dark:text-white text-xs">{item.name}</div>
                                              <div className="text-[10px] text-zen-text-muted dark:text-gray-400 line-clamp-1">{item.description}</div>
                                          </div>

                                          <div className="mt-2 flex items-center justify-between">
                                              {isOwned ? (
                                                  <span className={clsx("text-[10px] font-bold uppercase tracking-wider", isEquipped ? "text-zen-primary" : "text-zen-text-muted dark:text-gray-400")}>
                                                      {isEquipped ? "Equipped" : "Owned"}
                                                  </span>
                                              ) : (
                                                  <div className={clsx("flex items-center gap-1 text-xs font-bold", canAfford ? "text-zen-accent" : "text-red-500")}>
                                                      <Hourglass size={10} />
                                                      {item.cost} min
                                                  </div>
                                              )}
                                              {isLocked && (
                                                  <span className="text-[10px] text-zen-text-muted dark:text-gray-400 uppercase">Lvl {item.minLevel}</span>
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
