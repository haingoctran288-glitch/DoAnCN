import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Clock, User, Phone, Mail, Scissors, CreditCard, Loader2, CheckCircle2, ChevronDown, X, MapPin, Star, Award, HelpCircle, Sun, Moon, Ticket } from 'lucide-react';
import { getServices } from '../api/services';
import { getStaff } from '../api/staff';
import { createBooking } from '../api/bookings';
import { useToast } from '../context/ToastContext';
import ServicePicker from '../components/ServicePicker';
import BookingWarningModal from '../components/BookingWarningModal';
import axios from 'axios';

const BRANCHES = ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 7', 'Quận 9', 'Bình Thạnh'];

const TIME_SLOTS = [
  '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45',
  '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45',
  '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45',
  '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45',
  '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45',
  '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45',
  '20:00', '20:15', '20:30', '20:45', '21:00'
];

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const authShown = useRef(false);

  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    serviceIds: [],
    staffId: null,
    branch: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    bookingDate: '',
    bookingTime: '',
    paymentMethod: 'VNPAY',
    note: '',
  });

  const [errors, setErrors] = useState({});
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [staffFilterBranch, setStaffFilterBranch] = useState('all');
  const [warningMessage, setWarningMessage] = useState('');
  const [busySlots, setBusySlots] = useState([]);
  const [overlapModalType, setOverlapModalType] = useState(null); // 'booked' | 'not_enough_time' | null
  const [warningAccepted, setWarningAccepted] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  // Voucher states
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [claimingVoucher, setClaimingVoucher] = useState(false);
  const userId = localStorage.getItem('userId') || 0;

  const fetchVouchers = () => {
    if (userId > 0) {
      const token = localStorage.getItem('token');
      axios.get(`http://localhost:8080/api/customer-vouchers/my-vouchers`, {
        params: { userId, status: 'UNUSED' },
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const list = (res.data || []).filter(cv => {
          const v = cv.voucher;
          if (!v) return false;
          const matchesScope = v.applyTo === 'ALL' || v.applyTo === 'SERVICE';
          return matchesScope;
        });
        setVouchers(list);
      })
      .catch(err => console.error('Lỗi tải voucher:', err));
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [userId]);

  const handleClaimVoucher = async () => {
    if (!voucherCodeInput.trim()) {
      addToast({ title: 'Lỗi', message: 'Vui lòng nhập mã voucher', type: 'remove' });
      return;
    }
    setClaimingVoucher(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8080/api/customer-vouchers/claim`, 
        { userId, code: voucherCodeInput.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast({ title: 'Thành công', message: 'Lưu mã voucher thành công!' });
      setVoucherCodeInput('');
      fetchVouchers();
    } catch (err) {
      addToast({ 
        title: 'Lỗi', 
        message: err.response?.data?.message || 'Không thể lưu mã voucher', 
        type: 'remove' 
      });
    } finally {
      setClaimingVoucher(false);
    }
  };

  // Auto-close modal after 10s
  useEffect(() => {
    let timer;
    if (overlapModalType) {
      timer = setTimeout(() => {
        setOverlapModalType(null);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [overlapModalType]);

  // Fetch availability when staff, date, or service changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (form.bookingDate && form.staffId && form.serviceIds && form.serviceIds.length > 0) {
        try {
          const response = await axios.get(`http://localhost:8080/api/bookings/check-availability`, {
            params: {
              barberId: form.staffId,
              date: form.bookingDate,
              _t: new Date().getTime() // Cache buster
            }
          });
          setBusySlots(response.data);
          
          // Check if current selected time becomes invalid
          if (form.bookingTime) {
             const selectedSvcs = services.filter(s => form.serviceIds.includes(String(s.id)));
             const duration = selectedSvcs.reduce((sum, s) => sum + (s.duration || 30), 0) || 30;
             const timeToMins = (t) => {
               if (!t) return 0;
               const [h, m] = t.split(':').map(Number);
               return h * 60 + m;
             };
             const newStart = timeToMins(form.bookingTime);
             const newEnd = newStart + duration;
             const isInvalid = response.data.some(b => {
                const existingStart = timeToMins(b.bookingTime);
                const existingEnd = existingStart + (b.duration || 30);
                return newStart < existingEnd && newEnd > existingStart;
             });
             if (isInvalid) {
                handleChange('bookingTime', '');
             }
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra lịch:", error);
        }
      } else {
         setBusySlots([]);
      }
    };
    fetchAvailability();
  }, [form.bookingDate, form.staffId, form.serviceIds, services]);

  // Helper functions for checking overlap
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const getSlotStatus = (slotTime) => {
    if (!form.serviceIds || form.serviceIds.length === 0 || busySlots.length === 0) return 'available';
    const selectedSvcs = services.filter(s => form.serviceIds.includes(String(s.id)));
    const duration = selectedSvcs.reduce((sum, s) => sum + (s.duration || 30), 0) || 30;

    const newStart = timeToMinutes(slotTime);
    const newEnd = newStart + duration;

    let isBooked = false;
    let isNotEnoughTime = false;

    for (const b of busySlots) {
      const existingStart = timeToMinutes(b.bookingTime);
      const existingEnd = existingStart + (b.duration || 30);
      
      if (newStart >= existingStart && newStart < existingEnd) {
        isBooked = true;
        break;
      }
      
      if (newStart < existingEnd && newEnd > existingStart) {
        isNotEnoughTime = true;
      }
    }

    if (isBooked) return 'booked';
    if (isNotEnoughTime) return 'not_enough_time';
    return 'available';
  };

  // Auto-close warning message after 6 seconds
  useEffect(() => {
    let timer;
    if (warningMessage) {
      timer = setTimeout(() => {
        setWarningMessage('');
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [warningMessage]);

  // Xóa booking PENDING còn sót lại khi user quay về mà không thanh toán
  useEffect(() => {
    const pendingId = localStorage.getItem('pendingBookingId');
    if (pendingId) {
      // Xóa booking PENDING khỏi DB (không cần giữ lại)
      axios.delete(`http://localhost:8080/api/bookings/${pendingId}`)
        .catch(err => console.error('Failed to delete pending booking', err))
        .finally(() => {
          localStorage.removeItem('pendingBookingId');
        });
    }
  }, []);

  // Load data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (!authShown.current) {
        authShown.current = true;
        addToast({ title: 'Yêu Cầu Đăng Nhập', message: 'Để trải nghiệm tốt nhất, vui lòng đăng nhập trước khi sử dụng chức năng Đặt lịch!', type: 'auth_warning' });
      }
      navigate('/login');
      return;
    }

    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const [svc, staff] = await Promise.all([getServices(), getStaff()]);
        setServices(svc);
        setStaffList(staff);

        // Chuẩn bị dữ liệu auto-fill
        let autoFillData = {};

        // 1. Lấy serviceId hoặc branch từ navigation state
        if (location.state?.serviceId) {
          autoFillData.serviceIds = [String(location.state.serviceId)];
        }
        if (location.state?.branch) {
          autoFillData.branch = location.state.branch;
        }

        // 2. Lấy thông tin user từ localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            autoFillData.customerName = user.fullName || '';
            autoFillData.customerPhone = user.phone || '';
            autoFillData.customerEmail = user.email || '';
          } catch (e) { /* ignore */ }
        }

        // Cập nhật form một lần duy nhất
        if (Object.keys(autoFillData).length > 0) {
          setForm(prev => ({ ...prev, ...autoFillData }));
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.state]);


  const selectedServices = services.filter(s => form.serviceIds.includes(String(s.id)));
  const selectedStaff = staffList.find(s => s.id === Number(form.staffId));

  const subtotal = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
  const discountAmount = selectedVoucher ? (
    selectedVoucher.voucher.voucherType === 'PERCENTAGE' 
      ? Math.min((subtotal * selectedVoucher.voucher.value) / 100, selectedVoucher.voucher.maxDiscount || Infinity)
      : selectedVoucher.voucher.value
  ) : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (['serviceIds', 'staffId', 'branch', 'bookingDate', 'bookingTime'].includes(field)) {
      setWarningAccepted(false);
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSelectStaff = (barber) => {
    if (!barber) {
      handleChange('staffId', '');
      setIsStaffModalOpen(false);
      return;
    }
    
    if (form.branch && barber.branch !== form.branch) {
      setWarningMessage(`Bạn đang chọn chi nhánh ${form.branch} thì không thể chọn thợ của chi nhánh khác. Vui lòng chọn thợ của chi nhánh ${form.branch}.`);
      return;
    }

    handleChange('staffId', barber.id);
    if (!form.branch && barber.branch) {
      handleChange('branch', barber.branch);
    }
    setIsStaffModalOpen(false);
  };

  const handleSelectBranch = (branch) => {
    handleChange('branch', branch);
    handleChange('staffId', null);
    setIsBranchModalOpen(false);
    
    if (branch !== '') {
      setTimeout(() => {
        setStaffFilterBranch(branch);
        setIsStaffModalOpen(true);
      }, 100);
    }
  };

  // Get predefined dates for compact date picker
  const todayObj = new Date();
  const getIsoDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const todayStr = getIsoDate(todayObj);
  const tomorrowObj = new Date(todayObj); tomorrowObj.setDate(todayObj.getDate() + 1);
  const tomorrowStr = getIsoDate(tomorrowObj);
  const dayAfterObj = new Date(todayObj); dayAfterObj.setDate(todayObj.getDate() + 2);
  const dayAfterStr = getIsoDate(dayAfterObj);

  const getDayName = (isoString) => {
    if (isoString === todayStr) return 'Hôm nay';
    if (isoString === tomorrowStr) return 'Ngày mai';
    const d = new Date(isoString);
    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return dayNames[d.getDay()];
  };

  const formatDateDisplay = (isoString) => {
    const [y, m, d] = isoString.split('-');
    return `${d}/${m}/${y}`;
  };

  // Define the base shortcut dates
  const shortcutDates = [todayStr, tomorrowStr, dayAfterStr];
  
  // If selected date is not in shortcuts, add it
  if (form.bookingDate && !shortcutDates.includes(form.bookingDate)) {
    shortcutDates.push(form.bookingDate);
  }

  const getFilteredTimeSlots = (slots) => {
    if (form.bookingDate !== todayStr) return slots;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return slots.filter(slot => {
      const [h, m] = slot.split(':').map(Number);
      const slotMinutes = h * 60 + m;
      return slotMinutes > currentMinutes;
    });
  };

  const MORNING_SLOTS = getFilteredTimeSlots(TIME_SLOTS.filter(t => parseInt(t.split(':')[0]) < 12));
  const AFTERNOON_SLOTS = getFilteredTimeSlots(TIME_SLOTS.filter(t => parseInt(t.split(':')[0]) >= 12 && parseInt(t.split(':')[0]) < 18));
  const EVENING_SLOTS = getFilteredTimeSlots(TIME_SLOTS.filter(t => parseInt(t.split(':')[0]) >= 18));

  // Today date string for min attribute
  const today = todayStr;

  const validate = () => {
    const errs = {};
    if (!form.serviceIds || form.serviceIds.length === 0) errs.serviceIds = 'Vui lòng chọn ít nhất 1 dịch vụ';
    if (!form.branch) errs.branch = 'Vui lòng chọn chi nhánh';
    if (!form.customerName.trim()) errs.customerName = 'Vui lòng nhập họ tên';
    if (!form.customerPhone.trim()) errs.customerPhone = 'Vui lòng nhập SĐT';
    else if (!/^0\d{9}$/.test(form.customerPhone.trim())) errs.customerPhone = 'SĐT không hợp lệ (VD: 0912345678)';
    if (!form.customerEmail.trim()) errs.customerEmail = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) errs.customerEmail = 'Email không hợp lệ';
    if (!form.bookingDate) errs.bookingDate = 'Vui lòng chọn ngày';
    if (!form.bookingTime) errs.bookingTime = 'Vui lòng chọn giờ';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    if (!warningAccepted) {
      // PRE-CHECK DOUBLE BOOKING
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const checkRes = await axios.get(`http://localhost:8080/api/bookings/my-bookings`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const myBookings = checkRes.data || [];
          
          // Find any booking that overlaps exactly on date and time
          const conflict = myBookings.find(b => 
            b.bookingDate === form.bookingDate && 
            b.bookingTime && b.bookingTime.substring(0, 5) === form.bookingTime &&
            b.status !== 'CANCELLED'
          );
          
          if (conflict) {
            // Found a conflict!
            const conflictBranch = conflict.staff?.branch || 'không xác định';
            if (conflictBranch === form.branch) {
               // STRICT LOCK - Same branch
               setOverlapModalType('double_booking_same_branch');
               return;
            } else {
               // WARNING - Different branch
               setOverlapModalType('double_booking_diff_branch');
               return;
            }
          }
        }
      } catch (err) {
        console.error('Lỗi check double booking:', err);
      }

      setIsWarningModalOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      const bookingData = {
        ...form,
        serviceIds: form.serviceIds.map(id => Number(id)),
        staffId: form.staffId ? Number(form.staffId) : null,
        customerVoucherId: selectedVoucher ? selectedVoucher.id : null,
      };
      const booking = await createBooking(bookingData);

      // Tạo payment request
      if (form.paymentMethod === 'VNPAY' || form.paymentMethod === 'MOMO') {
        // Lưu bookingId vào localStorage để callback page biết
        localStorage.setItem('pendingBookingId', booking.id);

        const paymentEndpoint = form.paymentMethod === 'VNPAY'
          ? 'http://localhost:8080/api/payment/vnpay/create/booking'
          : 'http://localhost:8080/api/payment/momo/create/booking';

        // Gọi API lấy link thanh toán
        const res = await axios.post(paymentEndpoint, { 
          bookingId: booking.id,
          returnUrl: `${window.location.origin}/payment-return`
        });
        if (res.data && res.data.paymentUrl) {
          window.location.href = res.data.paymentUrl;
          return;
        } else {
          addToast('Lỗi khi tạo giao dịch thanh toán', 'error');
        }
      }
    } catch (err) {
      addToast('Đặt lịch thất bại. Vui lòng thử lại.', 'error');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-primary text-white font-sans relative">
      <BookingWarningModal
        open={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        branch={form.branch}
        bookingTime={form.bookingDate && form.bookingTime ? `${form.bookingTime} - ${form.bookingDate.split('-').reverse().join('/')}` : ''}
        onAccepted={() => {
          setWarningAccepted(true);
          setIsWarningModalOpen(false);
        }}
      />
      
      {/* Overlap Modal */}
      {overlapModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`bg-[#111] border ${overlapModalType === 'booked' || overlapModalType === 'double_booking_same_branch' ? 'border-red-500/50' : 'border-orange-500/50'} rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-md w-full p-6 text-center transform scale-100 animate-in zoom-in-95 duration-300 relative overflow-hidden`}>
            {/* Glow effect */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 ${overlapModalType === 'booked' || overlapModalType === 'double_booking_same_branch' ? 'bg-red-500/10' : 'bg-orange-500/10'} blur-[60px] -z-10 rounded-full`}></div>
            
            <div className="flex justify-center mb-4">
              <div className={`w-14 h-14 ${overlapModalType === 'booked' || overlapModalType === 'double_booking_same_branch' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-orange-500/10 border-orange-500/30 text-orange-500'} border rounded-full flex items-center justify-center`}>
                {overlapModalType === 'booked' || overlapModalType === 'double_booking_same_branch' ? <X className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
              </div>
            </div>
            
            <h3 className={`text-xl font-heading font-bold mb-3 ${overlapModalType === 'booked' || overlapModalType === 'double_booking_same_branch' ? 'text-red-500' : 'text-orange-400'}`}>
              {overlapModalType === 'booked' ? '❌ Khung giờ đã được đặt' : 
               overlapModalType === 'double_booking_same_branch' ? '❌ PHÁT HIỆN TRÙNG LỊCH' : 
               overlapModalType === 'double_booking_diff_branch' ? '⚠️ CẢNH BÁO TRÙNG LỊCH' :
               '⏱️ Không đủ thời gian'}
            </h3>
            
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              {overlapModalType === 'booked' 
                ? 'Khung giờ này đã được khách khác đặt trước. Vui lòng chọn thời gian khác phù hợp hơn. Cảm ơn bạn.'
                : overlapModalType === 'double_booking_same_branch'
                ? 'Chúng tôi phát hiện bạn đã có một lịch hẹn vào CHÍNH XÁC khung giờ này tại cùng một chi nhánh. Để tránh lãng phí tiền cọc và đảm bảo quyền lợi, hệ thống đã khóa việc đặt trùng lịch. Vui lòng kiểm tra lại Lịch sử đặt lịch của bạn.'
                : overlapModalType === 'double_booking_diff_branch'
                ? 'Bạn đã có một lịch hẹn vào khung giờ này nhưng ở chi nhánh khác. Nếu bạn đang "đặt lịch dùm người khác", bạn có thể tiếp tục. Nếu không, hãy kiểm tra lại thời gian để tránh bị trùng lịch di chuyển nhé!'
                : 'Khung giờ bạn chọn hiện không đủ thời gian để hoàn thành dịch vụ này. Vui lòng chọn khung giờ khác phù hợp hơn. Rất xin lỗi về sự bất tiện này.'}
            </p>
            
            {overlapModalType === 'double_booking_diff_branch' ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                     setOverlapModalType(null);
                     setWarningAccepted(true);
                     setTimeout(() => {
                         handleSubmit();
                     }, 100);
                  }}
                  className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 hover:border-orange-500/50 border border-transparent font-bold py-3 px-8 rounded-xl w-full transition-all tracking-wider text-sm sm:text-base"
                >
                  Vẫn tiếp tục (Tôi đặt hộ người khác)
                </button>
                <button
                  onClick={() => setOverlapModalType(null)}
                  className="text-gray-400 hover:text-white py-2 font-medium"
                >
                  Hủy bỏ
                </button>
              </div>
            ) : (
              <button
                onClick={() => setOverlapModalType(null)}
                className={`${overlapModalType === 'booked' || overlapModalType === 'double_booking_same_branch' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:border-red-500/50' : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 hover:border-orange-500/50'} border border-transparent font-bold py-3 px-8 rounded-xl w-full transition-all uppercase tracking-wider`}
              >
                Đã hiểu
              </button>
            )}
            
            {/* Countdown Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-gray-800 w-full overflow-hidden">
               <div 
                 className={`h-full ${overlapModalType === 'booked' || overlapModalType === 'double_booking_same_branch' ? 'bg-red-500' : 'bg-orange-500'}`} 
                 style={{ animation: 'shrinkWidth 10s linear forwards' }}
               ></div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="relative z-50 flex w-fit items-center gap-2 text-accent hover:text-white mb-8 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold uppercase tracking-wider text-sm">Quay lại</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-accent"></div>
            <span className="text-accent text-sm font-bold uppercase tracking-[3px]">Đặt lịch dịch vụ</span>
            <div className="w-8 h-[2px] bg-accent"></div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-3">
            Đặt lịch <span className="text-accent">hẹn</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Chọn dịch vụ và thời gian phù hợp. Chúng tôi sẽ chuẩn bị trải nghiệm tốt nhất cho bạn.
          </p>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* === CỘT TRÁI: FORM === */}
          <div className="flex-1 lg:w-[60%]">
            <div className="bg-[#111] rounded-2xl border border-gray-800 p-6 sm:p-8 space-y-6">

              {/* Chọn dịch vụ */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                  <Scissors className="inline w-4 h-4 mr-2 text-accent" />
                  Chọn dịch vụ <span className="text-red-400">*</span>
                </label>
                <ServicePicker
                  services={services}
                  selectedIds={form.serviceIds}
                  onConfirm={(ids) => handleChange('serviceIds', ids)}
                  error={errors.serviceIds}
                />
                {errors.serviceIds && <p className="text-red-400 text-xs mt-1">{errors.serviceIds}</p>}
              </div>

              {/* Chọn chi nhánh & Chọn thợ */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                  <MapPin className="inline w-4 h-4 mr-2 text-accent" />
                  Chọn nhánh & thợ <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsBranchModalOpen(true)}
                    className={`w-full bg-[#0a0a0a] border ${errors.branch ? 'border-red-500' : 'border-gray-700'} rounded-xl py-3.5 px-4 text-left focus:outline-none focus:ring-2 focus:ring-accent transition-all flex flex-col justify-center min-h-[54px] hover:border-gray-500`}
                  >
                    <div className="flex justify-between items-center w-full">
                       <span className={form.branch ? "text-white font-bold" : "text-gray-500"}>
                         {form.branch ? `Chi nhánh: ${form.branch}` : 'Chọn chi nhánh'}
                       </span>
                       <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                    </div>
                    {form.branch && (
                       <div className="mt-1.5 text-sm text-gray-400 flex items-center gap-1.5 overflow-hidden border-t border-gray-800 pt-1.5">
                          <User className="w-3.5 h-3.5 text-accent" />
                          <span className="truncate">
                             {form.staffId === '' ? 'Bất kỳ thợ nào' : selectedStaff ? `${selectedStaff.name} - ${selectedStaff.specialty}` : 'Chưa chọn thợ (Bấm để chọn)'}
                          </span>
                       </div>
                    )}
                  </button>
                </div>
                {errors.branch && <p className="text-red-400 text-xs mt-1">{errors.branch}</p>}
              </div>

              {/* Tên + SĐT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    <User className="inline w-4 h-4 mr-2 text-accent" />
                    Họ và tên <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={e => handleChange('customerName', e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className={`w-full bg-[#0a0a0a] border ${errors.customerName ? 'border-red-500' : 'border-gray-700'} rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all`}
                  />
                  {errors.customerName && <p className="text-red-400 text-xs mt-1">{errors.customerName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    <Phone className="inline w-4 h-4 mr-2 text-accent" />
                    Số điện thoại <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.customerPhone}
                    onChange={e => handleChange('customerPhone', e.target.value)}
                    placeholder="0912 345 678"
                    className={`w-full bg-[#0a0a0a] border ${errors.customerPhone ? 'border-red-500' : 'border-gray-700'} rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all`}
                  />
                  {errors.customerPhone && <p className="text-red-400 text-xs mt-1">{errors.customerPhone}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                  <Mail className="inline w-4 h-4 mr-2 text-accent" />
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={e => handleChange('customerEmail', e.target.value)}
                  placeholder="email@example.com"
                  className={`w-full bg-[#0a0a0a] border ${errors.customerEmail ? 'border-red-500' : 'border-gray-700'} rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all`}
                />
                {errors.customerEmail && <p className="text-red-400 text-xs mt-1">{errors.customerEmail}</p>}
              </div>

              {/* Ngày và Giờ */}
              <div className="pt-6 mt-6 border-t border-[#2a2a2a] space-y-8">
                
                {/* Ngày Hẹn */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                    <Calendar className="inline w-4 h-4 mr-2 text-accent" />
                    Chọn ngày <span className="text-red-400">*</span>
                  </label>
                  {/* Compact Date Picker */}
                  <div className="flex flex-wrap items-center gap-3">
                     {shortcutDates.map(dateIso => {
                       const isSelected = form.bookingDate === dateIso;
                       return (
                         <button
                           key={dateIso}
                           type="button"
                           onClick={() => {
                             if (!isSelected) handleChange('bookingDate', dateIso);
                           }}
                           className={`px-5 py-2.5 rounded-xl border font-bold transition-all flex items-center gap-2 ${isSelected ? 'bg-accent border-accent text-primary shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-[#111] border-[#2a2a2a] text-gray-400 hover:border-gray-500 hover:text-white'}`}
                         >
                           <span className={isSelected ? 'text-primary' : 'text-gray-300'}>{getDayName(dateIso)}</span>
                           <span className={isSelected ? 'text-primary/80 text-sm' : 'text-gray-500 text-sm font-medium'}>
                             {formatDateDisplay(dateIso)}
                           </span>
                           {isSelected && (
                             <div 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 handleChange('bookingDate', '');
                               }}
                               className="ml-2 bg-red-500 hover:bg-red-600 text-white rounded-md p-1 cursor-pointer transition-colors flex items-center justify-center shadow-sm"
                               title="Hủy chọn"
                             >
                               <X className="w-4 h-4" />
                             </div>
                           )}
                         </button>
                       )
                     })}
                     
                     <div>
                       <input
                          type="date"
                          id="hidden-date-picker"
                          min={todayStr}
                          value={form.bookingDate}
                          onChange={e => handleChange('bookingDate', e.target.value)}
                          className="absolute w-0 h-0 opacity-0 pointer-events-none"
                       />
                       <button
                         type="button"
                         onClick={() => {
                           const el = document.getElementById('hidden-date-picker');
                           if (el && el.showPicker) el.showPicker();
                         }}
                         className="px-5 py-2.5 rounded-xl border border-dashed border-[#444] bg-transparent text-gray-400 hover:border-accent hover:text-accent font-medium transition-all flex items-center gap-2"
                       >
                         <Calendar className="w-4 h-4" />
                         <span>Chọn ngày khác</span>
                       </button>
                     </div>
                  </div>
                  {errors.bookingDate && <p className="text-red-400 text-xs mt-1">{errors.bookingDate}</p>}
                </div>

                {/* Giờ Hẹn */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">
                    <Clock className="inline w-4 h-4 mr-2 text-accent" />
                    Chọn giờ <span className="text-red-400">*</span>
                  </label>
                  
                  <div className="bg-[#111] rounded-2xl border border-[#2a2a2a] p-5 shadow-inner">
                     {MORNING_SLOTS.length === 0 && AFTERNOON_SLOTS.length === 0 && EVENING_SLOTS.length === 0 ? (
                       <div className="text-center py-8 text-gray-400 font-medium italic">
                         Hôm nay đã hết khung giờ phục vụ, vui lòng chọn ngày khác!
                       </div>
                     ) : (
                       <div className="space-y-8">
                          {/* Morning */}
                          {MORNING_SLOTS.length > 0 && (
                            <div>
                               <div className="flex items-center gap-2 mb-3 border-b border-gray-800 pb-2">
                                  <Sun className="w-4 h-4 text-yellow-500" />
                                  <span className="text-sm font-bold text-gray-300">Buổi sáng</span>
                               </div>
                               <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                                  {MORNING_SLOTS.map(time => {
                                    const isSelected = form.bookingTime === time;
                                    const slotStatus = getSlotStatus(time);
                                    const isBooked = slotStatus === 'booked';
                                    const isNotEnoughTime = slotStatus === 'not_enough_time';
                                    const isInvalid = isBooked || isNotEnoughTime;

                                    return (
                                      <button
                                        key={time}
                                        type="button"
                                        onClick={() => {
                                          if (isInvalid) {
                                            setOverlapModalType(slotStatus);
                                            return;
                                          }
                                          if (!isSelected) handleChange('bookingTime', time);
                                        }}
                                        className={`relative py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border 
                                          ${isBooked 
                                            ? 'bg-red-900/40 border-red-500/60 opacity-80 cursor-not-allowed text-red-400 shadow-[inset_0_0_10px_rgba(255,0,0,0.2)]' 
                                            : isNotEnoughTime
                                              ? 'bg-orange-900/20 border-orange-500/40 opacity-70 cursor-not-allowed text-orange-400'
                                              : isSelected 
                                                ? 'bg-accent text-primary border-accent shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                                                : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-400 hover:border-gray-500 hover:text-white'}`}
                                      >
                                        {time}
                                        {isSelected && !isInvalid && (
                                          <div 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleChange('bookingTime', '');
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 cursor-pointer transition-colors shadow-sm z-10 flex items-center justify-center"
                                            title="Hủy chọn"
                                          >
                                            <X className="w-3 h-3" />
                                          </div>
                                        )}
                                      </button>
                                    );
                                  })}
                               </div>
                            </div>
                          )}
                          
                          {/* Afternoon */}
                          {AFTERNOON_SLOTS.length > 0 && (
                            <div>
                               <div className="flex items-center gap-2 mb-3 border-b border-gray-800 pb-2">
                                  <Sun className="w-4 h-4 text-orange-500" />
                                  <span className="text-sm font-bold text-gray-300">Buổi chiều</span>
                               </div>
                               <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                                  {AFTERNOON_SLOTS.map(time => {
                                    const isSelected = form.bookingTime === time;
                                    const slotStatus = getSlotStatus(time);
                                    const isBooked = slotStatus === 'booked';
                                    const isNotEnoughTime = slotStatus === 'not_enough_time';
                                    const isInvalid = isBooked || isNotEnoughTime;

                                    return (
                                      <button
                                        key={time}
                                        type="button"
                                        onClick={() => {
                                          if (isInvalid) {
                                            setOverlapModalType(slotStatus);
                                            return;
                                          }
                                          if (!isSelected) handleChange('bookingTime', time);
                                        }}
                                        className={`relative py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border 
                                          ${isBooked 
                                            ? 'bg-red-900/40 border-red-500/60 opacity-80 cursor-not-allowed text-red-400 shadow-[inset_0_0_10px_rgba(255,0,0,0.2)]' 
                                            : isNotEnoughTime
                                              ? 'bg-orange-900/20 border-orange-500/40 opacity-70 cursor-not-allowed text-orange-400'
                                              : isSelected 
                                                ? 'bg-accent text-primary border-accent shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                                                : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-400 hover:border-gray-500 hover:text-white'}`}
                                      >
                                        {time}
                                        {isSelected && !isInvalid && (
                                          <div 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleChange('bookingTime', '');
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 cursor-pointer transition-colors shadow-sm z-10 flex items-center justify-center"
                                            title="Hủy chọn"
                                          >
                                            <X className="w-3 h-3" />
                                          </div>
                                        )}
                                      </button>
                                    );
                                  })}
                               </div>
                            </div>
                          )}

                          {/* Evening */}
                          {EVENING_SLOTS.length > 0 && (
                            <div>
                               <div className="flex items-center gap-2 mb-3 border-b border-gray-800 pb-2">
                                  <Moon className="w-4 h-4 text-blue-400" />
                                  <span className="text-sm font-bold text-gray-300">Buổi tối</span>
                               </div>
                               <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                                  {EVENING_SLOTS.map(time => {
                                    const isSelected = form.bookingTime === time;
                                    const slotStatus = getSlotStatus(time);
                                    const isBooked = slotStatus === 'booked';
                                    const isNotEnoughTime = slotStatus === 'not_enough_time';
                                    const isInvalid = isBooked || isNotEnoughTime;

                                    return (
                                      <button
                                        key={time}
                                        type="button"
                                        onClick={() => {
                                          if (isInvalid) {
                                            setOverlapModalType(slotStatus);
                                            return;
                                          }
                                          if (!isSelected) handleChange('bookingTime', time);
                                        }}
                                        className={`relative py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border 
                                          ${isBooked 
                                            ? 'bg-red-900/40 border-red-500/60 opacity-80 cursor-not-allowed text-red-400 shadow-[inset_0_0_10px_rgba(255,0,0,0.2)]' 
                                            : isNotEnoughTime
                                              ? 'bg-orange-900/20 border-orange-500/40 opacity-70 cursor-not-allowed text-orange-400'
                                              : isSelected 
                                                ? 'bg-accent text-primary border-accent shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                                                : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-400 hover:border-gray-500 hover:text-white'}`}
                                      >
                                        {time}
                                        {isSelected && !isInvalid && (
                                          <div 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleChange('bookingTime', '');
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 cursor-pointer transition-colors shadow-sm z-10 flex items-center justify-center"
                                            title="Hủy chọn"
                                          >
                                            <X className="w-3 h-3" />
                                          </div>
                                        )}
                                      </button>
                                    );
                                  })}
                               </div>
                            </div>
                          )}
                       </div>
                     )}
                  </div>
                  {errors.bookingTime && <p className="text-red-400 text-xs mt-1">{errors.bookingTime}</p>}
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  value={form.note}
                  onChange={e => handleChange('note', e.target.value)}
                  placeholder="VD: Muốn cắt kiểu Undercut, fade thấp..."
                  rows={3}
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none custom-scrollbar"
                />
              </div>
            </div>
          </div>

          {/* === CỘT PHẢI: SUMMARY === */}
          <div className="lg:w-[40%]">
            <div className="sticky top-28 space-y-6">
              {/* Summary Card */}
              <div className="bg-[#111] rounded-2xl border border-gray-800 overflow-hidden">
                <div className="bg-gradient-to-r from-accent/10 to-transparent px-6 py-4 border-b border-gray-800">
                  <h3 className="text-lg font-heading font-bold text-accent flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Tóm tắt đặt lịch
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  {/* Dịch vụ */}
                  <div>
                    <span className="text-gray-400 text-sm block mb-3">Dịch vụ đã chọn</span>
                    {selectedServices && selectedServices.length > 0 ? (
                      <div className="space-y-0 rounded-xl overflow-hidden border border-gray-800/60">
                        {selectedServices.map((svc, index) => (
                          <div 
                            key={svc.id} 
                            className="flex items-center gap-3 px-4 py-3"
                            style={{ 
                              background: index % 2 === 0 ? 'rgba(212,175,55,0.04)' : 'transparent',
                              borderBottom: index < selectedServices.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                            }}
                          >
                            <span 
                              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)' }}
                            >
                              {index + 1}
                            </span>
                            <span className="text-white font-medium text-sm flex-1 leading-tight">
                              {svc.name}
                            </span>
                            <span className="text-accent text-xs font-semibold flex-shrink-0">
                              {svc.price ? Number(svc.price).toLocaleString('vi-VN') + 'đ' : ''}
                            </span>
                          </div>
                        ))}
                        <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: 'rgba(212,175,55,0.08)', borderTop: '1px solid rgba(212,175,55,0.15)' }}>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-accent" />
                            <span className="text-accent text-xs font-semibold">
                              Tổng: {selectedServices.reduce((acc, curr) => acc + (curr.duration || 30), 0)} phút
                            </span>
                          </div>
                          <span className="text-gray-400 text-xs">{selectedServices.length} dịch vụ</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-600 italic text-sm">Chưa chọn dịch vụ nào</span>
                    )}
                  </div>

                  {/* Chi nhánh */}
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Chi nhánh</span>
                    <span className="text-white">
                      {form.branch ? form.branch : <span className="text-gray-600 italic">Chưa chọn</span>}
                    </span>
                  </div>

                  {/* Thợ */}
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 text-sm">Thợ cắt</span>
                    <div className="text-right">
                      {selectedStaff ? (
                        <>
                          <div className="text-white font-medium">{selectedStaff.name}</div>
                          <div className="text-[11px] text-accent mt-0.5">{selectedStaff.specialty}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5 flex items-center justify-end gap-1">
                            <Star className="w-3 h-3 text-accent fill-accent" /> {selectedStaff.rating ? Number(selectedStaff.rating).toFixed(1) : 'Mới'} • {selectedStaff.experienceYears} năm
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-600 italic">Bất kỳ</span>
                      )}
                    </div>
                  </div>

                  {/* Ngày giờ */}
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Thời gian</span>
                    <span className="text-white">
                      {form.bookingDate && form.bookingTime
                        ? `${form.bookingTime} — ${new Date(form.bookingDate).toLocaleDateString('vi-VN')}`
                        : <span className="text-gray-600 italic">Chưa chọn</span>
                      }
                    </span>
                  </div>

                  {/* Vouchers section */}
                  <div className="border-t border-gray-800 pt-4 mt-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                        <Ticket className="w-4 h-4 text-accent" /> Mã Khuyến Mãi
                      </span>
                      {vouchers.length > 0 && (
                        <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded font-medium">
                          {vouchers.length} mã khả dụng
                        </span>
                      )}
                    </div>

                    {!selectedVoucher ? (
                      <button
                        onClick={() => setIsVoucherModalOpen(true)}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-700 bg-[#1a1a1a] hover:border-accent/50 hover:bg-accent/5 transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                            <Ticket className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">Chọn mã khuyến mãi</div>
                            <div className="text-xs text-gray-500 mt-0.5">Để nhận ưu đãi tốt nhất</div>
                          </div>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-gray-500 rotate-180" />
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl border border-accent bg-accent/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                            <Ticket className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-accent">{selectedVoucher.voucher.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">Đã giảm {discountAmount.toLocaleString('vi-VN')}₫</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedVoucher(null)}
                          className="text-gray-500 hover:text-white p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-800 pt-4">
                    {selectedVoucher && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">Tạm tính</span>
                        <span className="text-gray-400 line-through">
                          {subtotal.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    )}
                    {selectedVoucher && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-accent text-sm">Giảm giá</span>
                        <span className="text-accent font-medium">
                          -{discountAmount.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-800/50">
                      <span className="text-gray-300 font-bold">TỔNG TIỀN</span>
                      <span className="text-2xl font-heading font-bold text-accent">
                        {totalAmount.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="bg-[#111] rounded-2xl border border-gray-800 p-6">
                <h4 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-accent" />
                  Phương thức thanh toán
                </h4>
                <div className="space-y-3">
                  {/* VNPay */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      form.paymentMethod === 'VNPAY'
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="VNPAY"
                      checked={form.paymentMethod === 'VNPAY'}
                      onChange={e => handleChange('paymentMethod', e.target.value)}
                      className="accent-[#d4af37] w-4 h-4"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-700 overflow-hidden p-1">
                        <img 
                          src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR.png" 
                          alt="VNPay" 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">VNPay</div>
                        <div className="text-gray-500 text-xs">Thẻ ATM / Visa / QR Code</div>
                      </div>
                    </div>
                  </label>

                  {/* MoMo */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      form.paymentMethod === 'MOMO'
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="MOMO"
                      checked={form.paymentMethod === 'MOMO'}
                      onChange={e => handleChange('paymentMethod', e.target.value)}
                      className="accent-[#d4af37] w-4 h-4"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-700 overflow-hidden p-1.5">
                        <img 
                          src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png" 
                          alt="MoMo" 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">MoMo</div>
                        <div className="text-gray-500 text-xs">Ví điện tử MoMo</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Button Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary font-bold py-4 px-8 rounded-xl transition-all duration-300 uppercase tracking-widest text-base focus:outline-none transform hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.45)] flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Xác nhận đặt lịch
                  </>
                )}
              </button>

              <p className="text-gray-600 text-xs text-center">
                Thanh toán đặt cọc để giữ chỗ. Bạn sẽ nhận email xác nhận sau khi đặt lịch thành công.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Modal Chọn Chi Nhánh */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-[#2a2a2a] bg-[#111]">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="text-accent w-5 h-5" />
                Chọn chi nhánh
              </h3>
              <button onClick={() => setIsBranchModalOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-[#1a1a1a] p-1.5 rounded-lg border border-[#2a2a2a] hover:border-accent">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow bg-[#1a1a1a]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BRANCHES.map(branch => {
                  const isSelected = form.branch === branch;
                  
                  return (
                  <div
                    key={branch}
                    onClick={(e) => {
                      if (isSelected) {
                        e.stopPropagation();
                        handleSelectBranch('');
                      } else {
                        handleSelectBranch(branch);
                      }
                    }}
                    className={`relative p-5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${isSelected ? 'border-accent bg-accent/5 shadow-[0_0_15px_rgba(212,175,55,0.2)] transform -translate-y-1' : 'border-[#2a2a2a] bg-[#111] hover:border-gray-500 hover:-translate-y-1'}`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 z-10 bg-accent text-primary text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                        <CheckCircle2 className="w-2.5 h-2.5" /> ĐANG CHỌN
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-accent/20 text-accent' : 'bg-[#1a1a1a] text-gray-400'}`}>
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`font-bold ${isSelected ? 'text-accent' : 'text-white'} mb-0.5`}>{branch}</div>
                        <div className="text-xs text-gray-500">TP. Hồ Chí Minh</div>
                      </div>
                    </div>
                    {isSelected && (
                      <button className="bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors text-[10px] font-bold uppercase tracking-wider shrink-0">
                        Bỏ chọn
                      </button>
                    )}
                  </div>
                )})}
              </div>
            </div>
            
            {/* Modal Actions */}
            <div className="p-4 border-t border-[#2a2a2a] bg-[#111] flex justify-end gap-3 shrink-0">
               <button 
                 onClick={() => setIsBranchModalOpen(false)} 
                 className="px-6 py-2.5 rounded-xl border border-gray-600 text-gray-300 font-bold hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm"
               >
                 Thoát
               </button>
            </div>
            
          </div>
        </div>
      )}

      {/* Modal Chọn Thợ */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-[#2a2a2a] bg-[#111] shrink-0">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="text-accent w-5 h-5" />
                Chọn thợ cắt
              </h3>
              <button onClick={() => setIsStaffModalOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-[#1a1a1a] p-1.5 rounded-lg border border-[#2a2a2a] hover:border-accent">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 border-b border-[#2a2a2a] bg-[#151515] shrink-0 overflow-x-auto custom-scrollbar flex gap-2">
              <button
                onClick={() => setStaffFilterBranch('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${staffFilterBranch === 'all' ? 'bg-accent text-black font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]' : 'bg-[#111] text-gray-400 border border-[#2a2a2a] hover:border-gray-500 hover:text-white'}`}
              >
                Tất cả
              </button>
              {BRANCHES.map(b => (
                <button
                  key={b}
                  onClick={() => setStaffFilterBranch(b)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${staffFilterBranch === b ? 'bg-accent text-black font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]' : 'bg-[#111] text-gray-400 border border-[#2a2a2a] hover:border-gray-500 hover:text-white'}`}
                >
                  {b}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow bg-[#111]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                
                {/* Any Barber */}
                {(staffFilterBranch === 'all' || staffFilterBranch === form.branch) && (
                  <div 
                    onClick={() => handleSelectStaff(null)}
                    className={`bg-[#1a1a1a] rounded-xl border ${form.staffId === '' ? 'border-accent shadow-[0_0_15px_rgba(212,175,55,0.3)] transform -translate-y-1.5' : 'border-[#2a2a2a]'} overflow-hidden group hover:border-[#c9a84c] transition-all duration-300 ease-in-out ${form.staffId !== '' ? 'hover:-translate-y-1.5' : ''} flex flex-col h-full shadow-lg cursor-pointer relative`}
                  >
                    {form.staffId === '' && (
                      <div className="absolute top-3 right-3 z-10 bg-accent text-primary text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <CheckCircle2 className="w-3 h-3" /> ĐANG CHỌN
                      </div>
                    )}
                    <div className="h-48 overflow-hidden relative flex justify-center items-center bg-gradient-to-br from-gray-900 via-[#111] to-black">
                       <HelpCircle className="w-20 h-20 text-gray-700 group-hover:text-accent transition-colors duration-500" />
                    </div>
                    <div className="p-4 flex-grow flex flex-col items-center justify-center text-center">
                      <h3 className="text-lg font-heading font-bold text-white mb-2 group-hover:text-accent transition-colors">Bất kỳ thợ nào</h3>
                      <p className="text-gray-400 text-xs mb-4">Để hệ thống chọn thợ phù hợp nhất cho bạn.</p>
                      <button className={`w-full mt-auto flex items-center justify-center border font-bold py-2 px-4 rounded-lg transition-colors duration-300 uppercase tracking-widest text-xs ${form.staffId === '' ? 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white' : 'bg-[#111] border-gray-700 group-hover:bg-[#c9a84c] group-hover:text-primary group-hover:border-[#c9a84c] text-gray-300'}`}>
                        {form.staffId === '' ? 'BỎ CHỌN' : 'CHỌN'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Real Barbers */}
                {staffList.filter(s => staffFilterBranch === 'all' || s.branch === staffFilterBranch).map(barber => {
                  const isSelected = form.staffId === barber.id;
                  
                  return (
                  <div 
                    key={barber.id} 
                    onClick={(e) => {
                      if (isSelected) {
                        e.stopPropagation();
                        handleSelectStaff(null);
                      } else {
                        handleSelectStaff(barber);
                      }
                    }}
                    className={`bg-[#1a1a1a] rounded-xl border ${isSelected ? 'border-accent shadow-[0_0_15px_rgba(212,175,55,0.3)] transform -translate-y-1.5' : 'border-[#2a2a2a]'} overflow-hidden group hover:border-[#c9a84c] transition-all duration-300 ease-in-out ${!isSelected ? 'hover:-translate-y-1.5' : ''} flex flex-col h-full shadow-lg cursor-pointer relative`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 z-10 bg-accent text-primary text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <CheckCircle2 className="w-3 h-3" /> ĐANG CHỌN
                      </div>
                    )}
                    <div className="h-48 overflow-hidden relative flex justify-center items-center bg-[#111]">
                      {barber.avatar ? (
                        <img 
                          src={barber.avatar.startsWith('http') || barber.avatar.startsWith('data:') ? barber.avatar : `http://localhost:8080${barber.avatar}`} 
                          alt={barber.name} 
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <User size={48} className="text-gray-600 group-hover:scale-105 transition-transform duration-500" />
                      )}
                    </div>
                    
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-heading font-bold text-white mb-2">{barber.name}</h3>

                      {barber.rating && barber.rating > 0 ? (
                        <div className="flex items-center text-[#c9a84c] mb-3">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="ml-1.5 font-bold text-sm">{Number(barber.rating).toFixed(1)}</span>
                          <span className="ml-1 text-gray-500 text-xs">/ 5.0</span>
                        </div>
                      ) : (
                        <div className="mb-3 text-xs text-[#c9a84c] italic tracking-wider">
                          Chưa có đánh giá
                        </div>
                      )}
                      
                      <div className="mb-4 flex-grow flex flex-col gap-2">
                        <div className="text-xs leading-snug text-gray-400">
                          <span className="uppercase tracking-wide mr-1">C.Môn:</span>
                          <span className="text-gray-200 font-medium">
                            {barber.specialty || 'Chưa cập nhật'}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-400">
                          <Award className="w-3 h-3 text-[#c9a84c] shrink-0 mt-0.5" />
                          <span>T.Niên: <span className="text-gray-200 font-medium">{barber.experienceYears || 0} năm</span></span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-400">
                          <MapPin className="w-3 h-3 text-[#c9a84c] shrink-0 mt-0.5" />
                          <span className="whitespace-nowrap">C.Nhánh:</span>
                          <span className="text-gray-200 font-medium leading-snug">
                            {barber.branch || 'Chưa cập nhật'}
                          </span>
                        </div>
                      </div>
                      
                      <button className={`w-full flex items-center justify-center border font-bold py-2 px-4 rounded-lg transition-colors duration-300 uppercase tracking-widest text-xs mt-auto ${isSelected ? 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white' : 'bg-[#111] border-gray-700 group-hover:bg-[#c9a84c] group-hover:text-primary group-hover:border-[#c9a84c] text-gray-300'}`}>
                        {isSelected ? 'BỎ CHỌN' : 'CHỌN THỢ'}
                      </button>
                    </div>
                  </div>
                )})}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-[#2a2a2a] bg-[#111] flex justify-between gap-3 shrink-0">
                 <button 
                   onClick={() => {
                     setIsStaffModalOpen(false);
                     setTimeout(() => setIsBranchModalOpen(true), 150);
                   }} 
                   className="px-6 py-2.5 rounded-xl border border-gray-600 text-gray-300 font-bold hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm flex items-center gap-2"
                 >
                   <ArrowLeft className="w-4 h-4" /> Quay lại
                 </button>
                 <div className="flex gap-3">
                   <button 
                     onClick={() => setIsStaffModalOpen(false)} 
                     className="px-6 py-2.5 rounded-xl border border-gray-600 text-gray-300 font-bold hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm"
                   >
                     Thoát
                   </button>
                   <button 
                     onClick={() => setIsStaffModalOpen(false)} 
                     className="px-6 py-2.5 rounded-xl bg-accent text-primary font-bold hover:bg-[#c9a84c] transition-colors flex items-center gap-2 uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                   >
                     Hoàn thành <CheckCircle2 className="w-4 h-4" />
                   </button>
                 </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {warningMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#1a1a1a] border-l-4 border-red-500 rounded-xl w-full max-w-md shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden relative">
            <button 
              onClick={() => setWarningMessage('')} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h3 className="text-xl font-bold text-red-500 mb-3 flex items-center gap-2">
                <span className="text-2xl">⚠️</span> Cảnh báo
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                {warningMessage}
              </p>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setWarningMessage('')}
                  className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 px-5 py-2 rounded-lg transition-colors text-sm font-bold uppercase tracking-wider"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
            {/* Progress bar countdown */}
            <style>{`
              @keyframes shrink {
                from { width: 100%; }
                to { width: 0%; }
              }
            `}</style>
            <div className="h-1 bg-red-500/20 w-full absolute bottom-0 left-0">
               <div 
                  className="h-full bg-red-500 transition-all ease-linear" 
                  style={{ animation: 'shrink 6s linear forwards' }}
               />
            </div>
          </div>
        </div>
      )}

      {/* Voucher Modal */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#111] border border-gray-800 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-gray-800 flex flex-col gap-3 bg-[#1a1a1a]">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-accent" /> Chọn mã khuyến mãi
                </h3>
                <button 
                  onClick={() => setIsVoucherModalOpen(false)} 
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 bg-[#0a0a0a]">
              {vouchers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <Ticket className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-400">Bạn không có mã khuyến mãi nào khả dụng cho dịch vụ này.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vouchers.map(cv => {
                    const v = cv.voucher;
                    const isPercentage = v.voucherType === 'PERCENTAGE';
                    const discountValueText = isPercentage ? `${v.value}%` : `${v.value.toLocaleString('vi-VN')}₫`;
                    const meetsMinSpend = subtotal >= (v.minOrderValue || 0);
                    const isSelected = selectedVoucher && selectedVoucher.id === cv.id;
                    
                    return (
                      <div 
                        key={cv.id} 
                        onClick={() => meetsMinSpend && setSelectedVoucher(cv)}
                        className={`relative bg-gradient-to-br from-[#181818] to-[#121212] border rounded-2xl p-4 flex flex-col justify-between shadow-lg overflow-hidden transition-all duration-300 ${
                          !meetsMinSpend 
                            ? 'opacity-50 grayscale cursor-not-allowed border-gray-800' 
                            : isSelected 
                            ? 'border-accent shadow-[0_0_15px_rgba(212,175,55,0.2)] transform -translate-y-0.5 cursor-pointer' 
                            : 'border-gray-800/80 hover:border-accent/50 hover:-translate-y-0.5 cursor-pointer'
                        }`}
                      >
                        {/* Cutouts */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#0a0a0a] border-r border-accent/20 rounded-r-full"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#0a0a0a] border-l border-accent/20 rounded-l-full"></div>
                        
                        {/* Selection Glow */}
                        {isSelected && (
                           <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[40px] rounded-full pointer-events-none -z-0"></div>
                        )}

                        <div className="flex justify-between items-start mb-2 relative z-10 pl-2">
                           <div className="flex items-center gap-2">
                             <span className="text-xs font-bold font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
                               {v.code}
                             </span>
                             {v.userLimit > 1 && (
                               <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded-full font-black tracking-widest flex-shrink-0">
                                 x{v.userLimit - (cv.usedCount || 0)}
                               </span>
                             )}
                           </div>
                           {isSelected && (
                             <div className="bg-accent text-black p-0.5 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                               <CheckCircle2 className="w-4 h-4" />
                             </div>
                           )}
                        </div>

                        <div className="pl-2 relative z-10">
                          <h4 className="font-bold text-white text-base leading-tight mb-1 truncate pr-6">{v.name}</h4>
                          
                          {/* Apply Scope Badge */}
                          <div className="mb-2">
                            {v.applyTo === 'SERVICE' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                                Cho Dịch Vụ
                              </span>
                            )}
                            {v.applyTo === 'ALL' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                                Cho Dịch Vụ & Sản Phẩm
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-xl font-bold text-accent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Giảm {discountValueText}</span>
                            {isPercentage && v.maxDiscount > 0 && (
                              <span className="text-xs text-gray-400 font-medium">Tối đa {v.maxDiscount.toLocaleString('vi-VN')}₫</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                             <div className="text-[10px] text-gray-400 bg-[#000] px-2 py-1 rounded border border-gray-800">
                               Đơn tối thiểu: {(v.minOrderValue || 0).toLocaleString('vi-VN')}₫
                             </div>
                             <div className="text-[10px] text-gray-400 bg-[#000] px-2 py-1 rounded border border-gray-800">
                               HSD: {v.endDate ? (() => {
                                 const d = new Date(v.endDate);
                                 return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
                               })() : 'Vô thời hạn'}
                             </div>
                          </div>
                          
                          {!meetsMinSpend && (
                            <div className="text-xs text-red-400 mt-2 font-medium bg-red-500/10 inline-block px-2 py-1 rounded border border-red-500/20">
                              Mua thêm {(v.minOrderValue - subtotal).toLocaleString('vi-VN')}₫ để sử dụng
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-800 bg-[#1a1a1a]">
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="w-full bg-accent hover:bg-accent/90 text-black font-bold py-3 rounded-xl transition-colors uppercase tracking-wider text-sm"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
