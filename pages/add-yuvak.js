// pages/add-yuvak.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AddYuvak() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        mail_id: '',
        phone: '',
        address: '',
    });

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to add yuvak');
            }

            showToast('Success', 'Yuvak added successfully', 'success');
            setFormData({ first_name: '', last_name: '', mail_id: '', phone: '', address: '' });

            // Redirect after a brief delay
            setTimeout(() => {
                window.location.href = '/students-table';
            }, 2000);
        } catch (error) {
            showToast('Error', error.message, 'danger');
        } finally {
            setLoading(false);
        }
    };

    // Function to display toast
    const showToast = (title, message, type = 'success') => {
        setToast({ title, message, type });
        setTimeout(() => setToast(null), 5000); // Hide toast after 5 seconds
    };

    return (
        <>
            <Head>
                <title>Add New Yuvak - HSAPSS Windsor</title>
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                />
                <link
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
                    rel="stylesheet"
                />
            </Head>

            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
                <div className="container">
                    <Link className="navbar-brand" href="/">
                        <i className="fas fa-phone-square-alt me-2"></i>HSAPSS Windsor
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" href="/">
                                    <i className="fas fa-home me-1"></i>Dashboard
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" href="/add-yuvak">
                                    <i className="fas fa-user-plus me-1"></i>Add New Yuvak
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/students-table">
                                    <i className="fas fa-table me-1"></i>Students Table
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/call-logs-table">
                                    <i className="fas fa-phone me-1"></i>Call Logs
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Form */}
            <div className="container mt-5 pt-4">
                <div className="card shadow">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">
                            <i className="fas fa-user-plus me-2"></i>Add New Yuvak
                        </h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">First Name <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Last Name <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email <span className="text-danger">*</span></label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="mail_id"
                                        value={formData.mail_id}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Phone <span className="text-danger">*</span></label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <textarea
                                    className="form-control"
                                    id="address"
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <div className="text-end">
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={() => window.location.href = '/'}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    <i className="fas fa-save me-2"></i>
                                    {loading ? 'Saving...' : 'Save Yuvak'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className={`toast-container position-fixed bottom-0 end-0 p-3`}>
                    <div
                        className={`toast align-items-center text-white bg-${toast.type} border-0`}
                        role="alert"
                    >
                        <div className="d-flex">
                            <div className="toast-body">
                                <strong>{toast.title}</strong><br />
                                {toast.message}
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
