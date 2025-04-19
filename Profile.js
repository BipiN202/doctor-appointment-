import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Alert, Spinner, Button, Card } from 'react-bootstrap';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/me');
        setProfileData(data.data);
      } catch (error) {
        console.error('Profile fetch error:', error);
        setError('Failed to load profile data. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Profile</h2>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {profileData && (
        <Card>
          <Card.Body>
            <Card.Title>{profileData.name}</Card.Title>
            <Card.Text>
              <strong>Email:</strong> {profileData.email}<br />
              <strong>Role:</strong> {profileData.role}<br />
              {profileData.phone && <><strong>Phone:</strong> {profileData.phone}<br /></>}
              {profileData.address && <><strong>Address:</strong> {profileData.address}<br /></>}
              {profileData.specialization && <><strong>Specialization:</strong> {profileData.specialization}<br /></>}
              <strong>Member since:</strong> {new Date(profileData.createdAt).toLocaleDateString()}
            </Card.Text>
            <Button variant="primary" onClick={() => {/* Add edit functionality */ }}>
              Edit Profile
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Profile;