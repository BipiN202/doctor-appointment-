import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../api';

const AddDoctorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    hospital: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/doctors', formData);
      setSuccess(true);
      setError('');
      // Clear form after 2 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          specialization: '',
          hospital: ''
        });
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create doctor');
    }
  };

  return (
    <div className="mt-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Add New Doctor</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Doctor added successfully!</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Doctor Name</Form.Label>
          <Form.Control
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Specialization</Form.Label>
          <Form.Control
            type="text"
            required
            value={formData.specialization}
            onChange={e => setFormData({...formData, specialization: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hospital</Form.Label>
          <Form.Control
            type="text"
            value={formData.hospital}
            onChange={e => setFormData({...formData, hospital: e.target.value})}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Doctor
        </Button>
      </Form>
    </div>
  );
};

export default AddDoctorForm;