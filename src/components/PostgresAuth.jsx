import React, { useState } from 'react';
import styled from 'styled-components';
import authService from '../services/auth-service';

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
  const [mode, setMode] = useState('signin'); // 'signin' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
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
      let result;

      if (mode === 'signin') {
        result = await authService.signIn(formData.email, formData.password);
      } else {
        result = await authService.register({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName
        });
      }

      if (result.success) {
        setSuccess(result.message);

        // Trigger success callback after short delay
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 500);
      } else {
        setError(result.message || `${mode === 'signin' ? 'Sign in' : 'Registration'} failed. Please try again.`);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(`${mode === 'signin' ? 'Sign in' : 'Registration'} failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'register' : 'signin');
    setError('');
    setSuccess('');
    setFormData({
      email: '',
      password: '',
      fullName: ''
    });
  };

  return (
    <>
      <Title>{mode === 'signin' ? 'Sign In' : 'Create Account'}</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <Form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <FormField>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={loading}
              required
              placeholder="John Doe"
            />
          </FormField>
        )}

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
          {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
        </Button>

        <LinkButton type="button" onClick={toggleMode} disabled={loading}>
          {mode === 'signin'
            ? "Don't have an account? Create one"
            : 'Already have an account? Sign in'}
        </LinkButton>
      </Form>
    </>
  );
}