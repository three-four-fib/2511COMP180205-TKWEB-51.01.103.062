import React, { useState } from "react";
import "./Greeting.css";

function Greeting() {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn reload trang
    alert(`👋 Xin chào, ${name || "bạn ẩn danh"}!`);
  };

  return (
    <div className="greeting-container">
      <h2>💌 Gửi lời chào!</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập tên của bạn..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Gửi</button>
      </form>
    </div>
  );
}

export default Greeting;
