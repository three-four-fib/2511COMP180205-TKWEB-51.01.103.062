import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import About from "./components/About";
import Footer from "./components/Footer";
import Group from "./pages/MainPage";
import Member1 from "./pages/Member1";
import Member2 from "./pages/Member2";
import Member3 from "./pages/Member3";
import Member4 from "./pages/Member4";
import Member5 from "./pages/Member5";
import Properties from "./pages/Properties";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
      
        {/* Main content should expand to push footer down */}
        <main className="main-content">
          
          <Routes>
            {/* Home -> Group page */}
            <Route path="/" element={<Group />} />

            <Route path="/about" element={<About />} />

            <Route path="/properties" element={<Properties />} />

            <Route path="/member1" element={<Member1 />} />
            <Route path="/member2" element={<Member2 />} />
            <Route path="/member3" element={<Member3 />} />
            <Route path="/member4" element={<Member4 />} />
            <Route path="/member5" element={<Member5 />} />



          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
