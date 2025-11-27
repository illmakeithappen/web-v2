import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactFlowProvider } from 'reactflow';
import ToolLibraryPanel from '../components/ToolLibraryPanel';
import TemplatesPanel from '../components/TemplatesPanel';
import WorkflowBuilder from '../components/WorkflowBuilder';
import ExportPanel from '../components/ExportPanel';

// API base URL - uses environment variable in production
const API_URL = import.meta.env.VITE_API_URL || '';

const HubContainer = styled.div`
  min-height: 100vh;
  background: #faf9f7;
`;

const HubHeader = styled.div`
  background: var(--gitthub-light-beige);
  border-bottom: 3px solid var(--gitthub-black);
  padding: 3rem 2rem;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--gitthub-black);
  margin-bottom: 1rem;
`;

const PageDescription = styled.p`
  font-size: 1.2rem;
  color: var(--gitthub-gray);
  line-height: 1.6;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
`;

const HubContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const NavigationPane = styled.div`
  background: #DDDDDD;
  padding: 12px;
  border: 1px solid black;
  border-radius: 4px;
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
  width: 100%;
  box-sizing: border-box;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  padding-bottom: 8px;
`;

const Tab = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: var(--gitthub-black);
  border: ${props => props.$active ? '1px solid black' : 'none'};
  border-bottom: ${props => props.$active ? 'none' : '1px solid transparent'};
  border-radius: ${props => props.$active ? '4px 4px 0 0' : '0'};
  font-weight: ${props => props.$active ? '700' : '600'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  bottom: ${props => props.$active ? '-2px' : '0'};

  &:hover {
    background: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  }
`;

const TabContent = styled.div`
  display: ${props => props.$active ? 'block' : 'none'};
  animation: ${props => props.$active ? 'fadeIn 0.3s' : 'none'};

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const WorkflowContainer = styled.div`
  background: white;
  border: 1px solid black;
  border-radius: 3px;
  height: 600px;
  overflow: hidden;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

const SearchInput = styled.input`
  padding: 0.45rem 0.7rem;
  background: white;
  font-size: 0.95rem;
  flex: 1;
  min-width: 180px;
  max-width: 300px;
  color: var(--gitthub-black);
  border: 1px solid black;
  border-radius: 3px;

  &::placeholder {
    color: var(--gitthub-gray);
  }

  &:focus {
    outline: none;
    border: 2px solid black;
    padding: calc(0.45rem - 1px) calc(0.7rem - 1px);
  }
`;

const FilterSelect = styled.select`
  padding: 0.45rem 1.2rem 0.45rem 0.9rem;
  background: linear-gradient(to bottom, #f0f8ff, #e0f0ff);
  font-size: 0.95rem;
  cursor: pointer;
  color: var(--gitthub-black);
  font-weight: 500;
  flex: 1;
  max-width: 160px;
  border: 1px solid black;
  border-radius: 12px;
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
  appearance: none;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='black' d='M6 8L0 0h12z'/%3E%3C/svg%3E"),
    linear-gradient(to bottom, #f0f8ff, #e0f0ff);
  background-repeat: no-repeat, repeat;
  background-position: right 0.7rem center, center;
  background-size: 10px, cover;

  &:hover {
    background:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='black' d='M6 8L0 0h12z'/%3E%3C/svg%3E"),
      linear-gradient(to bottom, #e6f3ff, #d1e7ff);
    background-repeat: no-repeat, repeat;
    background-position: right 0.7rem center, center;
    background-size: 10px, cover;
  }

  &:focus {
    outline: none;
    border: 2px solid black;
    padding: calc(0.45rem - 1px) calc(1.2rem - 1px) calc(0.45rem - 1px) calc(0.9rem - 1px);
  }
`;

const ActionButton = styled.button`
  padding: 0.45rem 1.2rem;
  background: #FFA500;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  min-width: 80px;
  border: 1px solid black;
  border-radius: 12px;
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
  position: relative;
  transition: background-color 0.1s;

  &:hover {
    background: #FF9400;
  }

  &:active {
    background: #FF8300;
    box-shadow: none;
    transform: translate(1px, 1px);
  }

  &:focus {
    outline: none;
    border: 2px solid black;
    padding: calc(0.45rem - 1px) calc(1.2rem - 1px);
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex: 1;
`;

const MainContent = styled.div`
  width: 100%;
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ResourceCard = styled.div`
  background: white;
  border: 2px solid var(--gitthub-gray);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ResourceScreenshot = styled.div`
  position: relative;
  height: 140px;
  background: var(--gitthub-light-beige);
  overflow: hidden;
  
  /* Browser window chrome */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 28px;
    background: linear-gradient(to bottom, #e8e8e8, #d0d0d0);
    border-bottom: 1px solid #bbb;
    z-index: 2;
  }

  /* Traffic light buttons */
  &::after {
    content: '';
    position: absolute;
    top: 9px;
    left: 10px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ff5f57;
    box-shadow: 
      16px 0 0 #ffbd2e,
      32px 0 0 #28ca42;
    z-index: 3;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    transition: transform 0.3s ease;
    padding-top: 28px;
    box-sizing: border-box;
  }
`;

const ResourceContent = styled.div`
  padding: 1.5rem;
`;

const ResourceIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
`;

const ResourceTitle = styled.h3`
  font-size: 1.3rem;
  color: var(--gitthub-black);
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const ResourceDescription = styled.p`
  color: var(--gitthub-gray);
  font-size: 0.95rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ResourceMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gitthub-light-beige);
`;

const FormatBadge = styled.span`
  background: var(--gitthub-black);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
`;

const CategoryBadge = styled.span`
  background: var(--gitthub-light-beige);
  color: var(--gitthub-black);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid var(--gitthub-gray);
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: var(--gitthub-beige);
  color: var(--gitthub-black);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ResourceActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ViewButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: var(--gitthub-black);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: var(--gitthub-gray);
    transform: translateY(-2px);
  }
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

const MessageCard = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: 600;
  border: 2px solid var(--gitthub-black);
`;

const ErrorMessage = styled(MessageCard)`
  background: #FEE;
  color: var(--gitthub-black);
`;

const SuccessMessage = styled(MessageCard)`
  background: #EFE;
  color: var(--gitthub-black);
`;

// Upload Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border: 3px solid var(--gitthub-black);
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--gitthub-black);
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--gitthub-black);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background: ${props => props.$primary ? 'var(--gitthub-black)' : 'white'};
  color: ${props => props.$primary ? 'white' : 'var(--gitthub-black)'};

  &:hover {
    background: ${props => props.$primary ? 'var(--gitthub-gray)' : 'var(--gitthub-light-beige)'};
  }
`;

// Bookmarks Section Styles
const BookmarksSection = styled.div`
  margin-top: 4px;
`;

const BookmarksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const BookmarksTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--gitthub-black);
  margin: 0;
`;

const BookmarksTable = styled.div`
  background: white;
  border: 1px solid black;
  border-radius: 3px;
  overflow: hidden;
`;

const BookmarkRow = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #ccc;
  background: ${props => props.$isDragging ? '#f0f8ff' : 'white'};
  transition: background-color 0.1s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9f9f9;
  }
`;

const DragHandle = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 12px;
  cursor: grab;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  flex-shrink: 0;

  &:active {
    cursor: grabbing;
  }

  span {
    display: block;
    width: 100%;
    height: 2px;
    background: #999;
    border-radius: 1px;
  }
`;

const BookmarkTitle = styled.div`
  flex: 1;
  font-size: 0.95rem;
  color: var(--gitthub-black);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BookmarkCategory = styled.div`
  padding: 2px 8px;
  background: var(--gitthub-light-beige);
  border: 1px solid var(--gitthub-gray);
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--gitthub-gray);
  margin: 0 12px;
`;

const BookmarkActions = styled.div`
  display: flex;
  gap: 8px;
`;

const BookmarkButton = styled.button`
  padding: 4px 8px;
  background: ${props => props.$remove ? '#FFA500' : 'linear-gradient(to bottom, #f0f8ff, #e0f0ff)'};
  color: ${props => props.$remove ? 'white' : 'var(--gitthub-black)'};
  border: 1px solid black;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: ${props => props.$remove ? '#FF9400' : 'linear-gradient(to bottom, #e6f3ff, #d1e7ff)'};
  }

  &:active {
    transform: translate(1px, 1px);
  }
`;

const EmptyBookmarks = styled.div`
  padding: 24px;
  text-align: center;
  color: var(--gitthub-gray);
  font-size: 0.95rem;
`;

// Split View Components
const StackBuilderContainer = styled.div`
  display: flex;
  gap: 12px;
  height: 400px;
  background: white;
  border: 1px solid black;
  border-radius: 3px;
`;

const StackPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #999;
`;

const BuildPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PanelHeader = styled.div`
  padding: 8px 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #ccc;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--gitthub-black);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const StackLayersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: white;
  border: 1px solid black;
  border-radius: 3px;
  padding: 8px;
`;

const StackLayer = styled.div`
  background: ${props => props.$isDraggedOver ? '#f0f8ff' : '#f9f9f9'};
  border: 1px dashed ${props => props.$isDraggedOver ? '#FFA500' : '#999'};
  border-radius: 3px;
  padding: 8px;
  min-height: 60px;
  transition: all 0.2s;
`;

const LayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const LayerTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--gitthub-black);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LayerCount = styled.span`
  background: #FFA500;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const LayerResources = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const CompactResource = styled.div`
  background: white;
  border: 1px solid var(--gitthub-black);
  border-radius: 3px;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: grab;
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  ${props => props.$isDragging && `
    opacity: 0.5;
    cursor: grabbing;
  `}

  &:hover {
    background: var(--gitthub-light-beige);
  }
`;

const ExportButton = styled.button`
  padding: 4px 10px;
  background: linear-gradient(to bottom, #f0f8ff, #e0f0ff);
  color: var(--gitthub-black);
  border: 1px solid black;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.1s;

  &:hover {
    background: linear-gradient(to bottom, #e6f3ff, #d1e7ff);
  }

  &:active {
    transform: translate(1px, 1px);
  }
`;

const BookmarkToggle = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: ${props => props.$bookmarked ? '#FFA500' : 'white'};
  border: 2px solid ${props => props.$bookmarked ? '#FFA500' : 'var(--gitthub-gray)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 2;

  &:hover {
    transform: scale(1.1);
    background: ${props => props.$bookmarked ? '#FF9400' : 'var(--gitthub-light-beige)'};
  }

  svg {
    width: 16px;
    height: 16px;
    fill: ${props => props.$bookmarked ? 'white' : 'var(--gitthub-gray)'};
  }
`;

function DataBank() {
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState('');
  const [formats, setFormats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [stackLayers, setStackLayers] = useState({
    frontend: [],
    backend: [],
    data: [],
    devops: []
  });

  // New state for SRC functionality
  const [activeTab, setActiveTab] = useState('stack');
  const [selectedTools, setSelectedTools] = useState([]);
  const [workflowNodes, setWorkflowNodes] = useState([]);
  const [workflowEdges, setWorkflowEdges] = useState([]);
  const reactFlowWrapper = useRef(null);

  // Modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('document');
  
  // Upload form state for documents
  const [documentForm, setDocumentForm] = useState({
    title: '',
    description: '',
    category: '',
    file: null,
    tags: '',
  });

  // Upload form state for links
  const [linkForm, setLinkForm] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
    tags: ''
  });

  useEffect(() => {
    fetchStats();
    fetchResources();
    fetchFormats();
    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem('databankBookmarks');
    if (savedBookmarks) {
      setBookmarkedResources(JSON.parse(savedBookmarks));
    }
    // Load stack layers from localStorage
    const savedStackLayers = localStorage.getItem('databankStackLayers');
    if (savedStackLayers) {
      setStackLayers(JSON.parse(savedStackLayers));
    }
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/databank/stats`);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setStats({
        total_resources: 0,
        total_documents: 0,
        total_links: 0,
        total_courses: 0,
        database_type: 'Unknown'
      });
    }
  };

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (selectedFormat) params.format = selectedFormat;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedResourceType) params.resource_type = selectedResourceType;
      
      const response = await axios.get(`${API_URL}/api/v1/databank/resources`, { params });
      setResources(response.data.resources || []);
    } catch (err) {
      setError('Failed to load resources');
      console.error('Error fetching resources:', err);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/databank/formats`);
      setFormats(response.data.formats || []);
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error('Error fetching formats:', err);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/databank/resources/search`, {
        query: searchQuery,
        format: selectedFormat || null,
        category: selectedCategory || null,
        resource_type: selectedResourceType || null,
        limit: 50,
        offset: 0
      });
      setResources(response.data.resources || []);
    } catch (err) {
      setError('Search failed');
      console.error('Error searching:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceAction = async (resource) => {
    try {
      if (resource.resource_type === 'link' && resource.external_url) {
        window.open(resource.external_url, '_blank');
      } else if (resource.file_url) {
        window.open(resource.file_url, '_blank');
      } else if (resource.id) {
        window.open(`${API_URL}/api/v1/databank/resources/${resource.id}/download`, '_blank');
      }
    } catch (err) {
      setError('Action failed');
      console.error('Error:', err);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    
    if (uploadType === 'document') {
      formData.append('file', documentForm.file);
      formData.append('title', documentForm.title);
      formData.append('description', documentForm.description);
      formData.append('category', documentForm.category);
      formData.append('tags', documentForm.tags);
      
      try {
        await axios.post(`${API_URL}/api/v1/databank/resources/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Document uploaded successfully!');
        setDocumentForm({ title: '', description: '', category: '', file: null, tags: '' });
      } catch (err) {
        setError(err.response?.data?.detail || 'Upload failed');
      }
    } else {
      formData.append('title', linkForm.title);
      formData.append('url', linkForm.url);
      formData.append('description', linkForm.description);
      formData.append('category', linkForm.category);
      formData.append('tags', linkForm.tags);
      
      try {
        await axios.post(`${API_URL}/api/v1/databank/resources/add-link`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Link added successfully!');
        setLinkForm({ title: '', url: '', description: '', category: '', tags: '' });
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to add link');
      }
    }
    
    if (!error) {
      fetchResources();
      fetchStats();
      setShowUploadModal(false);
    }
  };


  const removeBookmark = (resourceId) => {
    const newBookmarks = bookmarkedResources.filter(b => b.id !== resourceId);
    setBookmarkedResources(newBookmarks);
    localStorage.setItem('databankBookmarks', JSON.stringify(newBookmarks));
  };

  const isBookmarked = (resourceId) => {
    return bookmarkedResources.some(b => b.id === resourceId);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Handle reordering in bookmarks list
    if (source.droppableId === 'bookmarks' && destination.droppableId === 'bookmarks') {
      const items = Array.from(bookmarkedResources);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setBookmarkedResources(items);
      localStorage.setItem('databankBookmarks', JSON.stringify(items));
      return;
    }

    // Handle drag between stack layers
    const sourceLayer = source.droppableId;
    const destLayer = destination.droppableId;

    if (sourceLayer === destLayer) {
      // Reordering within same layer
      const items = Array.from(stackLayers[sourceLayer]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const newLayers = {
        ...stackLayers,
        [sourceLayer]: items
      };
      setStackLayers(newLayers);
      localStorage.setItem('databankStackLayers', JSON.stringify(newLayers));
    } else {
      // Moving between layers
      const sourceItems = Array.from(stackLayers[sourceLayer] || []);
      const destItems = Array.from(stackLayers[destLayer] || []);

      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      const newLayers = {
        ...stackLayers,
        [sourceLayer]: sourceItems,
        [destLayer]: destItems
      };
      setStackLayers(newLayers);
      localStorage.setItem('databankStackLayers', JSON.stringify(newLayers));
    }
  };

  // Function to categorize resource into appropriate stack layer
  const categorizeResource = (resource) => {
    const title = resource.title?.toLowerCase() || '';
    const category = resource.category?.toLowerCase() || '';
    const description = resource.description?.toLowerCase() || '';
    const tags = resource.tags?.map(t => t.toLowerCase()) || [];
    const allText = `${title} ${category} ${description} ${tags.join(' ')}`;

    // Frontend keywords
    if (allText.includes('react') || allText.includes('vue') || allText.includes('angular') ||
        allText.includes('frontend') || allText.includes('ui') || allText.includes('css') ||
        allText.includes('javascript') || allText.includes('typescript') || allText.includes('next') ||
        allText.includes('vite') || allText.includes('webpack') || allText.includes('tailwind')) {
      return 'frontend';
    }
    // Data & AI keywords
    else if (allText.includes('database') || allText.includes('sql') || allText.includes('vector') ||
             allText.includes('ai') || allText.includes('ml') || allText.includes('model') ||
             allText.includes('llm') || allText.includes('gpt') || allText.includes('claude') ||
             allText.includes('openai') || allText.includes('pinecone') || allText.includes('chroma') ||
             allText.includes('langchain') || allText.includes('embedding') || allText.includes('rag')) {
      return 'data';
    }
    // DevOps keywords
    else if (allText.includes('deploy') || allText.includes('docker') || allText.includes('kubernetes') ||
             allText.includes('aws') || allText.includes('monitor') || allText.includes('cicd') ||
             allText.includes('terraform') || allText.includes('ansible') || allText.includes('jenkins') ||
             allText.includes('github action') || allText.includes('render') || allText.includes('vercel')) {
      return 'devops';
    }
    // Backend keywords (checked last as default)
    else if (allText.includes('api') || allText.includes('backend') || allText.includes('server') ||
             allText.includes('node') || allText.includes('python') || allText.includes('fastapi') ||
             allText.includes('django') || allText.includes('express') || allText.includes('graphql') ||
             allText.includes('rest') || allText.includes('microservice')) {
      return 'backend';
    }

    return 'backend'; // Default layer
  };

  // Toggle bookmark with stack builder support
  const toggleBookmark = (resource) => {
    const isBookmarked = bookmarkedResources.some(b => b.id === resource.id);

    if (isBookmarked) {
      // Remove from bookmarks
      const newBookmarks = bookmarkedResources.filter(b => b.id !== resource.id);
      setBookmarkedResources(newBookmarks);
      localStorage.setItem('databankBookmarks', JSON.stringify(newBookmarks));

      // Also remove from stack layers
      const newLayers = { ...stackLayers };
      Object.keys(newLayers).forEach(layer => {
        newLayers[layer] = newLayers[layer].filter(r => r.id !== resource.id);
      });
      setStackLayers(newLayers);
      localStorage.setItem('databankStackLayers', JSON.stringify(newLayers));
    } else {
      // Add to bookmarks
      const newBookmarks = [...bookmarkedResources, resource];
      setBookmarkedResources(newBookmarks);
      localStorage.setItem('databankBookmarks', JSON.stringify(newBookmarks));

      // Always auto-categorize and add to appropriate stack layer
      const layer = categorizeResource(resource);
      const newLayers = {
        ...stackLayers,
        [layer]: [...stackLayers[layer], resource]
      };
      setStackLayers(newLayers);
      localStorage.setItem('databankStackLayers', JSON.stringify(newLayers));
    }
  };

  // Auto-organize bookmarked resources into stack layers
  const organizeStackIntoLayers = () => {
    const newLayers = {
      frontend: [...(stackLayers.frontend || [])],
      backend: [...(stackLayers.backend || [])],
      data: [...(stackLayers.data || [])],
      devops: [...(stackLayers.devops || [])]
    };

    // Go through each bookmarked resource
    bookmarkedResources.forEach(resource => {
      // Check if already in any layer
      const alreadyInLayer = Object.values(newLayers).some(layer =>
        layer.some(r => r.id === resource.id)
      );

      // Only add if not already categorized (preserves manual organization)
      if (!alreadyInLayer) {
        const targetLayer = categorizeResource(resource);
        if (newLayers[targetLayer]) {
          newLayers[targetLayer].push(resource);
        }
      }
    });

    setStackLayers(newLayers);
    localStorage.setItem('databankStackLayers', JSON.stringify(newLayers));
  };

  // Export stack configuration
  const exportStack = () => {
    const stackConfig = {
      name: 'My Tech Stack',
      created: new Date().toISOString(),
      layers: stackLayers,
      totalResources: Object.values(stackLayers).flat().length
    };

    const blob = new Blob([JSON.stringify(stackConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-stack-${Date.now()}.json`;
    a.click();
  };

  // New handlers for workflow builder
  const handleTemplateApply = (template) => {
    setWorkflowNodes(template.nodes);
    setWorkflowEdges(template.edges);
    setActiveTab('workflow');
  };

  const handleWorkflowChange = (workflow) => {
    if (workflow.nodes) setWorkflowNodes(workflow.nodes);
    if (workflow.edges) setWorkflowEdges(workflow.edges);
  };

  const handleToolsChange = (tools) => {
    setSelectedTools(tools);
  };

  const handleExportWorkflow = (workflow) => {
    setActiveTab('export');
  };

  return (
    <HubContainer>
      <HubContent>
        <NavigationPane>
          <TabsContainer>
            <Tab $active={activeTab === 'stack'} onClick={() => setActiveTab('stack')}>
              Stack & Build
            </Tab>
            <Tab $active={activeTab === 'tools'} onClick={() => setActiveTab('tools')}>
              Tool Library
            </Tab>
            <Tab $active={activeTab === 'workflow'} onClick={() => setActiveTab('workflow')}>
              Workflow Builder
            </Tab>
            <Tab $active={activeTab === 'templates'} onClick={() => setActiveTab('templates')}>
              Templates
            </Tab>
            <Tab $active={activeTab === 'export'} onClick={() => setActiveTab('export')}>
              Export
            </Tab>
          </TabsContainer>

          <TabContent $active={activeTab === 'stack'}>
          <FilterBar>
            <FilterGroup>
              <SearchInput
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />

              <FilterSelect
                value={selectedResourceType}
                onChange={(e) => setSelectedResourceType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="document">Documents</option>
                <option value="link">Links</option>
              </FilterSelect>

              <FilterSelect
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </FilterSelect>

              <FilterSelect
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                <option value="">All Formats</option>
                {formats.map(format => (
                  <option key={format} value={format}>
                    {format.toUpperCase()}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <ActionButton onClick={() => {
              setSearchQuery('');
              setSelectedResourceType('');
              setSelectedCategory('');
              setSelectedFormat('');
              fetchResources();
            }}>
              Clear
            </ActionButton>
          </FilterBar>

          {/* Stack Section */}
          <BookmarksSection>
          <BookmarksHeader>
            <BookmarksTitle>Stack & Build</BookmarksTitle>
            <ExportButton onClick={exportStack}>
              Export
            </ExportButton>
          </BookmarksHeader>

          <StackBuilderContainer>
            {/* Left Panel - Stack List */}
            <StackPanel>
              <PanelHeader>Stack</PanelHeader>
              <PanelContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                  {bookmarkedResources.length > 0 ? (
                <Droppable droppableId="bookmarks">
                  {(provided) => (
                    <BookmarksTable {...provided.droppableProps} ref={provided.innerRef}>
                      {bookmarkedResources.map((resource, index) => (
                        <Draggable
                          key={resource.id}
                          draggableId={String(resource.id)}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <BookmarkRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              $isDragging={snapshot.isDragging}
                            >
                              <DragHandle {...provided.dragHandleProps}>
                                <span />
                                <span />
                                <span />
                              </DragHandle>
                              <BookmarkTitle>{resource.title}</BookmarkTitle>
                              <BookmarkCategory>
                                {resource.category?.replace(/_/g, ' ') || 'General'}
                              </BookmarkCategory>
                              <BookmarkActions>
                                <BookmarkButton
                                  onClick={() => handleResourceAction(resource)}
                                >
                                  View
                                </BookmarkButton>
                                <BookmarkButton
                                  $remove
                                  onClick={() => removeBookmark(resource.id)}
                                >
                                  Remove
                                </BookmarkButton>
                              </BookmarkActions>
                            </BookmarkRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </BookmarksTable>
                  )}
                </Droppable>
                  ) : (
                    <EmptyBookmarks>
                      Click the star icon on any resource to add it to your stack
                    </EmptyBookmarks>
                  )}
                </DragDropContext>
              </PanelContent>
            </StackPanel>

            {/* Right Panel - Build Layers */}
            <BuildPanel>
              <PanelHeader>Build</PanelHeader>
              <PanelContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <StackLayersContainer>
                {[
                  { id: 'frontend', label: 'Frontend' },
                  { id: 'backend', label: 'Backend' },
                  { id: 'data', label: 'Data & AI' },
                  { id: 'devops', label: 'DevOps' }
                ].map(layer => (
                  <Droppable key={layer.id} droppableId={layer.id}>
                    {(provided, snapshot) => (
                      <StackLayer
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        $isDraggedOver={snapshot.isDraggingOver}
                      >
                        <LayerHeader>
                          <LayerTitle>
                            {layer.label}
                            {stackLayers[layer.id]?.length > 0 && (
                              <LayerCount>{stackLayers[layer.id].length}</LayerCount>
                            )}
                          </LayerTitle>
                        </LayerHeader>
                        <LayerResources>
                          {stackLayers[layer.id]?.map((resource, index) => (
                            <Draggable
                              key={`${layer.id}-${resource.id}`}
                              draggableId={`${layer.id}-${resource.id}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <CompactResource
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  $isDragging={snapshot.isDragging}
                                  title={resource.title}
                                >
                                  {resource.title}
                                </CompactResource>
                              )}
                            </Draggable>
                          )) || null}
                          {provided.placeholder}
                          {(!stackLayers[layer.id] || stackLayers[layer.id].length === 0) && (
                            <div style={{ fontSize: '0.75rem', color: '#999', fontStyle: 'italic' }}>
                              Drop resources here
                            </div>
                          )}
                        </LayerResources>
                      </StackLayer>
                    )}
                  </Droppable>
                ))}
                  </StackLayersContainer>
                </DragDropContext>
              </PanelContent>
            </BuildPanel>
          </StackBuilderContainer>
          </BookmarksSection>
          </TabContent>

          <TabContent $active={activeTab === 'tools'}>
            <ToolLibraryPanel
              selectedTools={selectedTools}
              onToolsChange={handleToolsChange}
            />
          </TabContent>

          <TabContent $active={activeTab === 'workflow'}>
            <WorkflowContainer ref={reactFlowWrapper}>
              <ReactFlowProvider>
                <WorkflowBuilder
                  initialNodes={workflowNodes}
                  initialEdges={workflowEdges}
                  onWorkflowChange={handleWorkflowChange}
                  onExport={handleExportWorkflow}
                />
              </ReactFlowProvider>
            </WorkflowContainer>
          </TabContent>

          <TabContent $active={activeTab === 'templates'}>
            <TemplatesPanel onTemplateApply={handleTemplateApply} />
          </TabContent>

          <TabContent $active={activeTab === 'export'}>
            <ExportPanel
              workflow={{ nodes: workflowNodes, edges: workflowEdges }}
            />
          </TabContent>
        </NavigationPane>

        <MainContent>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          ) : resources.length > 0 ? (
            <ResourceGrid>
              {resources.map(resource => (
                <ResourceCard key={resource.id}>
                  <BookmarkToggle
                    $bookmarked={isBookmarked(resource.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(resource);
                    }}
                    title={isBookmarked(resource.id) ? 'Remove from stack' : 'Add to stack'}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </BookmarkToggle>
                  {resource.screenshot_url && (
                    <ResourceScreenshot>
                      <img 
                        src={`${API_URL}/api/v1/databank/screenshots/${resource.screenshot_url.split('/').pop()}`}
                        alt={resource.title}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </ResourceScreenshot>
                  )}
                  
                  <ResourceContent>
                    <ResourceTitle>{resource.title}</ResourceTitle>
                    <ResourceDescription>{resource.description}</ResourceDescription>
                    
                    <ResourceMeta>
                      <FormatBadge>
                        {resource.format || 'URL'}
                      </FormatBadge>
                      <CategoryBadge>
                        {resource.category?.replace(/_/g, ' ') || 'General'}
                      </CategoryBadge>
                    </ResourceMeta>
                    
                    {resource.tags && resource.tags.length > 0 && (
                      <TagContainer>
                        {resource.tags.slice(0, 3).map((tag, index) => (
                          <Tag key={index}>{tag}</Tag>
                        ))}
                        {resource.tags.length > 3 && (
                          <Tag>+{resource.tags.length - 3}</Tag>
                        )}
                      </TagContainer>
                    )}
                    
                    <ResourceActions>
                      <ViewButton onClick={() => handleResourceAction(resource)}>
                        {resource.resource_type === 'link' ? '🌐 Visit Link' : '📁 Download'}
                      </ViewButton>
                    </ResourceActions>
                  </ResourceContent>
                </ResourceCard>
              ))}
            </ResourceGrid>
          ) : (
            <EmptyState>
              <EmptyStateTitle>No Resources Found</EmptyStateTitle>
              <EmptyStateText>
                {searchQuery 
                  ? `No resources match your search "${searchQuery}"`
                  : 'Try adjusting your search filters or upload new resources to get started.'
                }
              </EmptyStateText>
              <ActionButton $primary onClick={() => setShowUploadModal(true)}>
                Upload Your First Resource
              </ActionButton>
            </EmptyState>
          )}
        </MainContent>
      </HubContent>

      {/* Upload Modal */}
      {showUploadModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Add New Resource</ModalTitle>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <Button 
                $primary={uploadType === 'document'} 
                onClick={() => setUploadType('document')}
              >
                📄 Document
              </Button>
              <Button 
                $primary={uploadType === 'link'} 
                onClick={() => setUploadType('link')}
              >
                🔗 Link
              </Button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <FormGroup>
                <Label>Title *</Label>
                <Input
                  type="text"
                  value={uploadType === 'document' ? documentForm.title : linkForm.title}
                  onChange={(e) => {
                    if (uploadType === 'document') {
                      setDocumentForm({...documentForm, title: e.target.value});
                    } else {
                      setLinkForm({...linkForm, title: e.target.value});
                    }
                  }}
                  required
                  placeholder="Enter title"
                />
              </FormGroup>

              {uploadType === 'link' && (
                <FormGroup>
                  <Label>URL *</Label>
                  <Input
                    type="url"
                    value={linkForm.url}
                    onChange={(e) => setLinkForm({...linkForm, url: e.target.value})}
                    required
                    placeholder="https://example.com"
                  />
                </FormGroup>
              )}

              {uploadType === 'document' && (
                <FormGroup>
                  <Label>File *</Label>
                  <Input
                    type="file"
                    onChange={(e) => setDocumentForm({...documentForm, file: e.target.files[0]})}
                    required
                  />
                </FormGroup>
              )}

              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  value={uploadType === 'document' ? documentForm.description : linkForm.description}
                  onChange={(e) => {
                    if (uploadType === 'document') {
                      setDocumentForm({...documentForm, description: e.target.value});
                    } else {
                      setLinkForm({...linkForm, description: e.target.value});
                    }
                  }}
                  placeholder="Describe this resource..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Category</Label>
                <Select
                  value={uploadType === 'document' ? documentForm.category : linkForm.category}
                  onChange={(e) => {
                    if (uploadType === 'document') {
                      setDocumentForm({...documentForm, category: e.target.value});
                    } else {
                      setLinkForm({...linkForm, category: e.target.value});
                    }
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Tags (comma-separated)</Label>
                <Input
                  type="text"
                  value={uploadType === 'document' ? documentForm.tags : linkForm.tags}
                  onChange={(e) => {
                    if (uploadType === 'document') {
                      setDocumentForm({...documentForm, tags: e.target.value});
                    } else {
                      setLinkForm({...linkForm, tags: e.target.value});
                    }
                  }}
                  placeholder="e.g., AI, tool, documentation"
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="button" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" $primary>
                  {uploadType === 'document' ? 'Upload Document' : 'Add Link'}
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </HubContainer>
  );
}

export default DataBank;