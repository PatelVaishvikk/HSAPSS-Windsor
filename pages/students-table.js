import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap'; // Bootstrap for modals
import DataTable from 'react-data-table-component'; // React DataTable for the table
import 'bootstrap/dist/css/bootstrap.min.css';

export default function StudentsTable() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCallLogModal, setShowCallLogModal] = useState(false);

  // Fetch students data
  useEffect(() => {
    async function fetchStudents() {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    }

    fetchStudents();
  }, []);

  const columns = [
    {
      name: 'Student Info',
      selector: row => `${row.first_name} ${row.last_name}`,
    },
    {
      name: 'Contact',
      selector: row => `${row.phone} / ${row.mail_id}`,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <Button onClick={() => handleEditStudent(row)}>Edit</Button>
          <Button onClick={() => handleCallLog(row)}>Log Call</Button>
        </div>
      ),
    },
  ];

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleCallLog = (student) => {
    setSelectedStudent(student);
    setShowCallLogModal(true);
  };

  return (
    <div className="container" style={{ marginTop: '100px' }}>
      <h5>Students Table</h5>

      <DataTable
        title="Students"
        columns={columns}
        data={students}
        pagination
      />

      {/* Edit Student Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add your form to edit student data */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary">Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Call Log Modal */}
      <Modal show={showCallLogModal} onHide={() => setShowCallLogModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Log Call for {selectedStudent?.first_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Call log form */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCallLogModal(false)}>Close</Button>
          <Button variant="primary">Save Call Log</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
