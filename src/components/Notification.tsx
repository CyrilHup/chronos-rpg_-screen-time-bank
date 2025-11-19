import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
        >
          <div className="bg-zen-paper dark:bg-gray-900 border border-zen-primary/20 dark:border-zen-primary/40 shadow-lg rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zen-primary/20 flex items-center justify-center text-zen-primary shrink-0">
              <CheckCircle size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-zen-text-main dark:text-white">{message}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-zen-text-muted dark:text-gray-400 hover:text-zen-text-main dark:hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
