import React from 'react'
import ReactDOM from 'react-dom/client'
import {  RouterProvider } from 'react-router-dom';
import { router } from './components/pageStructures/servicePage/ServicePage';

ReactDOM.createRoot(document.getElementById('root')!).render(
 // <React.StrictMode>
    <RouterProvider router={router} />
)
