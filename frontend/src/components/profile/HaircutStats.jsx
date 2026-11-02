import React from 'react';
import { Scissors, Star, Crown, Flame, Gem, Sparkles } from 'lucide-react';

const rankStyles = {
  tier1: { icon: <Star className="w-12 h-12 text-yellow-200" />, color: 'text-yellow-200', glow: 'shadow-[0_0_20px_rgba(254,240,138,0.5)]', bg: 'bg-yellow-900/20' },
  tier2: { icon: <Crown className="w-12 h-12 text-rose-500" />, color: 'text-rose-500', glow: 'shadow-[0_0_25px_rgba(244,63,94,0.6)]', bg: 'bg-rose-900/20' },
  tier3: { icon: <Flame className="w-12 h-12 text-orange-600" />, color: 'text-orange-600', glow: 'shadow-[0_0_30px_rgba(234,88,12,0.7)]', bg: 'bg-orange-900/30' },
  tier4: { icon: <Gem className="w-12 h-12 text-cyan-400" />, color: 'text-cyan-400', glow: 'shadow-[0_0_35px_rgba(34,211,238,0.8)]', bg: 'bg-cyan-900/30' },
  tier5: { icon: <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />, color: 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-yellow-400', glow: 'shadow-[0_0_40px_rgba(192,132,252,0.8)]', bg: 'bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-yellow-900/40' },
};

const HaircutStats = ({ visits }) => {
  let activeTier = rankStyles.tier1;
  let rankName = 'Ngôi Sao Mới';

  if (visits >= 51) {
    activeTier = rankStyles.tier5;
    rankName = 'Vũ Trụ Nhan Sắc';
  } else if (visits >= 26) {
    activeTier = rankStyles.tier4;
    rankName = 'Biểu Tượng Thời Đại';
  } else if (visits >= 11) {
    activeTier = rankStyles.tier3;
    rankName = 'Sát Thủ Lịch Lãm';
  } else if (visits >= 4) {
    activeTier = rankStyles.tier2;
    rankName = 'Người Của Công Chúng';
  }

  return (
    <div className="grid grid-cols-1 gap-4 mt-8 pt-8 border-t border-gray-800 lg:w-[80%]">
      <div className={`rounded-xl p-6 border border-gray-800 relative overflow-hidden flex items-center justify-between group transition-all duration-500 hover:-translate-y-1 ${activeTier.bg}`}>

        <div className="relative z-10 w-1/2">
          <div className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Số lần cắt tóc tại tiệm</div>
          <div className="text-5xl md:text-6xl font-bold text-white flex items-baseline gap-2">
            {visits}
            <span className="text-lg font-normal text-gray-500">lần</span>
          </div>
        </div>

        {/* Badge Area */}
        <div className="relative z-10 w-1/2 flex flex-col items-center border-l-2 border-dashed border-gray-700/50 pl-4 space-y-3">
          <div className={`p-4 rounded-full bg-black/40 border border-gray-700/50 group-hover:${activeTier.glow} transition-all duration-500 transform group-hover:scale-110`}>
            {activeTier.icon}
          </div>
          <span className={`text-sm md:text-base font-bold text-center ${activeTier.color} uppercase tracking-wider drop-shadow-md`}>
            {rankName}
          </span>
        </div>

        <Scissors className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 text-gray-800/20 z-0 opacity-20 group-hover:rotate-12 transition-transform duration-700" />
      </div>
    </div>
  );
};

export default HaircutStats;
