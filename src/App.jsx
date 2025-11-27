import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { AuthProvider } from './contexts/AuthContext'
// Cognito removed - using PostgreSQL auth only
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Docs from './pages/Docs'
import Services from './pages/Services'
import Contact from './pages/Contact'
import DataBank from './pages/DataBank'
import CourseViewer from './pages/CourseViewer'
import ApplicationHub from './pages/ApplicationHub'
import DataExplorer from './pages/DataExplorer'
import AuthPage from './pages/AuthPage'
import UserProfile from './pages/UserProfile'
import StackBuilder from './pages/StackBuilder'
import PipelineBuilder from './pages/PipelineBuilder'
import CourseGenerator from './pages/CourseGenerator'
import Showcase from './pages/Showcase'
import MCPGeneratorPage from './pages/MCPGeneratorPage'
import Hub from './pages/Hub'
import CourseCreationStudio from './pages/CourseCreationStudio'
import SkillGenerator from './pages/SkillGenerator'
import SkillUpload from './pages/SkillUpload'
import WorkflowCreation from './pages/WorkflowCreation'

const AppContainer = styled.div`
  height: ${props => props.$fixedFrame ? '100vh' : 'auto'};
  display: flex;
  flex-direction: column;
  overflow: ${props => props.$fixedFrame ? 'hidden' : 'visible'};
`

const MainContent = styled.main`
  flex: 1;
  overflow: ${props => props.$fixedFrame ? 'hidden' : 'auto'};
  height: ${props => props.$fixedFrame ? 'calc(100vh - 90px)' : 'auto'};
`

function AppContent() {
  const location = useLocation();
  const hideFooter = location.pathname === '/hub' || location.pathname === '/courses' || location.pathname === '/doc' || location.pathname === '/create-course' || location.pathname === '/create-skill' || location.pathname === '/upload-skill' || location.pathname === '/create-workflow';
  const isFixedFrame = hideFooter;

  // Lock body scrolling for fixed application frame routes
  useEffect(() => {
    if (isFixedFrame) {
      // Prevent document-level scrolling
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Restore scrolling for other routes
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isFixedFrame]);

  return (
    <AppContainer $fixedFrame={isFixedFrame}>
      <ScrollToTop />
      <Header />
      <MainContent $fixedFrame={isFixedFrame}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/doc" element={<Docs />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/databank" element={<DataBank />} />
          <Route path="/pipeline-builder" element={<PipelineBuilder />} />
          <Route path="/mcp-generator" element={<MCPGeneratorPage />} />
          <Route path="/generate-course" element={<CourseGenerator />} />
          <Route path="/create-course" element={<CourseCreationStudio />} />
          <Route path="/create-skill" element={<SkillGenerator />} />
          <Route path="/upload-skill" element={<SkillUpload />} />
          <Route path="/create-workflow" element={<WorkflowCreation />} />
          <Route path="/courses" element={<Navigate to="/hub" replace />} />
          <Route path="/hub" element={<Hub />} />
          <Route path="/deployment-builder" element={<ApplicationHub />} />
          <Route path="/course/:courseId" element={<CourseViewer />} />
          <Route path="/data-explorer" element={<DataExplorer />} />
          <Route path="/stack-builder" element={<StackBuilder />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </MainContent>
      {!hideFooter && <Footer />}
    </AppContainer>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App