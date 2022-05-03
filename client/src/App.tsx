import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Fib from "./Fib";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/fib">Fib</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/fib" element={<Fib />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
