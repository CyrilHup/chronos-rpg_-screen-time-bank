import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from '../types';
import { User, Edit2, Save, BarChart2, Camera, X, Upload, LogOut, AlertTriangle, Settings, HelpCircle } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileProps {
  avatar: Avatar;
  lifetimeEarned: number;
  questsCompleted: number;
  onUpdateAvatar: (avatar: Avatar) => void;
  onClose: () => void;
  onResetProgress: () => void;
  onOpenSettings: () => void;
  onOpenInfo: () => void;
}

const Profile: React.FC<ProfileProps> = ({ avatar, lifetimeEarned, questsCompleted, onUpdateAvatar, onClose, onResetProgress, onOpenSettings, onOpenInfo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(avatar.name);
  const [avatarUrl, setAvatarUrl] = useState(avatar.avatarUrl || '');
  const [showCamera, setShowCamera] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sync state with props when avatar changes
  useEffect(() => {
      setName(avatar.name);
      setAvatarUrl(avatar.avatarUrl || '');
  }, [avatar]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSave = () => {
    onUpdateAvatar({
      ...avatar,
      name,
      avatarUrl: avatarUrl || undefined
    });
    setIsEditing(false);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setAvatarUrl(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zen-background/80 dark:bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 border border-zen-text-muted/10 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header */}
          <div className="p-6 border-b border-zen-text-muted/5 dark:border-white/5 flex justify-between items-center bg-white dark:bg-gray-900">
            <h2 className="text-xl font-bold text-zen-text-main dark:text-white">Operative Profile</h2>
            <div className="flex gap-2">
                <button onClick={onOpenInfo} className="p-2 rounded-full hover:bg-zen-text-muted/10 dark:hover:bg-white/10 transition-colors text-zen-text-muted dark:text-gray-400 hover:text-zen-text-main dark:hover:text-white">
                    <HelpCircle size={20} />
                </button>
                <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-zen-text-muted/10 dark:hover:bg-white/10 transition-colors text-zen-text-muted dark:text-gray-400 hover:text-zen-text-main dark:hover:text-white">
                    <Settings size={20} />
                </button>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-zen-text-muted/10 dark:hover:bg-white/10 transition-colors">
                    <X size={20} className="text-zen-text-muted dark:text-gray-400" />
                </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto space-y-8">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-900 border border-zen-text-muted/5 dark:border-white/5 rounded-3xl p-8 flex flex-col items-center space-y-6 relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-b from-zen-primary/5 to-transparent pointer-events-none" />
                
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-zen-text-muted/10 dark:bg-white/10 flex items-center justify-center overflow-hidden shadow-2xl relative">
                      {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                      <User size={48} className="text-zen-text-muted dark:text-gray-400" />
                      )}
                  </div>
                  
                  {/* Edit Overlay */}
                  {isEditing && !showCamera && (
                      <div className="absolute -bottom-2 -right-2 flex gap-2">
                        <button 
                          onClick={handleFileUpload}
                          className="p-2 bg-white dark:bg-gray-800 border border-zen-text-muted/10 dark:border-white/10 text-zen-text-main dark:text-white rounded-full shadow-lg hover:bg-zen-primary hover:text-white transition-colors"
                          title="Upload Image"
                        >
                          <Upload size={16} />
                        </button>
                        <button 
                          onClick={startCamera}
                          className="p-2 bg-white dark:bg-gray-800 border border-zen-text-muted/10 dark:border-white/10 text-zen-text-main dark:text-white rounded-full shadow-lg hover:bg-zen-primary hover:text-white transition-colors"
                          title="Take Photo"
                        >
                          <Camera size={16} />
                        </button>
                      </div>
                  )}
                </div>

                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />

                {/* Camera View */}
                {showCamera && (
                  <div className="fixed inset-0 z-[110] bg-zen-background dark:bg-gray-950 flex flex-col items-center justify-center p-4">
                    <div className="relative w-full max-w-md aspect-video bg-black rounded-2xl overflow-hidden border border-zen-text-muted/10 dark:border-white/10">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button 
                        onClick={stopCamera}
                        className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-zen-text-muted/10 dark:border-white/10 text-zen-text-main dark:text-white font-bold hover:bg-zen-text-muted/10 dark:hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={capturePhoto}
                        className="px-6 py-3 rounded-xl bg-zen-primary text-white font-bold hover:bg-zen-primary/90 transition-colors flex items-center gap-2"
                      >
                        <Camera size={20} />
                        Capture
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-center space-y-2 w-full max-w-md">
                {isEditing ? (
                    <div className="space-y-4 w-full">
                    <div>
                        <label className="text-xs text-zen-text-muted dark:text-gray-400 uppercase tracking-wider mb-1 block text-left">Codename</label>
                        <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-zen-text-muted/5 dark:bg-white/5 border border-zen-text-muted/10 dark:border-white/10 rounded-xl px-4 py-3 text-center text-zen-text-main dark:text-white font-bold focus:border-zen-primary outline-none transition-colors"
                        placeholder="Enter your codename"
                        />
                    </div>
                    </div>
                ) : (
                    <>
                    <h3 className="text-3xl font-bold text-zen-text-main dark:text-white">{avatar.name}</h3>
                    <p className="text-zen-text-muted dark:text-gray-400">{avatar.flavorText}</p>
                    </>
                )}
                </div>
                
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={clsx(
                        "w-full py-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-bold",
                        isEditing 
                        ? "bg-zen-primary text-white border-zen-primary hover:bg-zen-primary/90" 
                        : "bg-white dark:bg-gray-800 border-zen-text-muted/10 dark:border-white/10 text-zen-text-muted dark:text-gray-400 hover:text-zen-text-main dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-700"
                    )}
                >
                    {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                    <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-zen-text-main dark:text-white flex items-center gap-2">
                <BarChart2 size={20} className="text-zen-primary" />
                Performance Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white dark:bg-gray-900 border border-zen-text-muted/5 dark:border-white/5 rounded-2xl hover:bg-white/80 dark:hover:bg-gray-800 transition-colors group shadow-sm">
                    <div className="text-3xl font-bold text-zen-primary mb-1 group-hover:scale-105 transition-transform origin-left">{lifetimeEarned}</div>
                    <div className="text-xs text-zen-text-muted dark:text-gray-400 uppercase tracking-wider">Lifetime Minutes</div>
                </div>
                <div className="p-5 bg-white dark:bg-gray-900 border border-zen-text-muted/5 dark:border-white/5 rounded-2xl hover:bg-white/80 dark:hover:bg-gray-800 transition-colors group shadow-sm">
                    <div className="text-3xl font-bold text-purple-600 mb-1 group-hover:scale-105 transition-transform origin-left">{avatar.level}</div>
                    <div className="text-xs text-zen-text-muted dark:text-gray-400 uppercase tracking-wider">Clearance Level</div>
                </div>
                <div className="p-5 bg-white dark:bg-gray-900 border border-zen-text-muted/5 dark:border-white/5 rounded-2xl hover:bg-white/80 dark:hover:bg-gray-800 transition-colors group shadow-sm">
                    <div className="text-3xl font-bold text-blue-600 mb-1 group-hover:scale-105 transition-transform origin-left">{avatar.ownedCosmetics.length}</div>
                    <div className="text-xs text-zen-text-muted dark:text-gray-400 uppercase tracking-wider">Assets Acquired</div>
                </div>
                <div className="p-5 bg-white dark:bg-gray-900 border border-zen-text-muted/5 dark:border-white/5 rounded-2xl hover:bg-white/80 dark:hover:bg-gray-800 transition-colors group shadow-sm">
                    <div className="text-3xl font-bold text-green-600 mb-1 group-hover:scale-105 transition-transform origin-left">{questsCompleted}</div>
                    <div className="text-xs text-zen-text-muted dark:text-gray-400 uppercase tracking-wider">Quests Complete</div>
                </div>
                </div>
            </div>

            {/* Reset Progress Button */}
            <button 
                onClick={() => setShowResetConfirm(true)}
                className="w-full flex items-center justify-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500/20 transition-colors group text-red-500"
            >
                <LogOut size={20} />
                <span className="font-bold">Reset Progress</span>
            </button>
          </div>

          {/* Reset Confirmation Modal */}
          <AnimatePresence>
            {showResetConfirm && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-zen-background/90 dark:bg-black/90 backdrop-blur-sm p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-sm bg-white dark:bg-gray-900 border border-zen-text-muted/10 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 text-center space-y-4">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                                <AlertTriangle size={32} />
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-bold text-zen-text-main dark:text-white mb-2">Reset Progress?</h3>
                                <p className="text-zen-text-muted dark:text-gray-400 text-sm">
                                    Are you sure you want to reset all progress? This action cannot be undone and you will lose all levels, items, and history.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={() => setShowResetConfirm(false)}
                                    className="flex-1 py-3 bg-zen-text-muted/5 dark:bg-white/5 text-zen-text-main dark:text-white font-bold rounded-xl hover:bg-zen-text-muted/10 dark:hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => {
                                        onResetProgress();
                                        onClose();
                                    }}
                                    className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-400 transition-colors"
                                >
                                    Reset All
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
          </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Profile;
