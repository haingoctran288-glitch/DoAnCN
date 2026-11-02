import React, { useRef } from 'react';
import { Camera, User, Trash2 } from 'lucide-react';

const AvatarUpload = ({ avatarUrl, onUpload, onRemove }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        onUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative group cursor-pointer w-max mx-auto" onClick={() => fileInputRef.current.click()}>
      {/* Decorative glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/30 to-transparent rounded-full z-0 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="w-32 h-32 rounded-full border-4 border-accent p-1 bg-primary flex items-center justify-center relative z-10 overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.4)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.7)] transition-all duration-300 transform group-hover:scale-105">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
        ) : (
          <User className="w-16 h-16 text-accent" />
        )}
        
        {/* Overlay hover */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
          <Camera className="w-8 h-8 text-white" />
        </div>
      </div>
      
      {/* Small camera badge */}
      <div className="absolute bottom-1 right-1 bg-accent rounded-full p-2 text-primary shadow-lg border-2 border-primary z-20 group-hover:scale-110 transition-transform">
        <Camera className="w-4 h-4" />
      </div>

      {/* Remove badge (only if avatar exists) */}
      {avatarUrl && (
        <div 
          onClick={handleRemove}
          className="absolute top-0 right-0 bg-red-500 rounded-full p-1.5 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)] border-2 border-primary z-30 hover:bg-red-600 hover:scale-110 transition-all"
          title="Xóa ảnh đại diện"
        >
          <Trash2 className="w-4 h-4" />
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default AvatarUpload;
