// pages/call-logs.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function CallLogs() {
    const [studentsData, setStudentsData] = useState([]);
    const [callLogs, setCallLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch students data for the dropdown
    const loadStudents = async () => {
        try {
            const response = await fetch('/api/students');
            const students = await response.json();
            setStudentsData(students);
        } catch (error) {
            console.error('Error loading students:', error);
        }
    };

    // Fetch call logs
    const loadCallLogs = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/call-logs/latest');
            const logs = await response.json();
            setCallLogs(logs);
        } catch (error) {
            console.error('Error loading call logs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Submit new call log
    const saveCallLog = async (formData) => {
        try {
            const response = await fetch('/api/call-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }
            loadCallLogs(); // Refresh the call logs table
        } catch (error) {
            console.error('Error saving call log:', error);
        }
    };

    // Modal handling for adding new call logs
    const addNewCall = () => {
        // Open the modal for adding a new call log (we'll use Bootstrap's modal manually)
        const modal = new window.bootstrap.Modal(document.getElementById('newCallModal'));
        modal.show();
    };

    useEffect(() => {
        loadStudents();
        loadCallLogs();
    }, []);

    return (
        <>
            <Head>
                <title>Call Logs - HSAPSS Windsor</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
                <link href="https://cdn.datatables.net/1.11.3/css/jquery.dataTables.css" rel="stylesheet" />
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
                <link href="/css/styles.css" rel="stylesheet" />
            </Head>

            <nav className="navbar navbar-expand-lg navbar-dark">
                <div className="container">
                    <Link className="navbar-brand" href="/">
                        <i className="fas fa-phone-square-alt me-2"></i>HSAPSS Windsor
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" href="/"><i className="fas fa-home me-1"></i>Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/add-yuvak"><i className="fas fa-user-plus me-1"></i>Add New Yuvak</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/api/students-table"><i className="fas fa-table me-1"></i>Students Table</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" href="/api/call-logs-table"><i className="fas fa-phone me-1"></i>Call Logs</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <div className="card shadow">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0"><i className="fas fa-phone-alt me-2"></i>Call Logs</h5>
                        <button className="btn btn-success" onClick={addNewCall}>
                            <i className="fas fa-plus me-2"></i>New Call Log
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table id="callLogsTable" className="table table-hover">
                                <thead>
                                    <tr>
                                        <th className="name-column">Student & Notes</th>
                                        <th className="status-column">Status</th>
                                        <th className="actions-column">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {callLogs.map(log => (
                                        <tr key={log.id}>
                                            <td>
                                                <div className="student-info">
                                                    <div className="student-name">{log.first_name} {log.last_name}</div>
                                                    <div className="call-time text-muted">{new Date(log.created_at).toLocaleTimeString()}</div>
                                                    {log.notes && <div className="call-notes">{log.notes}</div>}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`status-badge bg-${log.status}`}>
                                                    <i className={`fas fa-${log.status === 'completed' ? 'check-circle' : 'times-circle'}`}></i>
                                                    <span className="status-text">{log.status}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-danger" onClick={() => deleteLog(log.id)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for New Call Log */}
            <div className="modal fade" id="newCallModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title"><i className="fas fa-phone me-2"></i>New Call Log</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <form id="newCallForm">
                                <div className="mb-3">
                                    <label className="form-label">Student</label>
                                    <select className="form-select" id="student_id" required>
                                        <option value="">Select Student</option>
                                        {studentsData.map(student => (
                                            <option key={student.student_index} value={student.student_index}>
                                                {student.first_name} {student.last_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <select className="form-select" id="status" required>
                                        <option value="completed">Completed</option>
                                        <option value="no-answer">No Answer</option>
                                        <option value="voicemail">Voicemail</option>
                                        <option value="wrong-number">Wrong Number</option>
                                        <option value="disconnected">Disconnected</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Notes</label>
                                    <textarea className="form-control" id="notes" rows="3"></textarea>
                                </div>
                                <div className="mb-3">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="needs_follow_up" />
                                        <label className="form-check-label">Needs Follow-up</label>
                                    </div>
                                </div>
                                <div className="mb-3" id="follow_up_date_container" style={{ display: 'none' }}>
                                    <label className="form-label">Follow-up Date</label>
                                    <input type="date" className="form-control" id="follow_up_date" />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={saveCallLog}>Save Call Log</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
