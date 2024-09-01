import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import 'webrtc-adapter'; // ok?

const root = createRoot(document.getElementById('root'))
root.render(<App />)
