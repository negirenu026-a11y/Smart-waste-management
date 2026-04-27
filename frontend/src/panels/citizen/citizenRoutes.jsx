import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MakeComplaint from './pages/MakeComplaint';
import History from './pages/History';
import Register from './pages/Register';

const CitizenRoutes = () => {
    return (
        <Routes>
            <Route path="register" element={<Register />} />
            <Route path="complaint" element={<MakeComplaint />} />
            <Route path="history" element={<History />} />
            {/* Default redirect for citizen sub-routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default CitizenRoutes;
