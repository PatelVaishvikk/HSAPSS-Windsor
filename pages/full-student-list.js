import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';

const FullStudentList = () => {
    const [students, setStudents] = useState([]);

    // Fetch the student list when the component mounts
    useEffect(() => {
        async function fetchStudents() {
            const response = await fetch('/api/students');
            const studentsData = await response.json();
            setStudents(studentsData);
        }

        fetchStudents();
    }, []);

    // Handle the deletion of a student
    const deleteStudent = async (id) => {
        await fetch(`/api/students/delete/${id}`, { method: 'DELETE' });
        setStudents(prevStudents => prevStudents.filter(student => student.student_index !== id));
    };

    return (
        <>
            <Head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Full Student List</title>
            </Head>

            <div className="container">
                <h1 className="text-center mb-4">📋 Full Student List</h1>

                <div className="card shadow">
                    <div className="card-header bg-dark text-white">
                        <h5 className="mb-0">Student Details</h5>
                    </div>
                    <div className="card-body p-0">
                        <table className="table table-striped mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.student_index}>
                                        <td>{student.student_index}</td>
                                        <td>{student.first_name}</td>
                                        <td>{student.last_name}</td>
                                        <td>{student.mail_id}</td>
                                        <td>
                                            <a href={`tel:${student.phone}`} className="text-primary">{student.phone}</a>
                                        </td>
                                        <td>{student.address || 'N/A'}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => showEditModal(student)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteStudent(student.student_index)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <a href="/index.html" className="btn btn-secondary w-100 mt-3">Back to Directory</a>
            </div>
        </>
    );
};

const showEditModal = (student) => {
    console.log('Edit student:', student);
    // Implement modal or edit functionality here
};

export default FullStudentList;
