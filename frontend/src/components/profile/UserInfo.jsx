import React from 'react';
import { Mail, Calendar, Edit3, KeyRound, Gift } from 'lucide-react';

const UserInfo = ({ userData, onEditName, onChangePass }) => {
  return (
    <div className="flex-grow w-full text-center md:text-left space-y-6 md:mt-4">
      <div>
        <h3 className="text-3xl font-heading font-bold text-white mb-3 flex items-center justify-center md:justify-start gap-3">
          {userData.name}
          <button 
            onClick={onEditName} 
            className="text-gray-500 hover:text-accent transition-colors pb-1"
            title="Đổi tên"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        </h3>
        <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-400">
          <span className="flex items-center justify-center md:justify-start gap-2">
            <Mail className="w-4 h-4 text-accent" /> {userData.email}
          </span>
          {userData.birthday && (
            <>
              <span className="hidden md:block text-gray-600">|</span>
              <span className="flex items-center justify-center md:justify-start gap-2">
                <Gift className="w-4 h-4 text-accent" /> Sinh nhật: {userData.birthday}
              </span>
            </>
          )}
          <span className="hidden md:block text-gray-600">|</span>
          <span className="flex items-center justify-center md:justify-start gap-2">
            <Calendar className="w-4 h-4 text-accent" /> Gia nhập: {userData.joinedDate}
          </span>
        </div>
      </div>

      {/* Hành động sửa thông tin */}
      <div className="flex justify-center md:justify-start pt-2">
        <button
          onClick={onChangePass}
          className="flex items-center gap-2 text-sm text-accent hover:text-primary border border-accent hover:bg-accent px-4 py-2.5 rounded-lg transition-all font-bold uppercase tracking-wider shadow-[0_4px_14px_0_rgba(212,175,55,0.1)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)]"
        >
          <KeyRound className="w-4 h-4" /> Đổi mật khẩu
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
