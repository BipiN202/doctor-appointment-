import { Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Container className="mt-4">
      <h2>Profile</h2>
      <div className="mt-3">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
    </Container>
  );
};

export default Profile;