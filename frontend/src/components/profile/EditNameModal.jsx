import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const EditNameModal = ({ isOpen, currentName, onClose, onSave }) => {
  const [name, setName] = useState(currentName);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-2xl border border-gray-800 shadow-2xl overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h3 className="text-xl font-heading font-bold text-white">Chỉnh Sửa Tên</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-accent transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
            Họ và tên mới
          </label>
          <input
            type="text"
            required
            autoFocus
            className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 mb-6"
            placeholder="Nhập tên mới..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Footer */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-transparent border border-gray-700 text-gray-300 font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="w-1/2 flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-yellow-600 text-primary font-bold py-3 px-4 rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 uppercase tracking-wider text-sm transform hover:-translate-y-0.5"
            >
              <Save className="w-4 h-4" /> Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNameModal;
