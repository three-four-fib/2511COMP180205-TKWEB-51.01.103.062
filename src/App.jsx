import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Header from "./components/Header";
import About from "./components/About";
import Footer from "./components/Footer";
import Group from "./pages/MainPage";
import Member1 from "./pages/Member1";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* Home route (your current layout) */}

        {/* Group page */}
        <Route path="/group" element={<Group />} />

        {/* Member 1 page */}
        <Route path="/member1" element={<Member1 />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
