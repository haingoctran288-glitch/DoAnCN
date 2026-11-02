import React, { useState, useEffect } from 'react';
import { X, MapPin, Plus, Check, Edit2, Trash2 } from 'lucide-react';
import { getAddressesByUser, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '../api/addresses';
import { useToast } from '../context/ToastContext';

const AddressBookModal = ({ isOpen, onClose, userId, onSelectAddress, selectedAddressId }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [editingAddress, setEditingAddress] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '', isDefault: false });
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen && userId) {
      fetchAddresses();
    }
  }, [isOpen, userId]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await getAddressesByUser(userId);
      setAddresses(res.data);
      
      // Nếu có danh sách và chưa có selectedAddressId, hoặc selectedAddressId bị xóa
      if (res.data.length > 0 && (!selectedAddressId || !res.data.find(a => a.id === selectedAddressId))) {
        const defaultAddr = res.data.find(a => a.isDefault) || res.data[0];
        onSelectAddress(defaultAddr);
      } else if (res.data.length === 0) {
        onSelectAddress(null);
      }
    } catch (err) {
      addToast({ title: 'Lỗi', message: 'Không thể tải danh sách địa chỉ', type: 'remove' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      addToast({ title: 'Thiếu thông tin', message: 'Vui lòng điền đầy đủ thông tin', type: 'remove' });
      return;
    }

    try {
      if (view === 'add') {
        const res = await createAddress({ ...form, userId });
        addToast({ title: 'Thành công', message: 'Thêm địa chỉ mới thành công' });
        // Nếu là địa chỉ đầu tiên, chọn luôn nó
        if (addresses.length === 0) onSelectAddress(res.data);
      } else {
        await updateAddress(editingAddress.id, form);
        addToast({ title: 'Thành công', message: 'Cập nhật địa chỉ thành công' });
        // Cập nhật lại thông tin đang chọn nếu đang chọn địa chỉ này
        if (selectedAddressId === editingAddress.id) {
          onSelectAddress({ ...form, id: editingAddress.id });
        }
      }
      fetchAddresses();
      setView('list');
    } catch (err) {
      addToast({ title: 'Lỗi', message: 'Lưu địa chỉ thất bại', type: 'remove' });
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    try {
      await deleteAddress(id);
      addToast({ title: 'Thành công', message: 'Xóa địa chỉ thành công' });
      fetchAddresses();
    } catch (err) {
      addToast({ title: 'Lỗi', message: 'Xóa địa chỉ thất bại', type: 'remove' });
    }
  };

  const handleSetDefault = async (e, id) => {
    e.stopPropagation();
    try {
      await setDefaultAddress(id);
      addToast({ title: 'Thành công', message: 'Đã đặt làm địa chỉ mặc định' });
      fetchAddresses();
    } catch (err) {
      addToast({ title: 'Lỗi', message: 'Thiết lập mặc định thất bại', type: 'remove' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#111] border border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h3 className="text-xl font-heading font-bold text-white">
            {view === 'list' ? 'Địa Chỉ Của Tôi' : view === 'add' ? 'Thêm Địa Chỉ Mới' : 'Cập Nhật Địa Chỉ'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {view === 'list' ? (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-10 text-accent">Đang tải...</div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                  <MapPin className="w-12 h-12 text-gray-600 mb-3" />
                  <p>Bạn chưa có địa chỉ nào</p>
                </div>
              ) : (
                addresses.map(addr => (
                  <div 
                    key={addr.id}
                    onClick={() => { onSelectAddress(addr); onClose(); }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group flex gap-3
                      ${selectedAddressId === addr.id ? 'border-accent bg-accent/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-gray-800 hover:border-gray-600 bg-[#1a1a1a]'}
                    `}
                  >
                    <div className="pt-1 flex-shrink-0">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddressId === addr.id ? 'border-accent' : 'border-gray-500'}`}>
                        {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 bg-accent rounded-full"></div>}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">{addr.name}</span>
                        <span className="text-gray-500 text-sm">|</span>
                        <span className="text-gray-300">{addr.phone}</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2 leading-relaxed">{addr.address}</p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          {addr.isDefault && <span className="text-xs text-accent border border-accent/30 bg-accent/10 px-2 py-0.5 rounded mr-2">Mặc định</span>}
                        </div>
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!addr.isDefault && (
                            <button onClick={(e) => handleSetDefault(e, addr.id)} className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                              Thiết lập mặc định
                            </button>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); setForm(addr); setEditingAddress(addr); setView('edit'); }} className="text-gray-400 hover:text-accent">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={(e) => handleDelete(e, addr.id)} className="text-gray-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <button 
                onClick={() => { setForm({ name: '', phone: '', address: '', isDefault: false }); setView('add'); }}
                className="w-full py-4 border border-dashed border-gray-600 hover:border-accent text-gray-400 hover:text-accent rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-5 h-5" /> Thêm Địa Chỉ Mới
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Họ và tên</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nguyễn Văn A" className="w-full bg-[#1a1a1a] border border-gray-700 text-white px-4 py-3 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Số điện thoại</label>
                <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="0901 234 567" className="w-full bg-[#1a1a1a] border border-gray-700 text-white px-4 py-3 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Địa chỉ nhận hàng</label>
                <textarea required rows={3} value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" className="w-full bg-[#1a1a1a] border border-gray-700 text-white px-4 py-3 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-none" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isDefault} onChange={e => setForm({...form, isDefault: e.target.checked})} className="w-5 h-5 accent-accent" />
                <span className="text-gray-300">Đặt làm địa chỉ mặc định</span>
              </label>

              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setView('list')} className="flex-1 py-3 text-white bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition-colors">Trở Lại</button>
                <button type="submit" className="flex-1 py-3 text-primary bg-accent hover:bg-yellow-500 rounded-xl font-bold transition-colors">Hoàn Thành</button>
              </div>
            </form>
          )}
        </div>
        
        {/* Footer actions for list view */}
        {view === 'list' && (
          <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2.5 text-white bg-gray-800 hover:bg-gray-700 rounded-lg font-bold transition-colors">Đóng</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressBookModal;
