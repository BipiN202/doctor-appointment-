import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/appointments');
        // Ensure response data is properly formatted
        const data = response.data.data || [];
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load appointments');
        console.error('Appointments Error:', err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'warning';
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">My Appointments</h1>
      <div className="d-flex justify-content-between mb-3">
        <Link to="/book-appointment" className="btn btn-primary">
          Book New Appointment
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <ListGroup>
          {appointments.map(appointment => (
            <ListGroup.Item 
              key={appointment._id}
              className="d-flex justify-content-between align-items-center mb-2 shadow-sm"
            >
              <div>
                <h5 className="mb-1">
                  {new Date(appointment.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h5>
                <p className="mb-0 text-muted">
                  {new Date(appointment.date).toLocaleTimeString()}
                </p>
                <small className="text-muted">
                  Dr. {appointment.doctor?.name} - {appointment.doctor?.specialization}
                </small>
              </div>
              <Badge pill bg={getStatusVariant(appointment.status)}>
                {appointment.status}
              </Badge>
            </ListGroup.Item>
          ))}
          
          {appointments.length === 0 && (
            <ListGroup.Item className="text-center text-muted py-4">
              No appointments found
            </ListGroup.Item>
          )}
        </ListGroup>
      )}
    </Container>
  );
};

export default Appointments;