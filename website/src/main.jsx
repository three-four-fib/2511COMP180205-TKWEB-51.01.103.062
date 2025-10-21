import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";   // ✅ global styles
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App /> {/*tells React to take your App.jsx and mount it into #root. */}
  </React.StrictMode>
);


