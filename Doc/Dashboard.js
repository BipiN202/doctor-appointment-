import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api';
import { format, parseISO } from 'date-fns';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, appointmentsRes, statsRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/appointments'),
          api.get('/stats')
        ]);

        setUserData(userRes.data || null);
        setAppointments(Array.isArray(appointmentsRes.data) ? appointmentsRes.data : []);
        setStats(statsRes.data || {
          totalAppointments: 0,
          upcomingAppointments: 0,
          completedAppointments: 0
        });
        setError('');
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    return <Alert variant="danger" className="mt-4">{error}</Alert>;
  }

  const recentAppointments = appointments.slice(0, 5);

  return (
    <Container className="mt-4">
      <h2>Welcome, {userData?.name || 'User'}</h2>
      <Row className="mt-4 g-4">
        <Col md={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Upcoming Appointments</span>
              <Link to="/appointments" className="btn btn-sm btn-primary">
                View All
              </Link>
            </Card.Header>
            <ListGroup variant="flush">
              {recentAppointments.map(appointment => (
                <ListGroup.Item key={appointment._id}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>
                        {format(parseISO(appointment.date), 'MMM dd, yyyy hh:mm a')}
                      </strong>
                      <div className="text-muted">
                        {appointment.doctor?.name || 'Unknown Doctor'} - 
                        {appointment.doctor?.specialization || 'General Practice'}
                      </div>
                    </div>
                    <span className={`badge bg-${appointment.status === 'confirmed' ? 'success' : 'warning'}`}>
                      {appointment.status}
                    </span>
                  </div>
                </ListGroup.Item>
              ))}
              {appointments.length === 0 && (
                <ListGroup.Item className="text-center text-muted">
                  No upcoming appointments
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>Quick Stats</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                Total Appointments <span className="float-end">{stats.totalAppointments}</span>
              </ListGroup.Item>
              <ListGroup.Item>
                Upcoming <span className="float-end">{stats.upcomingAppointments}</span>
              </ListGroup.Item>
              <ListGroup.Item>
                Completed <span className="float-end">{stats.completedAppointments}</span>
              </ListGroup.Item>
            </ListGroup>
          </Card>

          <Card>
            <Card.Header>Quick Actions</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item action as={Link} to="/book-appointment">
                Book New Appointment
              </ListGroup.Item>
              {userData?.role === 'doctor' && (
                <ListGroup.Item action as={Link} to="/availability">
                  Manage Availability
                </ListGroup.Item>
              )}
              {userData?.role === 'admin' && (
                <ListGroup.Item action as={Link} to="/manage-doctors">
                  Manage Doctors
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;