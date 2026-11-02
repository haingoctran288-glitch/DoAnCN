import React from 'react';
import { Pagination } from 'antd';

const StaffPagination = ({ current, total, pageSize, onChange }) => {
  return (
    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
      <Pagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false}
        className="luxury-pagination"
      />
    </div>
  );
};

export default StaffPagination;
