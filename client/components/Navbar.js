import { Navbar, Nav, Container, NavDropdown, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>Clinic</Navbar.Brand>
          <div className="ms-auto">
            <Spinner animation="border" size="sm" />
          </div>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Clinic</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/appointments">Appointments</Nav.Link>
            <Nav.Link as={Link} to="/doctors">Doctors</Nav.Link>
            
            {/* Admin-specific links */}
            {user?.role === 'admin' && (
              <>
                <Nav.Link as={Link} to="/add-doctor">Add Doctor</Nav.Link>
                <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
              </>
            )}

            {/* Doctor-specific links */}
            {user?.role === 'doctor' && (
              <Nav.Link as={Link} to="/availability">Availability</Nav.Link>
            )}
          </Nav>

          <Nav>
            {user ? (
              <NavDropdown title={`Welcome, ${user.name}`} align="end">
                <NavDropdown.Item as={Link} to="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;