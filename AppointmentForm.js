// components/AppointmentForm.js
import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../api';

const AppointmentForm = ({ doctors }) => {
  const [formData, setFormData] = useState({
    doctorId: '',
    date: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments', formData);
      alert('Appointment booked successfully!');
      // Clear form after successful submission
      setFormData({ doctorId: '', date: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Select Doctor</Form.Label>
        <Form.Select 
          value={formData.doctorId}
          onChange={e => setFormData({...formData, doctorId: e.target.value})}
          required
        >
          <option value="">Choose a doctor</option>
          {doctors.map(doctor => (
            <option key={doctor._id} value={doctor._id}>
              Dr. {doctor.name} ({doctor.specialization})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Select Date & Time</Form.Label>
        <Form.Control
          type="datetime-local"
          value={formData.date}
          onChange={e => setFormData({...formData, date: e.target.value})}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-3">
        Book Appointment
      </Button>
    </Form>
  );
};

export default AppointmentForm;