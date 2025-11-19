import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_ITEMS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoFAQProps {
    onBack: () => void;
}

const InfoFAQ: React.FC<InfoFAQProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs = FAQ_ITEMS.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 pb-24 h-full flex flex-col animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-white">Info & FAQ</h2>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
            type="text" 
            placeholder="Search questions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-zen-primary transition-colors"
        />
      </div>

      <div className="space-y-4 overflow-y-auto flex-1 scrollbar-hide">
        {filteredFAQs.map((item, index) => (
            <div key={index} className="bg-zen-paper/40 border border-white/5 rounded-xl overflow-hidden">
                <button 
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                >
                    <span className="font-medium text-gray-200 text-sm">{item.question}</span>
                    {openIndex === index ? <ChevronUp size={16} className="text-zen-primary" /> : <ChevronDown size={16} className="text-gray-500" />}
                </button>
                <AnimatePresence>
                    {openIndex === index && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 pt-0 text-sm text-gray-400 leading-relaxed border-t border-white/5">
                                {item.answer}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        ))}
        
        {filteredFAQs.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
                No results found for "{searchQuery}"
            </div>
        )}
      </div>
    </div>
  );
};

export default InfoFAQ;
