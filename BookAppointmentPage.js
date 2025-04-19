import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Alert, Spinner } from 'react-bootstrap';
import AppointmentForm from '../components/AppointmentForm';
import api from '../api';

const BookAppointmentPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await api.get(`/doctors/${doctorId}`);
        setDoctor(data);
      } catch (err) {
        setError('Failed to load doctor information');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleSuccess = () => {
    navigate('/appointments', { state: { message: 'Appointment booked successfully!' } });
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">
        Book Appointment with Dr. {doctor?.name}
        {doctor?.specialization && <small className="text-muted"> - {doctor.specialization}</small>}
      </h2>

      <AppointmentForm
        doctorId={doctorId}
        onSuccess={handleSuccess}
      />
    </Container>
  );
};

export default BookAppointmentPage;