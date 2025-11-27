// frontend/src/pages/DataExplorer.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import axios from 'axios';

const ExplorerContainer = styled.div`
  min-height: 100vh;
  background: var(--gitthub-white);
`;

const Header = styled.header`
  background: var(--gitthub-light-beige);
  padding: 2rem 0;
  border-bottom: 3px solid var(--gitthub-black);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Title = styled.h1`
  color: var(--gitthub-black);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--gitthub-gray);
  font-size: 1.1rem;
`;

const TabContainer = styled.div`
  background: var(--gitthub-beige);
  border-bottom: 3px solid var(--gitthub-black);
  padding: 0;
`;

const TabList = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 0;
`;

const Tab = styled.button`
  background: ${props => props.active ? 'var(--gitthub-white)' : 'transparent'};
  border: none;
  border-bottom: ${props => props.active ? '3px solid var(--gitthub-red)' : 'none'};
  padding: 1rem 2rem;
  font-size: 1rem;
  color: var(--gitthub-black);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.active ? '600' : '400'};

  &:hover {
    background: var(--gitthub-light-beige);
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const DashboardContainer = styled.div`
  background: var(--gitthub-white);
  border: 1px solid var(--gitthub-beige);
  border-radius: 8px;
  padding: 1rem;
  min-height: 800px;
  position: relative;

  iframe {
    width: 100%;
    height: 800px;
    border: none;
    border-radius: 4px;
  }
`;

const SqlLabContainer = styled.div`
  background: var(--gitthub-white);
  border: 1px solid var(--gitthub-beige);
  border-radius: 8px;
  padding: 2rem;
`;

const SqlEditor = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 1px solid var(--gitthub-beige);
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  background: var(--gitthub-light-beige);
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }
`;

const Button = styled.button`
  background: var(--gitthub-black);
  color: var(--gitthub-white);
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: var(--gitthub-gray);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultsTable = styled.div`
  margin-top: 2rem;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    background: var(--gitthub-white);

    th {
      background: var(--gitthub-beige);
      padding: 0.75rem;
      text-align: left;
      border-bottom: 2px solid var(--gitthub-black);
      font-weight: 600;
    }

    td {
      padding: 0.75rem;
      border-bottom: 1px solid var(--gitthub-light-beige);
    }

    tr:hover {
      background: var(--gitthub-light-beige);
    }
  }
`;

const DashboardList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const DashboardCard = styled.div`
  background: var(--gitthub-white);
  border: 1px solid var(--gitthub-beige);
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-color: var(--gitthub-black);
  }

  h3 {
    color: var(--gitthub-black);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--gitthub-gray);
    font-size: 0.9rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid var(--gitthub-beige);
    border-top-color: var(--gitthub-black);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c00;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
`;

const DataExplorer = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboards, setDashboards] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM databank_resources LIMIT 10');
  const [queryResults, setQueryResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [supersetEnabled, setSupersetEnabled] = useState(false);
  const dashboardRef = useRef(null);

  useEffect(() => {
    checkSupersetStatus();
    if (activeTab === 'dashboards') {
      fetchDashboards();
    }
  }, [activeTab]);

  const checkSupersetStatus = async () => {
    try {
      const response = await axios.get('/api/superset/status');
      setSupersetEnabled(response.data.enabled);
    } catch (err) {
      console.error('Failed to check Superset status:', err);
    }
  };

  const fetchDashboards = async () => {
    setLoading(true);
    try {
      // For demo purposes, using a default user ID
      const response = await axios.get('/api/superset/dashboards?user_id=demo');
      setDashboards(response.data.dashboards || []);
    } catch (err) {
      setError('Failed to fetch dashboards');
    } finally {
      setLoading(false);
    }
  };

  const embedSupersetDashboard = async (dashboardId) => {
    if (!dashboardRef.current) return;

    try {
      // Get guest token
      const tokenResponse = await axios.post('/api/superset/guest-token', {
        user_id: 'demo',
        dashboard_id: dashboardId
      });

      // Embed the dashboard
      embedDashboard({
        id: dashboardId,
        supersetDomain: process.env.REACT_APP_SUPERSET_URL || 'http://localhost:8088',
        mountPoint: dashboardRef.current,
        fetchGuestToken: () => tokenResponse.data.token,
        dashboardUiConfig: {
          hideTitle: false,
          filters: {
            expanded: true,
          },
          urlParams: {
            standalone: true,
            show_filters: true,
            show_native_filters: true,
          },
        },
      });
    } catch (err) {
      setError('Failed to embed dashboard');
      console.error(err);
    }
  };

  const executeQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/superset/sql/execute', {
        query: sqlQuery,
        user_id: 'demo'
      });
      setQueryResults(response.data.result);
    } catch (err) {
      setError(err.response?.data?.detail || 'Query execution failed');
    } finally {
      setLoading(false);
    }
  };

  const openDashboard = (dashboard) => {
    setSelectedDashboard(dashboard);
    setActiveTab('dashboard');
    setTimeout(() => {
      embedSupersetDashboard(dashboard.id);
    }, 100);
  };

  if (!supersetEnabled) {
    return (
      <ExplorerContainer>
        <Header>
          <HeaderContent>
            <Title>Data Explorer</Title>
            <Subtitle>Advanced Data Analysis & Visualization</Subtitle>
          </HeaderContent>
        </Header>
        <Content>
          <ErrorMessage>
            Superset integration is not configured. Please contact your administrator.
          </ErrorMessage>
        </Content>
      </ExplorerContainer>
    );
  }

  return (
    <ExplorerContainer>
      <Header>
        <HeaderContent>
          <Title>GitThub Data Explorer</Title>
          <Subtitle>Powered by Apache Superset - Explore, Analyze, Visualize</Subtitle>
        </HeaderContent>
      </Header>

      <TabContainer>
        <TabList>
          <Tab 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          >
            Main Dashboard
          </Tab>
          <Tab 
            active={activeTab === 'sql'} 
            onClick={() => setActiveTab('sql')}
          >
            SQL Lab
          </Tab>
          <Tab 
            active={activeTab === 'dashboards'} 
            onClick={() => setActiveTab('dashboards')}
          >
            My Dashboards
          </Tab>
        </TabList>
      </TabContainer>

      <Content>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {activeTab === 'dashboard' && (
          <DashboardContainer>
            <h2>{selectedDashboard ? selectedDashboard.title : 'GitThub Main Dashboard'}</h2>
            <div ref={dashboardRef} id="superset-container" />
            {!selectedDashboard && (
              <iframe
                src={`${process.env.REACT_APP_SUPERSET_URL || 'http://localhost:8088'}/superset/dashboard/gitthub-main/?standalone=true`}
                title="GitThub Dashboard"
              />
            )}
          </DashboardContainer>
        )}

        {activeTab === 'sql' && (
          <SqlLabContainer>
            <h2>SQL Query Editor</h2>
            <p>Write and execute SQL queries directly on your data</p>
            
            <SqlEditor
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
            />
            
            <Button onClick={executeQuery} disabled={loading || !sqlQuery}>
              {loading ? 'Executing...' : 'Execute Query'}
            </Button>

            {queryResults && (
              <ResultsTable>
                <h3>Query Results</h3>
                <table>
                  <thead>
                    <tr>
                      {queryResults.columns?.map((col, idx) => (
                        <th key={idx}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResults.data?.slice(0, 100).map((row, idx) => (
                      <tr key={idx}>
                        {queryResults.columns?.map((col, colIdx) => (
                          <td key={colIdx}>{row[col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {queryResults.data?.length > 100 && (
                  <p>Showing first 100 rows of {queryResults.data.length} total rows</p>
                )}
              </ResultsTable>
            )}
          </SqlLabContainer>
        )}

        {activeTab === 'dashboards' && (
          <div>
            <h2>Your Dashboards</h2>
            <p>Select a dashboard to view and interact with your data</p>
            
            {loading ? (
              <LoadingSpinner />
            ) : (
              <DashboardList>
                {dashboards.map((dashboard) => (
                  <DashboardCard 
                    key={dashboard.id}
                    onClick={() => openDashboard(dashboard)}
                  >
                    <h3>{dashboard.title}</h3>
                    <p>{dashboard.published ? 'Published' : 'Draft'}</p>
                    <p>ID: {dashboard.id}</p>
                  </DashboardCard>
                ))}
                {dashboards.length === 0 && (
                  <p>No dashboards available. Upload data to create automatic dashboards!</p>
                )}
              </DashboardList>
            )}
          </div>
        )}
      </Content>
    </ExplorerContainer>
  );
};

export default DataExplorer;