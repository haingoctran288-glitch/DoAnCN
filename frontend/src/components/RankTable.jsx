import React from 'react';

const ranks = [
  { min: 1, max: 3, title: 'Ngôi Sao Mới', perk: 'Đang trong quá trình huấn luyện nhan sắc' },
  { min: 4, max: 10, title: 'Người Của Công Chúng', perk: 'Đi cắt tóc mà dân tình cứ ngỡ đi thảm đỏ' },
  { min: 11, max: 25, title: 'Sát Thủ Lịch Lãm', perk: 'Cắt xong là đi "hạ gục" bao nhiêu ánh nhìn' },
  { min: 26, max: 50, title: 'Biểu Tượng Thời Đại', perk: 'Mỗi kiểu tóc bạn cắt đều trở thành xu hướng mới' },
  { min: 51, max: Infinity, title: 'Vũ Trụ Nhan Sắc', perk: 'Vượt ra ngoài tầm Trái Đất, đẹp bất chấp mọi quy luật vật lý', displayRange: '> 50' },
];

const RankTable = ({ currentVisitCount }) => {
  return (
    <div className="w-full bg-card rounded-2xl border border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.4)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 border-b-2 border-accent">
              <th className="py-4 px-6 text-accent font-bold uppercase tracking-wider text-sm whitespace-nowrap">
                Số lần cắt
              </th>
              <th className="py-4 px-6 text-accent font-bold uppercase tracking-wider text-sm whitespace-nowrap border-l border-gray-800">
                Phong tước
              </th>
              <th className="py-4 px-6 text-accent font-bold uppercase tracking-wider text-sm border-l border-gray-800">
                Đặc quyền tinh thần
              </th>
            </tr>
          </thead>
          <tbody>
            {ranks.map((rank, index) => {
              const isCurrentRank = currentVisitCount >= rank.min && currentVisitCount <= rank.max;
              
              return (
                <tr 
                  key={index} 
                  className={`border-b border-gray-800 transition-colors ${
                    isCurrentRank ? 'bg-accent/10' : 'hover:bg-gray-800/50'
                  }`}
                >
                  <td className={`py-4 px-6 font-medium whitespace-nowrap ${isCurrentRank ? 'text-white' : 'text-gray-400'}`}>
                    {rank.displayRange || `${rank.min} - ${rank.max}`}
                  </td>
                  <td className={`py-4 px-6 border-l border-gray-800 font-bold ${isCurrentRank ? 'text-accent' : 'text-white'}`}>
                    {rank.title}
                  </td>
                  <td className={`py-4 px-6 border-l border-gray-800 text-sm ${isCurrentRank ? 'text-gray-200' : 'text-gray-400'}`}>
                    {rank.perk}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankTable;
