import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_URL } from '../config';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--gitthub-black);
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Button = styled.button`
  background: var(--gitthub-black);
  color: white;
  padding: 0.85rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: var(--gitthub-black);
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.5rem 0;
  text-align: center;

  &:hover {
    color: var(--gitthub-gray);
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border-left: 4px solid #c62828;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  background: #e8f5e9;
  color: #2e7d32;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border-left: 4px solid #2e7d32;
  font-size: 0.9rem;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--gitthub-black);
  font-size: 1.75rem;
`;

export default function PostgresAuth({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = `${API_URL}/auth/login`;
      const payload = {
        email: formData.email,
        password: formData.password
      };

      console.log('Making auth request to:', endpoint);
      const response = await axios.post(endpoint, payload);

      console.log('Auth response:', response.data);

      if (response.data.token) {
        // Store token (backend returns 'token', not 'access_token')
        localStorage.setItem('access_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setSuccess('Signed in successfully!');

        // Trigger success callback after short delay
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 500);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title>Sign In</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <Form onSubmit={handleSubmit}>
        <FormField>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
            required
            placeholder="you@example.com"
          />
        </FormField>

        <FormField>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
            required
            minLength="6"
            placeholder="••••••••"
          />
        </FormField>

        <Button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : 'Sign In'}
        </Button>
      </Form>
    </>
  );
}