import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './assets/HomePage';
import About from './assets/AboutRouts';
import Contact from './assets/ContactPage';


 function App() {
  const [count, setCount] = useState(0);


  function Addcount() {
    setCount (c => c + 1);

  }

  return (
    <>
    <Router>
   
    <nav id="navStyle">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
    </nav>
    

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  </Router>
  <div>
      <h1>Counter: {count}</h1>
      <button onClick={Addcount}>Reset</button>
    </div>
  </>
  );

}
export default App;