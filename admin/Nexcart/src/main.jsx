import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Add from './pages/Add.jsx'
import List from './pages/List.jsx'
import Orders from './pages/Orders.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="login" element={<App />} />
      <Route path="/" element={<App />}>
        <Route path="add" element={<Add />} />
        <Route path="list" element={<List />} />
        <Route path="orders" element={<Orders />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
