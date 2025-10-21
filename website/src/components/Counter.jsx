import React, { useState } from "react";
import "./Counter.css";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-container">
      <h1 className="counter-title">Ứng dụng Đếm Số (Counter App)</h1>
      <p className="counter-text">Bạn đã nhấn {count} lần</p>

      <button  className="btn-increase"
        onClick={() => setCount(count + 1)}
      >
        Tăng
      </button>

      <button className="btn-reset"
        onClick={() => setCount(0)}
      >
        Đặt lại
      </button>
    </div>
  );
}

export default Counter;








