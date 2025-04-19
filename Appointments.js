import React, { useState, useEffect } from 'react';
import api from '../api';
import { Container, ListGroup, Spinner } from 'react-bootstrap';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/appointments');
        setAppointments(response.data);
      } catch (err) {
        console.error('Error:', err.response?.data?.error || 'Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="mb-4">My Appointments</h1>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <ListGroup>
          {appointments.map(appointment => (
            <ListGroup.Item key={appointment._id}>
              <div className="d-flex justify-content-between">
                <div>
                  <h5>{new Date(appointment.date).toLocaleDateString()}</h5>
                  <p>{new Date(appointment.date).toLocaleTimeString()}</p>
                </div>
                <span className={`badge bg-${
                  appointment.status === 'confirmed' ? 'success' :
                  appointment.status === 'cancelled' ? 'danger' : 'warning'
                }`}>
                  {appointment.status}
                </span>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default Appointments;