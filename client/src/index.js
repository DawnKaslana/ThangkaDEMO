import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Router, Routes ,Route } from 'react-router-dom';
import { Home } from './pages/home';
import { Baymax } from './pages/baymax';
import { Covid19 } from './pages/covid19';
import './css/index.css';
//import * as serviceWorker from './serviceWorker';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/baymax" element={<Baymax />} />
        <Route path="/covid19" element={<Covid19 />} />
    </Routes>
    </BrowserRouter>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
