import React from 'react';
import { Input, Select, Space } from 'antd';
import { Search } from 'lucide-react';

const { Option } = Select;

const BRANCHES = [
  'Quận 1',
  'Quận 2',
  'Quận 3',
  'Quận 7',
  'Quận 9',
  'Bình Thạnh'
];

const StaffFilters = ({ onSearch, onFilterBranch }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
      <Input
        placeholder="Tìm tên, chuyên môn, số điện thoại..."
        prefix={<Search size={16} style={{ color: '#d4af37' }} />}
        onChange={(e) => onSearch(e.target.value)}
        style={{ 
          width: '100%',
          maxWidth: 400, 
          backgroundColor: '#1a1a1a', 
          borderColor: '#333', 
          color: '#fff' 
        }}
        className="custom-search"
      />
      
      {user.role !== 'EDITOR' && (
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={onFilterBranch}
          styles={{ popup: { root: { backgroundColor: '#1a1a1a' } } }}
        >
          <Option value="all">Tất cả chi nhánh</Option>
          {BRANCHES.map(branch => (
            <Option key={branch} value={branch}>{branch}</Option>
          ))}
        </Select>
      )}
    </div>
  );
};

export default StaffFilters;
