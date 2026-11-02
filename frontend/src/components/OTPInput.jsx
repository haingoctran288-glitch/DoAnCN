import React, { useRef, useCallback } from 'react';

/**
 * Component nhập OTP 6 số - Mượt mà như app thật
 * Props:
 *   - value: mảng 6 phần tử ["", "", "", "", "", ""]
 *   - onChange: callback trả về mảng mới khi user nhập
 */
const OTPInput = ({ value, onChange }) => {
  const inputRefs = useRef([]);

  /**
   * Xử lý khi user nhập số vào ô
   */
  const handleChange = useCallback((index, e) => {
    const inputValue = e.target.value;

    // Chỉ cho phép nhập số 0-9
    if (inputValue && !/^\d$/.test(inputValue)) return;

    // Clone mảng để tránh mutate state cũ
    const newOtp = [...value];
    newOtp[index] = inputValue;

    // Cập nhật state
    onChange(newOtp);

    // Tự động focus sang ô tiếp theo nếu đã nhập
    if (inputValue && index < 5) {
      // Dùng setTimeout để đảm bảo state đã cập nhật trước khi focus
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
  }, [value, onChange]);

  /**
   * Xử lý phím Backspace
   * - Nếu ô hiện tại trống → focus về ô trước
   * - Nếu ô có giá trị → xóa giá trị ô hiện tại
   */
  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Ô trống → lùi về ô trước và xóa giá trị ô đó
        const newOtp = [...value];
        newOtp[index - 1] = '';
        onChange(newOtp);

        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 0);
      } else {
        // Ô có giá trị → xóa giá trị
        const newOtp = [...value];
        newOtp[index] = '';
        onChange(newOtp);
      }
      e.preventDefault();
    }

    // Phím mũi tên trái
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Phím mũi tên phải
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [value, onChange]);

  /**
   * Xử lý paste - Tự động fill 6 số vào 6 ô
   */
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Lọc chỉ lấy số
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);

    if (digits.length > 0) {
      const newOtp = [...value];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digits[i] || '';
      }
      onChange(newOtp);

      // Focus vào ô cuối cùng đã được fill
      const lastIndex = Math.min(digits.length, 6) - 1;
      setTimeout(() => {
        inputRefs.current[lastIndex]?.focus();
      }, 0);
    }
  }, [value, onChange]);

  /**
   * Khi focus vào ô → select toàn bộ text trong ô
   */
  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div className="flex justify-center gap-3">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          className="w-12 h-14 text-center text-2xl font-bold bg-primary border-2 border-gray-700 rounded-lg text-white 
                     focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent 
                     transition-all duration-200 caret-transparent
                     selection:bg-accent/20"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default OTPInput;
