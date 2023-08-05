import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import './index.css';
import HomePage from './frontend/screens/HomePage'
import Login from "./frontend/screens/Login";
import { AnimatePresence } from "framer-motion";
import MainScreen from "./frontend/screens/MainScreen";
import GetStarted from './frontend/screens/GetStarted'
import CompleteProfile from "./frontend/screens/CompleteProfile";
import {useState} from 'react'



export default function App() {
  
  return (
    <>
    <HashRouter>
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<MainScreen />}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/getstarted" element={<GetStarted/>}></Route>
        <Route path="/homepage" element={<HomePage />}></Route>
        <Route path="/completeprofile" element={<CompleteProfile />}></Route>
      </Routes>
      </AnimatePresence>
    </HashRouter>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);