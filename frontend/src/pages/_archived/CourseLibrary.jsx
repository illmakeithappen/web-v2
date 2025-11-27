import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LibraryContainer = styled.div`
  min-height: 100vh;
  background: #faf9f7;
`;

const LibraryHeader = styled.div`
  background: var(--gitthub-light-beige);
  padding: 3rem 2rem;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  color: var(--gitthub-black);
  margin-bottom: 1rem;
`;

const PageDescription = styled.p`
  font-size: 1.2rem;
  color: var(--gitthub-gray);
  line-height: 1.6;
`;

const LibraryContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SidePanel = styled.div`
  flex: 0 0 280px;
  background: white;
  border: 2px solid var(--gitthub-gray);
  border-radius: 8px;
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: calc(70px + 2rem);

  @media (max-width: 768px) {
    position: static;
    flex: 1;
  }
`;

const PanelTitle = styled.h3`
  font-size: 1.25rem;
  color: var(--gitthub-black);
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--gitthub-black);
  font-size: 0.9rem;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  background: white;
  font-size: 1rem;
  cursor: pointer;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }
`;

const CreateButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: var(--gitthub-black);
  color: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: var(--gitthub-gray);
    transform: translateY(-2px);
  }
`;

const MainContent = styled.div`
  flex: 1;
`;

const CoursesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CourseCard = styled.div`
  background: white;
  border: 2px solid var(--gitthub-gray);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: row;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CourseCardHeader = styled.div`
  background: var(--gitthub-beige);
  padding: 2rem;
  border-right: 2px solid var(--gitthub-gray);
  flex: 0 0 350px;

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 2px solid var(--gitthub-gray);
    flex: 1;
  }
`;

const CourseTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--gitthub-black);
  margin-bottom: 0.75rem;
  font-weight: 700;
`;

const CourseDescription = styled.p`
  color: var(--gitthub-gray);
  font-size: 1rem;
  line-height: 1.5;
`;

const CourseCardBody = styled.div`
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CourseMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: var(--gitthub-gray);
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${props => {
    switch(props.status) {
      case 'published': return '#4caf50';
      case 'draft': return '#ff9800';
      default: return 'var(--gitthub-gray)';
    }
  }};
  color: white;
`;

const ViewButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: var(--gitthub-black);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: var(--gitthub-gray);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: var(--gitthub-light-beige);
  border-radius: 8px;
  border: 2px dashed var(--gitthub-gray);
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--gitthub-black);
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: var(--gitthub-gray);
  margin-bottom: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid var(--gitthub-light-beige);
  border-top-color: var(--gitthub-black);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const MessageCard = styled.div`
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
  font-weight: 600;
  border: 3px solid var(--gitthub-black);
`;

const ErrorMessage = styled(MessageCard)`
  background: #FEE;
  color: var(--gitthub-black);
`;

const SuccessMessage = styled(MessageCard)`
  background: #EFE;
  color: var(--gitthub-black);
`;

const GeneratorSection = styled.section`
  background: var(--gitthub-white);
  border: 3px solid var(--gitthub-black);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xxl);
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: var(--spacing-xl);
  letter-spacing: -0.02em;
  color: var(--gitthub-black);
`;

const GeneratorForm = styled.form`
  display: grid;
  gap: var(--spacing-lg);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$half ? '1fr 1fr' : '1fr'};
  gap: var(--spacing-lg);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: grid;
  gap: var(--spacing-sm);
`;

const Label = styled.label`
  color: var(--gitthub-black);
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: -0.01em;
`;

const Input = styled.input`
  padding: var(--spacing-md);
  border: 3px solid var(--gitthub-black);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  background: var(--gitthub-white);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--gitthub-dark-beige);
  }
`;

const TextArea = styled.textarea`
  padding: var(--spacing-md);
  border: 3px solid var(--gitthub-black);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  min-height: 120px;
  resize: vertical;
  background: var(--gitthub-white);
  font-family: var(--font-primary);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--gitthub-dark-beige);
  }
`;

const Select = styled.select`
  padding: var(--spacing-md);
  border: 3px solid var(--gitthub-black);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background: var(--gitthub-white);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--gitthub-dark-beige);
  }
`;

const SubmitButton = styled.button`
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--gitthub-black);
  color: var(--gitthub-white);
  border: 3px solid var(--gitthub-black);
  border-radius: var(--radius-md);
  font-weight: 800;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: -0.01em;

  &:hover {
    background: var(--gitthub-white);
    color: var(--gitthub-black);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  padding: var(--spacing-md) var(--spacing-lg);
  background: #ff6b6b;
  color: white;
  border: 2px solid var(--gitthub-black);
  border-radius: var(--radius-md);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  float: right;
  margin-bottom: var(--spacing-lg);

  &:hover {
    background: #ff5252;
  }
`;

function CourseLibrary() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCourseGenerator, setShowCourseGenerator] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Course generator state
  const [courseForm, setCourseForm] = useState({
    topic: '',
    level: 'beginner',
    duration: '4 weeks',
    targetAudience: '',
    learningObjectives: ''
  });
  
  const [generatedCourse, setGeneratedCourse] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [levelFilter, statusFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/courses/bedrock/list', {
        params: {
          level: levelFilter || undefined,
          status: statusFilter || undefined,
          limit: 20
        }
      });
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchCourses();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('/api/v1/courses/bedrock/search', {
        params: {
          query: searchQuery,
          level: levelFilter || undefined,
          status: statusFilter || undefined
        }
      });
      setCourses(response.data.results || []);
    } catch (error) {
      console.error('Error searching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleCourseGenerate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsGenerating(true);

    try {
      const requestData = {
        topic: courseForm.topic,
        level: courseForm.level,
        duration: courseForm.duration,
        learning_objectives: courseForm.learningObjectives.split('\n').filter(o => o.trim()),
        target_audience: courseForm.targetAudience,
        prerequisites: [],
        include_assessments: true,
        include_projects: true,
        language: 'english',
        ai_model: 'template'
      };

      const response = await axios.post('/api/v1/courses/generate', requestData);
      
      if (response.data.success && response.data.course) {
        setGeneratedCourse(response.data.course);
        setSuccess('Course generated successfully!');
        
        // Reset form
        setCourseForm({
          topic: '',
          level: 'beginner',
          duration: '4 weeks',
          targetAudience: '',
          learningObjectives: ''
        });

        // Refresh courses list
        fetchCourses();
        setShowCourseGenerator(false);
      } else {
        throw new Error('Failed to generate course');
      }
    } catch (error) {
      console.error('Error generating course:', error);
      setError(error.response?.data?.detail || 'Failed to generate course. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      (course.tags && course.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  });

  return (
    <LibraryContainer>
      <LibraryContent>
        <SidePanel>
          <PanelTitle>Filters</PanelTitle>

          <SearchInput
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />

          <FilterGroup>
            <FilterLabel>Difficulty Level</FilterLabel>
            <FilterSelect
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </FilterSelect>
          </FilterGroup>

          <CreateButton onClick={() => setShowCourseGenerator(true)}>
            + Create Course
          </CreateButton>
        </SidePanel>

        <MainContent>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          ) : filteredCourses.length > 0 ? (
            <CoursesList>
            {filteredCourses.map((course) => (
              <CourseCard key={course.id || course.course_id} onClick={() => handleViewCourse(course.course_id || course.id)}>
                <CourseCardHeader>
                  <CourseTitle>{course.title}</CourseTitle>
                  <CourseDescription>{course.description}</CourseDescription>
                </CourseCardHeader>
                <CourseCardBody>
                  <div>
                    <CourseMeta>
                      <MetaItem>
                        <span>📚</span> {course.level}
                      </MetaItem>
                      <MetaItem>
                        <span>⏱️</span> {course.duration}
                      </MetaItem>
                      <StatusBadge status={course.status}>
                        {course.status}
                      </StatusBadge>
                    </CourseMeta>
                    {course.tags && course.tags.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        {course.tags.slice(0, 5).map((tag, index) => (
                          <span
                            key={index}
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.5rem',
                              margin: '0.25rem',
                              background: 'var(--gitthub-light-beige)',
                              borderRadius: '4px',
                              fontSize: '0.85rem'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ViewButton onClick={(e) => {
                    e.stopPropagation();
                    handleViewCourse(course.course_id || course.id);
                  }}>
                    View Course →
                  </ViewButton>
                </CourseCardBody>
              </CourseCard>
            ))}
          </CoursesList>
        ) : (
          <EmptyState>
            <EmptyStateTitle>No Courses Found</EmptyStateTitle>
            <EmptyStateText>
              {searchQuery
                ? `No courses match your search "${searchQuery}"`
                : 'Be the first to create an AI-powered course!'
              }
            </EmptyStateText>
            <CreateButton onClick={() => setShowCourseGenerator(true)}>
              Create Your First Course
            </CreateButton>
          </EmptyState>
        )}
        </MainContent>
      </LibraryContent>

      {/* Course Generator Modal */}
      {showCourseGenerator && (
        <GeneratorSection>
          <CloseButton onClick={() => setShowCourseGenerator(false)}>
            ✕ Close
          </CloseButton>
          <SectionTitle>AI Course Generator</SectionTitle>

          <GeneratorForm onSubmit={handleCourseGenerate}>
            <FormRow>
              <FormGroup>
                <Label htmlFor="topic">Course Topic *</Label>
                <Input
                  id="topic"
                  name="topic"
                  type="text"
                  value={courseForm.topic}
                  onChange={(e) => setCourseForm({...courseForm, topic: e.target.value})}
                  placeholder="e.g., Machine Learning Fundamentals"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormRow $half>
              <FormGroup>
                <Label htmlFor="level">Difficulty Level</Label>
                <Select
                  id="level"
                  name="level"
                  value={courseForm.level}
                  onChange={(e) => setCourseForm({...courseForm, level: e.target.value})}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="duration">Course Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="text"
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                  placeholder="e.g., 4 weeks, 10 hours"
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  name="targetAudience"
                  type="text"
                  value={courseForm.targetAudience}
                  onChange={(e) => setCourseForm({...courseForm, targetAudience: e.target.value})}
                  placeholder="e.g., Data scientists, Software engineers, Students"
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="learningObjectives">Learning Objectives (one per line)</Label>
                <TextArea
                  id="learningObjectives"
                  name="learningObjectives"
                  value={courseForm.learningObjectives}
                  onChange={(e) => setCourseForm({...courseForm, learningObjectives: e.target.value})}
                  placeholder="Understand fundamental ML concepts\nBuild and train models\nEvaluate model performance"
                />
              </FormGroup>
            </FormRow>

            <SubmitButton type="submit" disabled={isGenerating || !courseForm.topic}>
              {isGenerating ? 'Generating Course...' : 'Generate AI Course'}
            </SubmitButton>
          </GeneratorForm>
        </GeneratorSection>
      )}
    </LibraryContainer>
  );
}

export default CourseLibrary;
