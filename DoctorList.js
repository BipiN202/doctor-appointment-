import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import api from '../api';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctors');
        setDoctors(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <Container className="mt-4">
      <h2>Doctors List</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Row className="mt-4 g-4">
          {doctors.map(doctor => (
            <Col md={4} key={doctor._id}>
              <Card>
                <Card.Body>
                  <Card.Title>{doctor.name}</Card.Title>
                  <Card.Text>
                    {doctor.specialization}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default DoctorList;