import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Scissors, Clock, X, Circle, CheckCircle2, ChevronDown } from 'lucide-react';

const ServicePicker = ({ services, selectedIds = [], onConfirm, error }) => {
  const [open, setOpen] = useState(false);
  const [tempSelectedIds, setTempSelectedIds] = useState([]);
  const modalRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);

  // Sync prop to state when open
  useEffect(() => {
    if (open) {
      setTempSelectedIds([...selectedIds]);
    }
  }, [open, selectedIds]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const timer = setTimeout(() => { document.addEventListener('mousedown', handleClick); }, 10);
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handleClick); };
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const confirmedServices = services.filter(s => selectedIds.includes(String(s.id)));

  const handleOpen = () => {
    setOpen(true);
  };

  const MAIN_CATEGORY_LABELS = {
    'NAM': 'Dịch vụ Nam',
    'NU': 'Dịch vụ Nữ',
    'ALL': 'Khác'
  };

  const groupedByCategory = useMemo(() => {
    // Pre-populate main categories so they always show as tabs
    const cats = {
      'Dịch vụ Nam': { name: 'Dịch vụ Nam', mainCatKey: 'NAM', modelTypes: {} },
      'Dịch vụ Nữ': { name: 'Dịch vụ Nữ', mainCatKey: 'NU', modelTypes: {} }
    };

    services.forEach(s => {
      if (s.status !== 'active') return;

      const mainCatKey = s.mainCategory || (s.categoryType ? s.categoryType.toUpperCase() : 'ALL');
      const catName = MAIN_CATEGORY_LABELS[mainCatKey] || 'Khác';
      const modelName = s.modelType?.name || 'Chưa phân loại';

      if (!cats[catName]) {
        cats[catName] = {
          name: catName,
          mainCatKey: mainCatKey,
          modelTypes: {}
        };
      }

      if (!cats[catName].modelTypes[modelName]) {
        cats[catName].modelTypes[modelName] = [];
      }

      cats[catName].modelTypes[modelName].push(s);
    });

    const result = Object.values(cats).map(c => ({
      name: c.name,
      mainCatKey: c.mainCatKey,
      modelTypes: Object.keys(c.modelTypes).map(mName => ({
        name: mName,
        // Sort items within each model group by modelSortOrder
        items: c.modelTypes[mName].slice().sort((a, b) => (a.modelSortOrder || 0) - (b.modelSortOrder || 0))
      }))
        // Sort model groups by the lowest sortOrder of their items (per-category ordering)
        .sort((a, b) => {
          const minA = Math.min(...a.items.map(s => s.sortOrder || 0));
          const minB = Math.min(...b.items.map(s => s.sortOrder || 0));
          return minA - minB;
        })
    }));

    const order = ['NAM', 'NU', 'ALL'];
    return result.sort((a, b) => {
      let idxA = order.indexOf(a.mainCatKey);
      let idxB = order.indexOf(b.mainCatKey);
      if (idxA === -1) idxA = 99;
      if (idxB === -1) idxB = 99;
      return idxA - idxB;
    });
  }, [services]);

  useEffect(() => {
    if (open && groupedByCategory.length > 0 && !activeCategory) {
      setActiveCategory(groupedByCategory[0].name);
    }
  }, [open, groupedByCategory, activeCategory]);

  const handleToggleService = (service) => {
    const idStr = String(service.id);
    const modelTypeName = service.modelType?.name || 'Chưa phân loại';
    const modelTypeNameLower = modelTypeName.toLowerCase();
    const isSingleSelectGroup =
      modelTypeNameLower.includes('uốn') ||
      modelTypeNameLower.includes('nhuộm') ||
      modelTypeNameLower.includes('phục hồi');

    setTempSelectedIds(prev => {
      // Nếu dịch vụ đã được chọn, bỏ chọn nó
      if (prev.includes(idStr)) {
        return prev.filter(id => id !== idStr);
      }

      if (!isSingleSelectGroup) {
        return [...prev, idStr];
      }

      // Bỏ chọn dịch vụ cũ CÙNG LOẠI MÔ HÌNH
      const newSelectedIds = prev.filter(id => {
        const existingService = services.find(s => String(s.id) === id);
        if (!existingService) return false;
        const existingModelTypeName = existingService.modelType?.name || 'Chưa phân loại';
        return existingModelTypeName !== modelTypeName;
      });

      newSelectedIds.push(idStr);
      return newSelectedIds;
    });
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedIds);
    setOpen(false);
  };

  const handleClear = () => {
    setTempSelectedIds([]);
  };

  const totalDuration = confirmedServices.reduce((sum, s) => sum + (s.duration || 30), 0);
  const totalPrice = confirmedServices.reduce((sum, s) => sum + (s.price || 0), 0);

  const activeCategoryData = groupedByCategory.find(c => c.name === activeCategory);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={`w-full text-left bg-[#0a0a0a] border ${error ? 'border-red-500' : 'border-gray-700'} rounded-xl py-3.5 px-4 transition-all duration-200 cursor-pointer hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-accent flex items-center justify-between gap-3`}
      >
        {confirmedServices.length > 0 ? (
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-semibold truncate">
                Đã chọn {confirmedServices.length} dịch vụ
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {confirmedServices.map(s => (
                <span key={s.id} className="inline-block bg-[#1a1a1a] border border-gray-800 text-gray-300 text-[11px] px-2 py-0.5 rounded-full">
                  {s.name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-2.5 text-xs text-gray-500 pt-2 border-t border-gray-800/60">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {totalDuration} phút
              </span>
              <span className="text-accent font-bold">
                {Number(totalPrice).toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>
        ) : (
          <span className="text-gray-500">-- Chọn các dịch vụ cần làm --</span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 lg:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn" />

          <div
            ref={modalRef}
            className="relative w-full max-w-2xl bg-[#0d0d0d] border border-gray-800 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-slideUp"
            style={{ maxHeight: 'min(90vh, 750px)' }}
          >
            {/* Header */}
            <div className="flex flex-col border-b border-gray-800/80 shrink-0">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                    <Scissors className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-white font-heading font-bold text-lg leading-tight">Lựa chọn dịch vụ</h3>
                    <p className="text-xs text-gray-500">Các nhóm Uốn, Nhuộm, Phục hồi chỉ được chọn 1. Các nhóm khác chọn nhiều.</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-lg border border-gray-700 flex items-center justify-center text-gray-500 hover:text-white transition-colors hover:bg-gray-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category Tabs */}
              {groupedByCategory.length > 0 && (
                <div className="px-4 pb-0 pt-2 bg-[#050505]">
                  <div className="flex overflow-x-auto gap-1 hide-scrollbar">
                    {groupedByCategory.map(cat => (
                      <button
                        key={cat.name}
                        onClick={() => setActiveCategory(cat.name)}
                        className={`px-4 py-2.5 text-[13px] font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all ${activeCategory === cat.name
                            ? 'border-accent text-accent'
                            : 'border-transparent text-gray-500 hover:text-gray-300'
                          }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* List Services */}
            <div className="flex-1 overflow-y-auto p-5 lg:p-6 service-picker-scroll">
              {!activeCategoryData || activeCategoryData.modelTypes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Scissors className="w-10 h-10 text-gray-700 mb-4" />
                  <p className="text-gray-500 text-sm">Chưa có dịch vụ nào đang mở</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeCategoryData.modelTypes.map((model) => {
                    const isModelSelected = model.items.some(s => tempSelectedIds.includes(String(s.id)));
                    const isSingleSelectGroup = model.name.toLowerCase().includes('uốn') || model.name.toLowerCase().includes('nhuộm') || model.name.toLowerCase().includes('phục hồi');
                    const selectedCount = model.items.filter(s => tempSelectedIds.includes(String(s.id))).length;

                    return (
                      <div key={model.name} className="relative">
                        {/* ModelType Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <h4 className="text-[13px] font-bold uppercase tracking-wider text-white">{model.name}</h4>
                            <span className="text-[10px] text-gray-500 bg-gray-800/50 px-1.5 py-0.5 rounded uppercase tracking-wider whitespace-nowrap">
                              {isSingleSelectGroup ? 'Chỉ chọn 1' : 'Có thể kết hợp'}
                            </span>
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
                          {isModelSelected && (
                            <span className="text-[10px] bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                              Đã chọn {selectedCount}
                            </span>
                          )}
                        </div>

                        {/* Items */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {model.items.map((service) => {
                            const isSelected = tempSelectedIds.includes(String(service.id));

                            return (
                              <button
                                key={service.id}
                                type="button"
                                onClick={() => handleToggleService(service)}
                                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 group flex items-start gap-3 ${isSelected
                                    ? 'bg-accent/[0.08] border-accent/50 shadow-[0_0_12px_rgba(212,175,55,0.1)]'
                                    : 'bg-[#111] border-gray-800/60 hover:bg-white/[0.03] hover:border-accent/30'
                                  }`}
                              >
                                <div className="pt-0.5 shrink-0">
                                  {isSelected ? (
                                    <CheckCircle2 className="w-5 h-5 text-accent" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-gray-600 group-hover:text-accent/50" />
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h4 className={`font-bold text-[13px] leading-tight mb-1.5 ${isSelected ? 'text-accent' : 'text-gray-200 group-hover:text-white'}`}>
                                    {service.name}
                                  </h4>
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                      <Clock className="w-3 h-3" />
                                      <span>{service.duration} phút</span>
                                    </div>
                                    <span className={`text-[13px] font-bold ${isSelected ? 'text-accent' : 'text-gray-400'}`}>
                                      {Number(service.price).toLocaleString('vi-VN')}₫
                                    </span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="px-5 py-4 border-t border-gray-800/80 bg-[#0a0a0a] shrink-0 flex items-center justify-between gap-3">
              <button
                onClick={handleClear}
                className="px-4 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 font-semibold text-[13px] transition-colors uppercase tracking-wider"
              >
                Bỏ chọn tất cả
              </button>
              <div className="flex items-center gap-3 flex-1 justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 font-semibold text-[13px] transition-colors uppercase tracking-wider"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-6 py-2.5 rounded-xl bg-accent text-primary font-bold text-[13px] shadow-[0_4px_15px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 transition-all uppercase tracking-wider flex items-center gap-2"
                >
                  Xong
                  <span className="bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-[11px]">
                    {tempSelectedIds.length}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.25s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .service-picker-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .service-picker-scroll::-webkit-scrollbar-track { background: transparent; }
        .service-picker-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
        .service-picker-scroll::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.25); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
};

export default ServicePicker;
