import { Pagination } from 'antd';
import { useState } from 'react';

const CustomPagination = ({ total, pageSize, onPageChange }: { total: number, pageSize: number, onPageChange: Function }) => {
  const [current, setCurrent] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrent(page);
    onPageChange(page);
  };

  return (
    <Pagination
      current={current} // Track active page
      total={total} // Total items
      pageSize={pageSize} // Items per page
      onChange={handlePageChange} // Handle page change
    //   showSizeChanger
    //   pageSizeOptions={['5', '10', '20', '50']}
      className="custom-pagination"
    />
  );
};

export default CustomPagination;
