import { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import api from '../api';
import { Link } from 'react-router-dom';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctors');
        setDoctors(res.data.data);
        setError('');
      } catch (err) {
        setError('Failed to load doctors. Please try again later.');
        console.error('Doctors fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-4">
        {error}
      </Alert>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="mb-4">Available Doctors</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {doctors.map(doctor => (
          <Col key={doctor._id}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{doctor.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {doctor.specialization}
                </Card.Subtitle>
                <Card.Text>
                  {doctor.availableSlots?.length > 0 ? (
                    <span className="text-success">
                      {doctor.availableSlots.length} available slots
                    </span>
                  ) : (
                    <span className="text-danger">No available slots</span>
                  )}
                </Card.Text>
                <Link 
                  to={`/doctors/${doctor._id}`}
                  className="btn btn-primary w-100"
                >
                  View Profile
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DoctorsList;