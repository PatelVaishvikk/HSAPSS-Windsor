// pages/index.js
import Navbar from '../components/Navbar';
import DashboardStats from '../components/DashboardStats';
import RecentCalls from '../components/RecentCalls';
import Modal from '../components/Modal';
import { useState } from 'react';

export default function Home() {
    const [showModal, setShowModal] = useState(false);

    const stats = [
        { label: 'Total Students', count: 150, icon: 'fa-users', bgClass: 'bg-info' },
        { label: 'Total Calls', count: 200, icon: 'fa-phone', bgClass: 'bg-warning' },
        { label: 'Completed Calls', count: 120, icon: 'fa-check', bgClass: 'bg-success' },
        { label: 'Pending Calls', count: 80, icon: 'fa-times', bgClass: 'bg-danger' },
    ];

    const recentCalls = [
        { student: 'John Doe', status: 'Completed', notes: 'No issues', date: '2025-01-15T12:30:00Z' },
        { student: 'Jane Smith', status: 'Pending', notes: 'Follow-up needed', date: '2025-01-16T09:00:00Z' },
        // Add more calls here...
    ];

    return (
        <>
            <Navbar />
            <div className="container">
                <DashboardStats stats={stats} />
                <RecentCalls calls={recentCalls} />
                <button className="btn btn-primary mt-4" onClick={() => setShowModal(true)}>
                    Add New Student
                </button>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)} onSave={(data) => console.log(data)} />
        </>
    );
}
