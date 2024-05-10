import React,  { Component, Suspense }  from "react";
import Signup from "./Component/Signup";
import ShowRecord from "./Component/ShowRecord";
import "./App.css";
import { BrowserRouter, Route, Routes ,Navigate} from 'react-router-dom'


export default function App() {
  return (
    <BrowserRouter>
        <Suspense >
          <Routes>
            <Route exact path="/" name="Signup Page" element={<Signup />} />
            <Route exact path="/showRecord" name="ShowRecord Page" element={<ShowRecord />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
  );
}
