import React, { useState, useEffect } from 'react';
import './Clock.css';

function Clock() {
  const [time, setTime] = useState(new Date());

  // useEffect: tạo bộ đếm thời gian chạy mỗi giây
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    // cleanup: dừng timer khi component bị gỡ bỏ
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="clock-container">
      <h1 className="clock-title">⏰ Ứng dụng Đồng Hồ Thời Gian Thực</h1>
      <h2 className="clock-time">Bây giờ là: {time.toLocaleTimeString()}</h2>
    </div>
  );
}

export default Clock;








