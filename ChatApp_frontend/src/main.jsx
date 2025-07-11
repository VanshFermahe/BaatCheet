import { StrictMode } from 'react'
import React from 'react';

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes } from 'react-router'
import AppRoute from './config/AppRoute.jsx'
import { Toaster } from 'react-hot-toast';
import { ChatProvider } from './context/ChatContext.jsx';
createRoot(document.getElementById('root')).render(
 
    <BrowserRouter>
      <Toaster position="top-right" />
      <ChatProvider>
        <AppRoute />
      </ChatProvider>
    </BrowserRouter>
 
);
