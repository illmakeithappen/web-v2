import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import MarkdownRenderer from '../MarkdownRenderer';
import workflowService from '../../services/workflow-service';


const ContentContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;

  ${props => props.$fullscreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    padding: 2rem;
    background: #f4f4f4;
  `}
`;

const MainCard = styled.div`
  background: white;
  margin: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: #f4f4f4;
  border-bottom: 1px solid #e0e0e0;
  padding: 0.5rem 1.5rem;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const BackButton = styled.button`
  background: transparent;
  color: #161616;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: #0f62fe;
  }
`;

const HeaderCenter = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const DotsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StepCount = styled.div`
  color: #525252;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ArrowButton = styled.button`
  background: transparent;
  color: ${props => props.disabled ? '#c6c6c6' : '#0f62fe'};
  border: 1px solid ${props => props.disabled ? '#e0e0e0' : '#0f62fe'};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  border-radius: 4px;
  font-weight: 400;
  padding: 0;

  &:hover:not(:disabled) {
    background: #0f62fe;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const EditToggleButton = styled.button`
  background: ${props => props.$active ? '#0f62fe' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#525252'};
  border: 1px solid ${props => props.$active ? '#0f62fe' : '#e0e0e0'};
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;

  &:hover {
    background: ${props => props.$active ? '#0353e9' : '#f4f4f4'};
  }
`;

const FullscreenButton = styled.button`
  background: transparent;
  color: #525252;
  border: 1px solid #e0e0e0;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;

  &:hover {
    background: #f4f4f4;
    color: #0f62fe;
  }
`;

const FullscreenContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: relative;
  padding: 2rem 6rem;
`;

const FullscreenContent = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
`;

const FullscreenNav = styled.button`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.$side === 'left' ? 'left: 1.5rem;' : 'right: 1.5rem;'}
  background: white;
  border: 2px solid #0f62fe;
  color: #0f62fe;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;

  &:hover:not(:disabled) {
    background: #0f62fe;
    color: white;
    transform: translateY(-50%) scale(1.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-color: #e0e0e0;
    color: #c6c6c6;
  }
`;

const FullscreenExit = styled.button`
  position: fixed;
  top: 2rem;
  left: 2rem;
  background: white;
  border: 2px solid #e0e0e0;
  color: #525252;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #f4f4f4;
    border-color: #0f62fe;
    color: #0f62fe;
  }
`;

const FullscreenHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 0;
  width: 100%;
`;

const FullscreenStepTitle = styled.h1`
  font-size: 1.25rem;
  color: #161616;
  margin: 0 0 1.5rem 0;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
`;

const FullscreenStepCounter = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 1.5rem;
  color: #525252;
  font-size: 1.25rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FullscreenFieldGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FullscreenFieldLabel = styled.h2`
  font-size: 1.125rem;
  color: #161616;
  margin: 0 0 1rem 0;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  text-align: left;
`;

const FullscreenFieldContent = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #161616;
  white-space: normal;
  text-align: justify;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const FullscreenDeliverableContent = styled.div`
  background: #e5f6ff;
  border: 1px solid #78a9ff;
  border-radius: 4px;
  padding: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #161616;
  white-space: normal;
  text-align: justify;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const ProgressIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #525252;
  font-size: 0.875rem;
`;

const ProgressDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$active ? '#0f62fe' : '#e0e0e0'};
`;

const ContentArea = styled.div`
  flex: 1;
  background: white;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e0e0e0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 3rem;
  color: #525252;
`;

const EmptyMessage = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: #161616;
  transform: rotate(-2deg);
  margin: 0;
  line-height: 1.2;
`;

const StepContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
`;

const WorkflowOverview = styled.div`
  background: #f4f4f4;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const OverviewTitle = styled.h2`
  font-size: 1rem;
  color: #161616;
  margin: 0 0 1rem 0;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

const OverviewColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const OverviewLabel = styled.div`
  font-size: 0.875rem;
  color: #525252;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const OverviewList = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
  list-style-type: disc;

  li {
    font-size: 0.875rem;
    color: #161616;
    line-height: 1.6;
    margin-bottom: 0.25rem;
  }
`;

const OverviewEmpty = styled.div`
  font-size: 0.875rem;
  color: #a8a8a8;
  font-style: italic;
`;

const StepTitle = styled.h1`
  font-size: 1.25rem;
  color: #161616;
  margin: 0 0 1rem 0;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const MarkdownSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  color: #161616;
  margin: 0;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const CopyButton = styled.button`
  background: white;
  border: 1px solid #e0e0e0;
  color: #525252;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  &:hover {
    background: #f4f4f4;
    border-color: #0f62fe;
    color: #0f62fe;
  }

  &:active {
    background: #e0e0e0;
  }
`;

const MarkdownContent = styled.div`
  background: transparent;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #161616;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  text-align: justify;

  /* Markdown styling */
  p {
    margin: 0 0 1rem 0;
    text-align: justify;
  }

  code {
    background: #f4f4f4;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'IBM Plex Mono', 'Courier New', monospace;
    font-size: 0.875em;
  }

  pre {
    background: #f4f4f4;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 1rem;
    overflow-x: auto;
    margin: 1rem 0;
  }

  pre code {
    background: none;
    padding: 0;
  }

  ul, ol {
    margin: 0 0 1rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

const DetailsBox = styled.div`
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: #424242;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const DetailItem = styled.div`
  padding: 0.5rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
  }

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #161616;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: 0.5rem;
`;

const DetailContent = styled.span`
  color: #424242;
`;

const NoteContent = styled.span`
  font-style: italic;
  color: #5d4037;
`;

const DeliverableContent = styled.span`
  color: #0353e9;
`;

const UsesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.25rem;
`;

const UsesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
`;

const UsesRowLabel = styled.span`
  font-size: 0.6875rem;
  color: #525252;
  font-weight: 500;
  min-width: 50px;
`;

const UsesTag = styled.span`
  display: inline-block;
  background: #e5f6ff;
  border: 1px solid #78a9ff;
  border-radius: 3px;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  color: #0043ce;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const EditTextarea = styled.textarea`
  width: 100%;
  min-height: 600px;
  padding: 1.5rem;
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  resize: vertical;
  background: white;

  &:focus {
    outline: none;
    border-color: var(--gitthub-black);
  }
`;

const EditableInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1.125rem;
  font-weight: 600;
  color: #161616;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: white;

  &:focus {
    outline: none;
    border-color: #0f62fe;
    background: #f4f4f4;
  }
`;

const EditableTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #161616;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: white;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #0f62fe;
    background: #f4f4f4;
  }
`;

const ThreeColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const GridColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColumnLabel = styled.div`
  font-size: 1.125rem;
  color: #161616;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const BulletList = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
  list-style-type: disc;

  li {
    font-size: 0.875rem;
    color: #161616;
    line-height: 1.5;
    margin-bottom: 0.25rem;
  }
`;

const SaveButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const SaveButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: var(--gitthub-black);
  color: white;
  border: 2px solid var(--gitthub-black);
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--gitthub-gray);
    border-color: var(--gitthub-gray);
  }
`;

const CancelButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: white;
  color: var(--gitthub-black);
  border: 2px solid var(--gitthub-gray);
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--gitthub-light-beige);
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: #da1e28;
  color: white;
  border: 2px solid #da1e28;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: auto;

  &:hover {
    background: #ba1b23;
    border-color: #ba1b23;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  background: #f4f4f4;
  border-top: 1px solid #e0e0e0;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PaginationButton = styled.button`
  background: ${props => props.disabled ? 'transparent' : '#0f62fe'};
  color: ${props => props.disabled ? '#c6c6c6' : 'white'};
  border: 1px solid ${props => props.disabled ? '#e0e0e0' : '#0f62fe'};
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  border-radius: 0;
  font-weight: 400;

  &:hover:not(:disabled) {
    background: #0353e9;
    border-color: #0353e9;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const StepCounter = styled.div`
  color: #525252;
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
`;

// Parse workflow content into clean step structure
function parseWorkflowSteps(content) {
  if (!content) return [];

  const steps = [];
  // Updated regex to handle step titles: ## Step 1: Title or ## Step 1\n
  const stepRegex = /## Step (\d+)(?::\s*([^\n]*))?\s*\n([\s\S]*?)(?=## Step \d+|$)/g;
  let match;

  while ((match = stepRegex.exec(content)) !== null) {
    const stepNumber = match[1];
    const stepTitle = match[2] || `Step ${stepNumber}`;
    const stepContent = match[3];

    // Extract instruction block (between ```text and ```)
    const instructionMatch = stepContent.match(/\*\*Instruction:\*\*\s*```text\s*([\s\S]*?)```/);
    const instruction = instructionMatch ? instructionMatch[1].trim() : '';

    // Extract skills section (between **Skills:** and next section)
    const skillsMatch = stepContent.match(/\*\*Skills:\*\*\s*([\s\S]*?)(?=\*\*(?:Tools|Resources|Deliverable):|$)/);
    const skills = skillsMatch ? skillsMatch[1].trim() : '';

    // Extract tools section (between **Tools:** and next section)
    const toolsMatch = stepContent.match(/\*\*Tools:\*\*\s*([\s\S]*?)(?=\*\*(?:Resources|Deliverable):|$)/);
    const tools = toolsMatch ? toolsMatch[1].trim() : '';

    // Extract resources section (between **Resources:** and next section)
    const resourcesMatch = stepContent.match(/\*\*Resources:\*\*\s*([\s\S]*?)(?=\*\*Deliverable:|$)/);
    const resources = resourcesMatch ? resourcesMatch[1].trim() : '';

    // Extract deliverable (after **Deliverable:** and before ---)
    const deliverableMatch = stepContent.match(/\*\*Deliverable:\*\*\s*_(.*?)_/);
    const deliverable = deliverableMatch ? deliverableMatch[1].trim() : '';

    // Extract note (italic text starting with *Note:)
    const noteMatch = stepContent.match(/\*Note:\s*([^*]+)\*/);
    const note = noteMatch ? noteMatch[1].trim() : '';

    // Extract uses section (between **Uses:** and ---)
    const usesMatch = stepContent.match(/\*\*Uses:\*\*\s*([\s\S]*?)(?=---|$)/);
    const uses = usesMatch ? usesMatch[1].trim() : '';

    steps.push({
      number: stepNumber,
      title: stepTitle,
      instruction,
      skills,
      tools,
      resources,
      deliverable,
      note,
      uses
    });
  }

  return steps;
}

// Parse uses content into tools, skills, and references
function parseUsesContent(uses) {
  if (!uses) return { tools: [], skills: [], references: [] };

  const result = { tools: [], skills: [], references: [] };
  const lines = uses.split('\n');

  for (const line of lines) {
    const trimmed = line.trim().replace(/^-\s*/, '');

    if (trimmed.toLowerCase().startsWith('tools:')) {
      const items = trimmed.substring(6).trim().split(',').map(s => s.trim()).filter(Boolean);
      result.tools.push(...items);
    } else if (trimmed.toLowerCase().startsWith('skills:')) {
      const items = trimmed.substring(7).trim().split(',').map(s => s.trim()).filter(Boolean);
      result.skills.push(...items);
    } else if (trimmed.toLowerCase().startsWith('references:')) {
      const items = trimmed.substring(11).trim().split(',').map(s => s.trim()).filter(Boolean);
      result.references.push(...items);
    }
  }

  return result;
}

export default function WorkflowContent({ workflow, onBack, initialViewMode = 'steps', onDelete }) {
  const [viewMode, setViewMode] = useState(initialViewMode); // 'steps' or 'edit'
  const [editedContent, setEditedContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedInstruction, setCopiedInstruction] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingStep, setIsEditingStep] = useState(false);
  const [editedStep, setEditedStep] = useState(null);

  // Parse steps from workflow content
  const steps = useMemo(() => {
    if (!workflow?.content) return [];
    return parseWorkflowSteps(workflow.content);
  }, [workflow?.content]);

  // ESC key listener to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Helper function to parse text into array of items for bullet points
  const parseTextToItems = (text) => {
    if (!text) return [];
    // Split by newlines, commas, or bullet points
    return text
      .split(/[\n,•-]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  // Copy instruction to clipboard
  const handleCopyInstruction = async () => {
    const currentStep = steps[currentStepIndex];
    if (currentStep?.instruction) {
      try {
        await navigator.clipboard.writeText(currentStep.instruction);
        setCopiedInstruction(true);
        setTimeout(() => setCopiedInstruction(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // Get step names from workflow.steps (frontmatter)
  const stepNames = workflow?.steps || [];

  // Get current step
  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleEditClick = () => {
    // Start editing the current step
    const currentStep = steps[currentStepIndex];
    if (currentStep) {
      setEditedStep({
        ...currentStep
      });
      setIsEditingStep(true);
    }
  };

  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        setIsEditingStep(false);
        setEditedStep(null);
        setHasUnsavedChanges(false);
      }
    } else {
      setIsEditingStep(false);
      setEditedStep(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedStep || !workflow) {
      return;
    }

    try {
      // Call the API to update the step
      await workflowService.updateWorkflowStep({
        workflowId: workflow.workflow_id,
        stepNumber: editedStep.number,
        stepData: {
          title: editedStep.title || '',
          instruction: editedStep.instruction || '',
          skills: editedStep.skills || '',
          tools: editedStep.tools || '',
          resources: editedStep.resources || '',
          deliverable: editedStep.deliverable || ''
        }
      });

      // Update the local steps state with the edited data
      const updatedSteps = steps.map(step =>
        step.number === editedStep.number ? editedStep : step
      );

      // Update the steps in the parent component if needed
      // For now, we'll just update local state
      console.log('Step saved successfully:', editedStep);

      // Reset edit state
      setHasUnsavedChanges(false);
      setIsEditingStep(false);
      setEditedStep(null);

      // Show success message
      alert('Step saved successfully!');

      // Optionally reload the workflow to get fresh data
      // This ensures the preview and other displays are in sync
      window.location.reload();

    } catch (error) {
      console.error('Error saving step:', error);
      alert(`Failed to save step: ${error.message}`);
    }
  };

  const handleStepFieldChange = (field, value) => {
    setEditedStep(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this workflow? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await workflowService.deleteWorkflow(workflow.workflow_id);

      // Call onDelete callback if provided
      if (onDelete) {
        onDelete(workflow.workflow_id);
      }

      // Go back to workflow list
      if (onBack) {
        onBack();
      }
    } catch (error) {
      console.error('Error deleting workflow:', error);
      alert(`Failed to delete workflow: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!workflow) {
    return (
      <ContentContainer>
        <EmptyState>
          <EmptyMessage>This is where your workflow could be displayed</EmptyMessage>
        </EmptyState>
      </ContentContainer>
    );
  }

  // Fullscreen mode - different layout
  if (isFullscreen) {
    return (
      <ContentContainer $fullscreen={isFullscreen}>
        <FullscreenExit onClick={toggleFullscreen}>
          Done
        </FullscreenExit>

        <FullscreenNav
          $side="left"
          onClick={handlePreviousStep}
          disabled={currentStepIndex === 0}
        >
          ←
        </FullscreenNav>

        <FullscreenNav
          $side="right"
          onClick={handleNextStep}
          disabled={currentStepIndex === totalSteps - 1}
        >
          →
        </FullscreenNav>

        <FullscreenStepCounter>
          {currentStepIndex + 1}/{totalSteps}
        </FullscreenStepCounter>

        <FullscreenContainer>
          <FullscreenContent>
            <FullscreenHeader>
              <FullscreenStepTitle>
                {currentStep?.title || `Step ${currentStep?.number}`}
              </FullscreenStepTitle>
            </FullscreenHeader>

            {currentStep?.instruction && (
              <FullscreenFieldGroup>
                <FullscreenFieldLabel>Instruction</FullscreenFieldLabel>
                <FullscreenFieldContent>{currentStep.instruction}</FullscreenFieldContent>
              </FullscreenFieldGroup>
            )}

            {currentStep?.skills && (
              <FullscreenFieldGroup>
                <FullscreenFieldLabel>Skills</FullscreenFieldLabel>
                <FullscreenFieldContent>{currentStep.skills}</FullscreenFieldContent>
              </FullscreenFieldGroup>
            )}

            {currentStep?.tools && (
              <FullscreenFieldGroup>
                <FullscreenFieldLabel>Tools</FullscreenFieldLabel>
                <FullscreenFieldContent>{currentStep.tools}</FullscreenFieldContent>
              </FullscreenFieldGroup>
            )}

            {currentStep?.resources && (
              <FullscreenFieldGroup>
                <FullscreenFieldLabel>Resources</FullscreenFieldLabel>
                <FullscreenFieldContent>{currentStep.resources}</FullscreenFieldContent>
              </FullscreenFieldGroup>
            )}

            {currentStep?.deliverable && (
              <FullscreenFieldGroup>
                <FullscreenFieldLabel>Deliverable</FullscreenFieldLabel>
                <FullscreenDeliverableContent>{currentStep.deliverable}</FullscreenDeliverableContent>
              </FullscreenFieldGroup>
            )}
          </FullscreenContent>
        </FullscreenContainer>
      </ContentContainer>
    );
  }

  // Normal mode - existing layout
  return (
    <ContentContainer>
      <MainCard>
        {/* Header */}
        <Header>
          <HeaderTop>
            {onBack && (
              <BackButton onClick={onBack}>
                ← Back to Workflows
              </BackButton>
            )}
            {viewMode === 'steps' && totalSteps > 0 && (
              <HeaderCenter>
                <StepIndicator>
                  <DotsContainer>
                    {Array.from({ length: totalSteps }).map((_, index) => (
                      <ProgressDot key={index} $active={index === currentStepIndex} />
                    ))}
                  </DotsContainer>
                  <StepCount>
                    {currentStepIndex + 1}/{totalSteps}
                  </StepCount>
                </StepIndicator>
              </HeaderCenter>
            )}
            <ViewToggle>
              {viewMode === 'steps' && totalSteps > 0 && (
                <>
                  <ArrowButton
                    onClick={handlePreviousStep}
                    disabled={currentStepIndex === 0}
                    title="Previous step"
                  >
                    ←
                  </ArrowButton>
                  <ArrowButton
                    onClick={handleNextStep}
                    disabled={currentStepIndex === totalSteps - 1}
                    title="Next step"
                  >
                    →
                  </ArrowButton>
                </>
              )}
              <EditToggleButton
                $active={isEditingStep}
                onClick={isEditingStep ? handleCancelEdit : handleEditClick}
              >
                {isEditingStep ? 'Cancel' : 'Edit'}
              </EditToggleButton>
              <FullscreenButton onClick={toggleFullscreen} title="Enter Fullscreen">
                ⤢
              </FullscreenButton>
            </ViewToggle>
          </HeaderTop>
        </Header>

        {/* Content area */}
        <ContentArea>
          {currentStep ? (
            <StepContainer>
              {/* Workflow Overview - Only show on first step and if skills/tools exist */}
              {currentStepIndex === 0 && (workflow?.skills?.length > 0 || workflow?.tools?.length > 0) && (
                <WorkflowOverview>
                  <OverviewTitle>What You'll Learn & Build</OverviewTitle>
                  <OverviewGrid>
                    {workflow?.skills?.length > 0 && (
                      <OverviewColumn>
                        <OverviewLabel>Proposed Skills to Create</OverviewLabel>
                        <OverviewList>
                          {workflow.skills.map((skill, idx) => (
                            <li key={idx}>{skill}</li>
                          ))}
                        </OverviewList>
                      </OverviewColumn>
                    )}
                    {workflow?.tools?.length > 0 && (
                      <OverviewColumn>
                        <OverviewLabel>Tools Used</OverviewLabel>
                        <OverviewList>
                          {workflow.tools.map((tool, idx) => (
                            <li key={idx}>{tool}</li>
                          ))}
                        </OverviewList>
                      </OverviewColumn>
                    )}
                  </OverviewGrid>
                  {(!workflow?.skills || workflow.skills.length === 0) && (!workflow?.tools || workflow.tools.length === 0) && (
                    <OverviewEmpty>No workflow metadata available</OverviewEmpty>
                  )}
                </WorkflowOverview>
              )}

              {/* Step Title - Editable */}
              {isEditingStep ? (
                <EditableInput
                  value={editedStep?.title || ''}
                  onChange={(e) => handleStepFieldChange('title', e.target.value)}
                  placeholder="Step title..."
                />
              ) : (
                <StepTitle>{currentStep.title || `Step ${currentStep.number}`}</StepTitle>
              )}

              {/* Instruction Section */}
              {(currentStep.instruction || isEditingStep) && (
                <MarkdownSection>
                  <SectionHeader>
                    <SectionTitle>Instruction</SectionTitle>
                    {!isEditingStep && (
                      <CopyButton onClick={handleCopyInstruction}>
                        {copiedInstruction ? '✓ Copied!' : '📋 Copy'}
                      </CopyButton>
                    )}
                  </SectionHeader>
                  {isEditingStep ? (
                    <EditableTextarea
                      value={editedStep?.instruction || ''}
                      onChange={(e) => handleStepFieldChange('instruction', e.target.value)}
                      placeholder="Instruction text..."
                    />
                  ) : (
                    <MarkdownContent>
                      <MarkdownRenderer content={currentStep.instruction} />
                    </MarkdownContent>
                  )}
                </MarkdownSection>
              )}

              {/* Skills, Tools, Resources - Three Column Grid in Edit Mode */}
              {isEditingStep ? (
                <ThreeColumnGrid>
                  <GridColumn>
                    <ColumnLabel>Skills</ColumnLabel>
                    <BulletList>
                      {parseTextToItems(editedStep?.skills || '').map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                      {parseTextToItems(editedStep?.skills || '').length === 0 && (
                        <li style={{ color: '#a8a8a8' }}>Enter skills (comma or newline separated)</li>
                      )}
                    </BulletList>
                    <EditableTextarea
                      value={editedStep?.skills || ''}
                      onChange={(e) => handleStepFieldChange('skills', e.target.value)}
                      placeholder="Enter skills (comma or newline separated)"
                      style={{ minHeight: '42px', maxHeight: '80px', marginTop: '0.5rem' }}
                      rows={1}
                    />
                  </GridColumn>

                  <GridColumn>
                    <ColumnLabel>Tools</ColumnLabel>
                    <BulletList>
                      {parseTextToItems(editedStep?.tools || '').map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                      {parseTextToItems(editedStep?.tools || '').length === 0 && (
                        <li style={{ color: '#a8a8a8' }}>Enter tools (comma or newline separated)</li>
                      )}
                    </BulletList>
                    <EditableTextarea
                      value={editedStep?.tools || ''}
                      onChange={(e) => handleStepFieldChange('tools', e.target.value)}
                      placeholder="Enter tools (comma or newline separated)"
                      style={{ minHeight: '42px', maxHeight: '80px', marginTop: '0.5rem' }}
                      rows={1}
                    />
                  </GridColumn>

                  <GridColumn>
                    <ColumnLabel>Resources</ColumnLabel>
                    <BulletList>
                      {parseTextToItems(editedStep?.resources || '').map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                      {parseTextToItems(editedStep?.resources || '').length === 0 && (
                        <li style={{ color: '#a8a8a8' }}>Enter resources (comma or newline separated)</li>
                      )}
                    </BulletList>
                    <EditableTextarea
                      value={editedStep?.resources || ''}
                      onChange={(e) => handleStepFieldChange('resources', e.target.value)}
                      placeholder="Enter resources (comma or newline separated)"
                      style={{ minHeight: '42px', maxHeight: '80px', marginTop: '0.5rem' }}
                      rows={1}
                    />
                  </GridColumn>
                </ThreeColumnGrid>
              ) : (
                <>
                  {/* Skills Section - View Mode */}
                  {currentStep.skills && (
                    <MarkdownSection>
                      <SectionHeader>
                        <SectionTitle>Skills</SectionTitle>
                      </SectionHeader>
                      <MarkdownContent>
                        <MarkdownRenderer content={currentStep.skills} />
                      </MarkdownContent>
                    </MarkdownSection>
                  )}

                  {/* Tools Section - View Mode */}
                  {currentStep.tools && (
                    <MarkdownSection>
                      <SectionHeader>
                        <SectionTitle>Tools</SectionTitle>
                      </SectionHeader>
                      <MarkdownContent>
                        <MarkdownRenderer content={currentStep.tools} />
                      </MarkdownContent>
                    </MarkdownSection>
                  )}

                  {/* Resources Section - View Mode */}
                  {currentStep.resources && (
                    <MarkdownSection>
                      <SectionHeader>
                        <SectionTitle>Resources</SectionTitle>
                      </SectionHeader>
                      <MarkdownContent>
                        <MarkdownRenderer content={currentStep.resources} />
                      </MarkdownContent>
                    </MarkdownSection>
                  )}
                </>
              )}

              {/* Deliverable Section - Edit Mode */}
              {isEditingStep && (
                <MarkdownSection>
                  <SectionHeader>
                    <SectionTitle>Deliverable</SectionTitle>
                  </SectionHeader>
                  <EditableTextarea
                    value={editedStep?.deliverable || ''}
                    onChange={(e) => handleStepFieldChange('deliverable', e.target.value)}
                    placeholder="Deliverable text..."
                    style={{ minHeight: '60px' }}
                  />
                </MarkdownSection>
              )}

              {/* Details Section - Consolidated Note, Deliverable, Uses */}
              {!isEditingStep && (currentStep.note || currentStep.deliverable || currentStep.uses) && (
                <MarkdownSection style={{ marginBottom: '0.75rem' }}>
                  <SectionHeader style={{ marginBottom: '0.5rem' }}>
                    <SectionTitle>Details</SectionTitle>
                  </SectionHeader>
                  <DetailsBox>
                    {currentStep.note && (
                      <DetailItem>
                        <DetailLabel>Note:</DetailLabel>
                        <NoteContent>{currentStep.note}</NoteContent>
                      </DetailItem>
                    )}
                    {currentStep.deliverable && (
                      <DetailItem>
                        <DetailLabel>Deliverable:</DetailLabel>
                        <DeliverableContent>{currentStep.deliverable}</DeliverableContent>
                      </DetailItem>
                    )}
                    {currentStep.uses && (() => {
                      const parsed = parseUsesContent(currentStep.uses);
                      const hasContent = parsed.tools.length > 0 || parsed.skills.length > 0 || parsed.references.length > 0;
                      if (!hasContent) return null;
                      return (
                        <DetailItem>
                          <DetailLabel>Uses:</DetailLabel>
                          <UsesContainer>
                            {parsed.tools.length > 0 && (
                              <UsesRow>
                                <UsesRowLabel>Tools:</UsesRowLabel>
                                {parsed.tools.map((tool, idx) => (
                                  <UsesTag key={`tool-${idx}`}>{tool}</UsesTag>
                                ))}
                              </UsesRow>
                            )}
                            {parsed.skills.length > 0 && (
                              <UsesRow>
                                <UsesRowLabel>Skills:</UsesRowLabel>
                                {parsed.skills.map((skill, idx) => (
                                  <UsesTag key={`skill-${idx}`}>{skill}</UsesTag>
                                ))}
                              </UsesRow>
                            )}
                            {parsed.references.length > 0 && (
                              <UsesRow>
                                <UsesRowLabel>Refs:</UsesRowLabel>
                                {parsed.references.map((ref, idx) => (
                                  <UsesTag key={`ref-${idx}`}>{ref}</UsesTag>
                                ))}
                              </UsesRow>
                            )}
                          </UsesContainer>
                        </DetailItem>
                      );
                    })()}
                  </DetailsBox>
                </MarkdownSection>
              )}

              {/* Save/Cancel buttons when editing */}
              {isEditingStep && (
                <SaveButtonGroup>
                  <SaveButton onClick={handleSaveEdit}>
                    Save Changes
                  </SaveButton>
                  <CancelButton onClick={handleCancelEdit}>
                    Cancel
                  </CancelButton>
                </SaveButtonGroup>
              )}
            </StepContainer>
          ) : (
            <StepContainer>
              <EmptyState>
                <p>No steps found in this workflow</p>
              </EmptyState>
            </StepContainer>
          )}
        </ContentArea>
      </MainCard>
    </ContentContainer>
  );
}
