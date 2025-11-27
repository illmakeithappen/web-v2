import React, { useState, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavigationLayout from '../components/shared/NavigationLayout';
import { carbonColors, carbonSpacing } from '../styles/carbonTheme';
import { useAuth } from '../contexts/AuthContext';
import workflowService from '../services/workflow-service';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Match the catalog container structure
const WorkflowContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${carbonColors.ui01};
  position: relative;
  overflow: hidden;
  border: 1px solid ${carbonColors.ui04};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const WizardHeader = styled.div`
  background: ${carbonColors.ui01};
  border-bottom: 1px solid ${carbonColors.borderSubtle00};
  padding: ${carbonSpacing.spacing05};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WizardTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${carbonColors.text01};
  margin: 0;
  font-family: 'IBM Plex Sans', sans-serif;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing03};
  font-size: 0.75rem;
  color: ${carbonColors.text02};
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing02};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$active ? carbonColors.interactive01 :
                props.$completed ? carbonColors.supportSuccess :
                carbonColors.ui04};
  }
`;

const ContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`;

const WizardContent = styled.div`
  padding: ${carbonSpacing.spacing05};
  width: 100%;
  max-width: 100%;
`;

const WizardStep = styled.div`
  display: ${props => props.$active ? 'block' : 'none'};
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${carbonColors.text01};
  margin-bottom: ${carbonSpacing.spacing03};
  font-family: 'IBM Plex Sans', sans-serif;
`;

const StepDescription = styled.p`
  color: ${carbonColors.text02};
  line-height: 1.5;
  margin-bottom: ${carbonSpacing.spacing06};
  font-size: 0.875rem;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${carbonSpacing.spacing02};
  margin-bottom: ${carbonSpacing.spacing05};
`;

const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${carbonColors.text02};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RequiredIndicator = styled.span`
  color: ${carbonColors.supportError};
  margin-left: 4px;
`;

const Select = styled.select`
  padding: ${carbonSpacing.spacing04};
  border: 1px solid ${carbonColors.ui04};
  background: ${carbonColors.field01};
  font-size: 0.875rem;
  color: ${carbonColors.text01};
  font-family: 'IBM Plex Sans', sans-serif;
  border-radius: 4px;
  transition: all 0.15s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${carbonColors.interactive01};
    background: ${carbonColors.field02};
  }

  option {
    background: ${carbonColors.field01};
    color: ${carbonColors.text01};
  }
`;

const Input = styled.input`
  padding: ${carbonSpacing.spacing04};
  border: 1px solid ${carbonColors.ui04};
  background: ${carbonColors.field01};
  font-size: 0.875rem;
  color: ${carbonColors.text01};
  font-family: 'IBM Plex Sans', sans-serif;
  border-radius: 4px;
  transition: all 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${carbonColors.interactive01};
    background: ${carbonColors.field02};
  }

  &::placeholder {
    color: ${carbonColors.text03};
  }
`;

const TextArea = styled.textarea`
  padding: ${carbonSpacing.spacing04};
  border: 1px solid ${carbonColors.ui04};
  background: ${carbonColors.field01};
  font-size: 0.875rem;
  color: ${carbonColors.text01};
  min-height: ${props => props.$large ? '200px' : '120px'};
  resize: vertical;
  font-family: 'IBM Plex Sans', sans-serif;
  border-radius: 4px;
  transition: all 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${carbonColors.interactive01};
    background: ${carbonColors.field02};
  }

  &::placeholder {
    color: ${carbonColors.text03};
  }
`;

const HelpText = styled.div`
  font-size: 0.75rem;
  color: ${carbonColors.text03};
  margin-top: -${carbonSpacing.spacing02};
`;

const TerminalPanel = styled.div`
  background: ${carbonColors.layer01};
  border: 1px solid ${carbonColors.ui04};
  border-radius: 4px;
  padding: ${carbonSpacing.spacing05};
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  line-height: 1.8;
  color: ${carbonColors.text01};
  min-height: ${props => props.$compact ? 'auto' : '250px'};
  max-height: ${props => props.$compact ? '300px' : '450px'};
  overflow-y: auto;
  margin-bottom: ${carbonSpacing.spacing05};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }
`;

const TerminalLineStyled = styled.div`
  margin-bottom: ${carbonSpacing.spacing03};
  color: ${props => {
    if (props.$type === 'command') return carbonColors.interactive01;
    if (props.$type === 'success') return carbonColors.supportSuccess;
    if (props.$type === 'error') return carbonColors.supportError;
    if (props.$type === 'info') return carbonColors.text02;
    if (props.$type === 'thinking-stream') return carbonColors.text03;
    if (props.$type === 'content-stream') return carbonColors.text01;
    return carbonColors.text01;
  }};

  ${props => (props.$type === 'thinking-stream' || props.$type === 'content-stream') && `
    white-space: pre-wrap;
    word-wrap: break-word;
    font-style: ${props.$type === 'thinking-stream' ? 'italic' : 'normal'};
  `}

  ${props => props.$type === 'command' && `
    &::before {
      content: '$ ';
      color: ${carbonColors.text02};
    }
  `}
`;

// Memoized component to prevent unnecessary re-renders
const TerminalLine = React.memo(({ type, text, children }) => (
  <TerminalLineStyled $type={type}>
    {text || children}
  </TerminalLineStyled>
), (prev, next) => prev.text === next.text && prev.type === next.type && prev.children === next.children);

const ReviewSection = styled.div`
  margin-bottom: ${carbonSpacing.spacing04};
`;

const ReviewLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${carbonColors.text02};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${carbonSpacing.spacing03};
`;

const ReviewValue = styled.div`
  padding: ${carbonSpacing.spacing04};
  background: ${carbonColors.field01};
  border: 1px solid ${carbonColors.ui04};
  border-radius: 4px;
  color: ${carbonColors.text01};
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 250px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }
`;

const WizardFooter = styled.div`
  background: ${carbonColors.ui01};
  border-top: 1px solid ${carbonColors.borderSubtle00};
  padding: ${carbonSpacing.spacing05};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${carbonSpacing.spacing03};
`;

const Button = styled.button`
  padding: ${carbonSpacing.spacing04} ${carbonSpacing.spacing06};
  background: ${props =>
    props.$ghost ? 'transparent' :
    props.$secondary ? carbonColors.ui03 :
    carbonColors.interactive01};
  color: ${props =>
    props.$ghost ? carbonColors.text01 :
    props.$secondary ? carbonColors.text01 :
    'white'};
  border: 1px solid ${props =>
    props.$ghost ? carbonColors.ui04 :
    props.$secondary ? carbonColors.ui04 :
    carbonColors.interactive01};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'IBM Plex Sans', sans-serif;
  border-radius: 0;

  &:hover:not(:disabled) {
    background: ${props =>
      props.$ghost ? carbonColors.hoverUI :
      props.$secondary ? carbonColors.hoverUI :
      carbonColors.hoverPrimary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  padding: ${carbonSpacing.spacing04};
  border-left: 3px solid ${props =>
    props.$type === 'error' ? carbonColors.supportError :
    props.$type === 'success' ? carbonColors.supportSuccess :
    carbonColors.supportWarning
  };
  background: ${props =>
    props.$type === 'error' ? 'rgba(218, 30, 40, 0.1)' :
    props.$type === 'success' ? 'rgba(36, 161, 72, 0.1)' :
    'rgba(247, 223, 147, 0.2)'
  };
  color: ${carbonColors.text01};
  margin-bottom: ${carbonSpacing.spacing05};
  font-size: 0.875rem;
`;

function WorkflowCreation() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState(1); // 1: input, 2: discover/outline, 3: refine, 4: finalize, 5: review
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const [inputs, setInputs] = useState({
    workflowType: 'deploy', // navigate, educate, or deploy
    taskDescription: '',
    context: ''
  });

  const [terminalOutput, setTerminalOutput] = useState([]);
  const [outlineText, setOutlineText] = useState(''); // Store generated outline
  const [refinementFeedback, setRefinementFeedback] = useState(''); // User feedback for refinement
  const [generatedWorkflow, setGeneratedWorkflow] = useState(null);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const terminalRef = useRef(null);

  // Refs for accumulating streaming text (prevents re-renders on every chunk)
  const thinkingBufferRef = useRef('');
  const contentBufferRef = useRef('');
  const updateTimeoutRef = useRef(null);
  const lastThinkingIndexRef = useRef(-1);
  const lastContentIndexRef = useRef(-1);

  // Auto-scroll terminal to bottom when new output arrives
  React.useEffect(() => {
    if (terminalRef.current && isGenerating) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput, isGenerating]);

  // Debounced terminal update - batches updates to reduce re-renders
  const flushTerminalUpdates = useCallback(() => {
    setTerminalOutput(prev => {
      const newOutput = [...prev];

      // Update or add thinking stream
      if (thinkingBufferRef.current) {
        if (lastThinkingIndexRef.current >= 0 && newOutput[lastThinkingIndexRef.current]?.type === 'thinking-stream') {
          newOutput[lastThinkingIndexRef.current] = {
            type: 'thinking-stream',
            text: thinkingBufferRef.current
          };
        } else {
          newOutput.push({
            type: 'thinking-stream',
            text: thinkingBufferRef.current
          });
          lastThinkingIndexRef.current = newOutput.length - 1;
        }
      }

      // Update or add content stream
      if (contentBufferRef.current) {
        if (lastContentIndexRef.current >= 0 && newOutput[lastContentIndexRef.current]?.type === 'content-stream') {
          newOutput[lastContentIndexRef.current] = {
            type: 'content-stream',
            text: contentBufferRef.current
          };
        } else {
          newOutput.push({
            type: 'content-stream',
            text: contentBufferRef.current
          });
          lastContentIndexRef.current = newOutput.length - 1;
        }
      }

      return newOutput;
    });
  }, []);

  // Debounced update - batches rapid updates to 50ms intervals
  const scheduleTerminalUpdate = useCallback(() => {
    clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(flushTerminalUpdates, 50);
  }, [flushTerminalUpdates]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setCurrentStep(1);
    setInputs({
      workflowType: 'deploy',
      taskDescription: '',
      context: ''
    });
    setTerminalOutput([]);
    setGeneratedWorkflow(null);
    setStatusMessage(null);
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!inputs.taskDescription.trim()) {
        setStatusMessage({
          type: 'error',
          text: 'Please provide a workflow title'
        });
        return;
      }
      if (!inputs.context.trim()) {
        setStatusMessage({
          type: 'error',
          text: 'Please describe what you want to achieve (2-3 sentences)'
        });
        return;
      }
      setStatusMessage(null);
      setCurrentStep(2);
      await generateWorkflow();
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep < 3) {
      setCurrentStep(currentStep - 1);
      setStatusMessage(null);
    }
  };

  // Add terminal output helper
  const addTerminalLine = (type, text) => {
    setTerminalOutput(prev => [...prev, { type, text }]);
  };

  // Phase 1: Discovery and outline generation
  const generateWorkflow = async () => {
    setIsGenerating(true);
    setTerminalOutput([
      { type: 'command', text: `generate workflow --task="${inputs.taskDescription.substring(0, 50)}..."` }
    ]);

    try {
      addTerminalLine('info', 'Initializing conversational workflow generator...');
      addTerminalLine('info', 'Analyzing task requirements with extended thinking...');

      let generatedOutline = '';

      // Start discovery (optimized with refs)
      thinkingBufferRef.current = '';
      contentBufferRef.current = '';
      lastThinkingIndexRef.current = -1;
      lastContentIndexRef.current = -1;

      await workflowService.discoverWebSocket(
        {
          workflowType: inputs.workflowType,
          taskDescription: inputs.taskDescription,
          context: inputs.context,
          sessionId
        },
        (event) => {
          if (event.type === 'thinking_start') {
            addTerminalLine('info', '[Extended Thinking]');
            thinkingBufferRef.current = '';
          } else if (event.type === 'thinking' && event.text) {
            // Accumulate in ref and schedule batched update
            thinkingBufferRef.current += event.text;
            scheduleTerminalUpdate();
          } else if (event.type === 'thinking_stop') {
            // Flush final thinking content
            clearTimeout(updateTimeoutRef.current);
            flushTerminalUpdates();
            thinkingBufferRef.current = '';
            addTerminalLine('success', '[Thinking Complete]');
          } else if (event.type === 'content_block_delta' && event.delta?.text) {
            // Accumulate in ref and schedule batched update
            contentBufferRef.current += event.delta.text;
            scheduleTerminalUpdate();
          } else if (event.type === 'questions') {
            addTerminalLine('info', 'Questions identified, using default approach...');
          } else if (event.type === 'error') {
            addTerminalLine('error', `Error: ${event.error}`);
          }
        }
      );

      // Auto-answer questions and generate outline (optimized)
      addTerminalLine('info', 'Generating workflow outline...');
      let outlineThinkingStarted = false;
      contentBufferRef.current = '';
      lastContentIndexRef.current = -1;

      await workflowService.generateOutlineWebSocket(
        {
          answers: 'Please proceed with a standard approach suitable for this task.',
          sessionId
        },
        (event) => {
          if (event.type === 'outline') {
            // Flush any pending content
            clearTimeout(updateTimeoutRef.current);
            flushTerminalUpdates();
            generatedOutline = event.outline;
            addTerminalLine('success', 'Initial outline generated!');
            addTerminalLine('info', '');
            addTerminalLine('info', '→ Review outline and provide feedback, or proceed to finalization');
          } else if (event.type === 'text' && event.text) {
            // Accumulate in ref and schedule batched update
            contentBufferRef.current += event.text;
            scheduleTerminalUpdate();
          } else if (event.type === 'thinking_start') {
            if (!outlineThinkingStarted) {
              addTerminalLine('info', 'Refining workflow structure...');
              outlineThinkingStarted = true;
            }
          } else if (event.type === 'thinking_stop') {
            if (outlineThinkingStarted) {
              addTerminalLine('success', 'Structure refinement complete!');
            }
          } else if (event.type === 'error') {
            addTerminalLine('error', `Error: ${event.error}`);
          }
        }
      );

      // Store outline and move to refinement step
      setOutlineText(generatedOutline);
      setIsGenerating(false);
      setCurrentStep(3); // Move to refinement step

    } catch (error) {
      console.error('Workflow generation error:', error);
      addTerminalLine('error', `Failed to generate workflow: ${error.message}`);
      setIsGenerating(false);
      setStatusMessage({
        type: 'error',
        text: `Failed to generate workflow: ${error.message}`
      });
    }
  };

  // Phase 1 (continued): Refinement loop
  const refineOutline = async () => {
    if (!refinementFeedback.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Please provide feedback to refine the outline'
      });
      return;
    }

    // Clear previous status messages
    setStatusMessage(null);

    // Go back to terminal display (step 2) to show refinement process
    setCurrentStep(2);
    setIsGenerating(true);
    setTerminalOutput([]);

    try {
      addTerminalLine('info', 'Processing refinement feedback...');
      addTerminalLine('info', `Feedback: "${refinementFeedback}"`);
      addTerminalLine('info', '');

      let refinedOutline = '';
      thinkingBufferRef.current = '';
      contentBufferRef.current = '';
      lastThinkingIndexRef.current = -1;
      lastContentIndexRef.current = -1;

      await workflowService.refineWebSocket(
        {
          message: refinementFeedback,
          sessionId
        },
        (event) => {
          if (event.type === 'thinking_start') {
            addTerminalLine('info', '[Extended Thinking]');
            thinkingBufferRef.current = '';
          } else if (event.type === 'thinking' && event.text) {
            // Accumulate in ref and schedule batched update
            thinkingBufferRef.current += event.text;
            scheduleTerminalUpdate();
          } else if (event.type === 'thinking_stop') {
            // Flush final thinking content
            clearTimeout(updateTimeoutRef.current);
            flushTerminalUpdates();
            thinkingBufferRef.current = '';
            addTerminalLine('success', '[Thinking Complete]');
          } else if (event.type === 'outline') {
            // Flush any pending content
            clearTimeout(updateTimeoutRef.current);
            flushTerminalUpdates();
            refinedOutline = event.outline;
            addTerminalLine('success', 'Outline refined!');
            addTerminalLine('info', '');
            addTerminalLine('info', '→ Review the updated outline');
          } else if (event.type === 'content_block_delta' && event.delta?.text) {
            // Accumulate in ref and schedule batched update
            contentBufferRef.current += event.delta.text;
            scheduleTerminalUpdate();
          } else if (event.type === 'error') {
            addTerminalLine('error', `Error: ${event.error}`);
          }
        }
      );

      // Update outline and go back to refinement step
      setOutlineText(refinedOutline);
      setRefinementFeedback(''); // Clear the feedback
      setIsGenerating(false);
      setCurrentStep(3); // Back to refinement step

    } catch (error) {
      console.error('Refinement error:', error);
      addTerminalLine('error', `Failed to refine outline: ${error.message}`);
      setIsGenerating(false);
      setStatusMessage({
        type: 'error',
        text: `Failed to refine outline: ${error.message}`
      });
    }
  };

  // Phase 2: Finalization - Extract structure and expand to detailed workflow
  const finalizeWorkflow = async () => {
    // Move to step 4 to show terminal for finalization
    setCurrentStep(4);
    setIsGenerating(true);
    setTerminalOutput([
      { type: 'command', text: 'finalize workflow' }
    ]);

    try {
      addTerminalLine('info', 'Phase 2: Finalizing workflow...');
      addTerminalLine('info', 'Extracting structure and expanding to detailed steps...');

      let finalMarkdown = '';

      await workflowService.finalizeWebSocket(
        { sessionId },
        (event) => {
          if (event.type === 'status') {
            addTerminalLine('info', event.message);
          } else if (event.type === 'structure') {
            addTerminalLine('success', `Extracted ${event.step_count || 0} modules`);
          } else if (event.type === 'workflow') {
            finalMarkdown = event.workflow;
            addTerminalLine('success', 'Workflow finalized!');
            addTerminalLine('info', '');
            addTerminalLine('info', '→ Parsing workflow into steps...');
          } else if (event.type === 'error') {
            addTerminalLine('error', `Error: ${event.error}`);
          }
        }
      );

      // Parse the markdown into structured workflow
      const parsedWorkflow = parseWorkflowMarkdown(finalMarkdown, inputs);
      setGeneratedWorkflow(parsedWorkflow);

      addTerminalLine('success', `Successfully parsed ${parsedWorkflow.steps.length} workflow steps`);

      setIsGenerating(false);
      setCurrentStep(5); // Move to final review step

    } catch (error) {
      console.error('Finalization error:', error);
      addTerminalLine('error', `Failed to finalize workflow: ${error.message}`);
      setIsGenerating(false);
      setStatusMessage({
        type: 'error',
        text: `Failed to finalize workflow: ${error.message}`
      });
    }
  };

  // Parse markdown workflow into step structure
  const parseWorkflowMarkdown = (markdown, inputs) => {
    const stepRegex = /## Step (\d+)[:\s]*([^\n]+)\n([\s\S]*?)(?=## Step \d+|$)/g;
    const steps = [];
    let match;

    while ((match = stepRegex.exec(markdown)) !== null) {
      const stepNum = match[1];
      const stepName = match[2].trim();
      const stepContent = match[3].trim();

      // Extract instruction (between **Instruction:** and **Deliverable:**)
      const instructionMatch = stepContent.match(/\*\*Instruction:\*\*\s*([\s\S]*?)(?=\*\*Deliverable:|$)/);
      const instruction = instructionMatch ? instructionMatch[1].trim() : stepContent;

      // Extract deliverable
      const deliverableMatch = stepContent.match(/\*\*Deliverable:\*\*\s*_([^_]+)_/);
      const deliverable = deliverableMatch ? deliverableMatch[1].trim() : '';

      steps.push({
        id: parseInt(stepNum),
        name: stepName,
        description: instruction.substring(0, 200) + (instruction.length > 200 ? '...' : ''),
        fullContent: stepContent,
        deliverable
      });
    }

    // If no steps found, create a single step with the full content
    if (steps.length === 0) {
      steps.push({
        id: 1,
        name: 'Complete Workflow',
        description: markdown.substring(0, 500) + (markdown.length > 500 ? '...' : ''),
        fullContent: markdown,
        deliverable: 'Generated workflow document'
      });
    }

    // Extract metadata from markdown
    const timeMatch = markdown.match(/\*\*Target Completion Time:\*\*\s*([^\n]+)/);
    const estimatedTime = timeMatch ? timeMatch[1].trim() : '';

    // Extract title from first heading if present
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    const workflowTitle = titleMatch ? titleMatch[1].trim() : inputs.taskDescription;

    return {
      name: 'Generated Workflow',
      title: workflowTitle,
      description: inputs.taskDescription,
      context: inputs.context,
      estimatedTime,
      steps,
      fullMarkdown: markdown
    };
  };

  const handleSave = async () => {
    try {
      if (!generatedWorkflow) {
        setStatusMessage({
          type: 'error',
          text: 'No workflow to save'
        });
        return;
      }

      setStatusMessage({
        type: 'info',
        text: 'Saving workflow...'
      });

      // Extract step names for frontmatter
      const stepNames = generatedWorkflow.steps.map(step => step.name);

      // Save workflow to vault-website/workflows directory
      const result = await workflowService.saveWorkflow({
        title: generatedWorkflow.title || inputs.taskDescription,
        workflowType: inputs.workflowType,
        markdown: generatedWorkflow.fullMarkdown,
        context: inputs.context,
        description: inputs.taskDescription,
        stepNames: stepNames,
        estimatedTime: generatedWorkflow.estimatedTime || '',
        difficulty: 'intermediate' // Default, could be extracted from markdown if present
      });

      setStatusMessage({
        type: 'success',
        text: `Workflow saved to ${result.filename}`
      });

      setTimeout(() => {
        if (window.confirm(`Workflow saved to vault-website/workflows/${result.filename}\n\nWould you like to view workflows in the Hub?`)) {
          navigate('/hub');
        } else {
          handleReset();
        }
      }, 1500);
    } catch (error) {
      console.error('Error saving workflow:', error);
      setStatusMessage({
        type: 'error',
        text: `Failed to save workflow: ${error.message}`
      });
    }
  };

  return (
    <NavigationLayout
      selectedSection="create-workflow"
      rightPane={
        <WorkflowContainer>
          <WizardHeader>
            <WizardTitle>create workflow</WizardTitle>
            <StepIndicator>
              <Step $active={currentStep === 1} $completed={currentStep > 1}>
                input
              </Step>
              <Step $active={currentStep === 2} $completed={currentStep > 2}>
                discover
              </Step>
              <Step $active={currentStep === 3} $completed={currentStep > 3}>
                refine
              </Step>
              <Step $active={currentStep === 4} $completed={currentStep > 4}>
                finalize
              </Step>
              <Step $active={currentStep === 5} $completed={currentStep > 5}>
                review
              </Step>
            </StepIndicator>
          </WizardHeader>

          <ContentSection>
            <WizardContent>
              {statusMessage && (
                <StatusMessage $type={statusMessage.type}>
                  {statusMessage.text}
                </StatusMessage>
              )}

              {/* Step 1: Input Task and Context */}
              <WizardStep $active={currentStep === 1}>
                <StepTitle>define your workflow</StepTitle>
                <StepDescription>
                  Describe the task you want to accomplish and provide any relevant context.
                  The workflow generator will create a structured workflow based on your input.
                </StepDescription>

                <FormField>
                  <Label htmlFor="workflowType">
                    workflow type
                    <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Select
                    id="workflowType"
                    name="workflowType"
                    value={inputs.workflowType}
                    onChange={handleInputChange}
                  >
                    <option value="deploy">Deploy - Setup and deployment workflows</option>
                    <option value="educate">Educate - Learning and tutorial workflows</option>
                    <option value="navigate">Navigate - Exploration and discovery workflows</option>
                  </Select>
                  <HelpText>
                    Choose the type of workflow you want to create
                  </HelpText>
                </FormField>

                <FormField>
                  <Label htmlFor="taskDescription">
                    workflow title
                    <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Input
                    type="text"
                    id="taskDescription"
                    name="taskDescription"
                    value={inputs.taskDescription}
                    onChange={handleInputChange}
                    placeholder="A short, clear title for your workflow"
                  />
                  <HelpText>
                    Example: "Deploy FastAPI backend to Render" or "Set up PostgreSQL database"
                  </HelpText>
                </FormField>

                <FormField>
                  <Label htmlFor="context">
                    what do you want to achieve?
                    <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <TextArea
                    id="context"
                    name="context"
                    value={inputs.context}
                    onChange={handleInputChange}
                    placeholder="Describe what you want to accomplish in 2-3 sentences. Be specific about your goals, requirements, and any constraints."
                    $large
                  />
                  <HelpText>
                    Include details about your environment, tools you want to use, specific requirements, or any constraints you have
                  </HelpText>
                </FormField>
              </WizardStep>

              {/* Step 2: Generate (Terminal Output) */}
              <WizardStep $active={currentStep === 2}>
                <StepTitle>generating workflow</StepTitle>
                <StepDescription>
                  The workflow generator is analyzing your task and creating a structured workflow.
                  This process uses AI to break down your task into logical steps.
                </StepDescription>

                <TerminalPanel ref={terminalRef}>
                  {terminalOutput.map((line, index) => (
                    <TerminalLine key={index} type={line.type} text={line.text} />
                  ))}
                  {isGenerating && (
                    <TerminalLine type="info">
                      <span style={{ animation: 'blink 1s infinite' }}>▋</span>
                    </TerminalLine>
                  )}
                </TerminalPanel>
              </WizardStep>

              {/* Step 3: Review & Refine Outline */}
              <WizardStep $active={currentStep === 3}>
                <StepTitle>review & refine workflow outline</StepTitle>
                <StepDescription>
                  Review the generated outline below. You can refine it by providing
                  feedback, or proceed to generate the detailed workflow.
                </StepDescription>

                <ReviewSection>
                  <ReviewLabel>generated outline</ReviewLabel>
                  <ReviewValue>{outlineText}</ReviewValue>
                </ReviewSection>

                <FormField>
                  <Label htmlFor="refinementFeedback">
                    refinement feedback (optional)
                  </Label>
                  <TextArea
                    id="refinementFeedback"
                    value={refinementFeedback}
                    onChange={(e) => setRefinementFeedback(e.target.value)}
                    placeholder="Provide feedback to refine the outline, or click 'Generate Detailed Workflow' to proceed..."
                  />
                  <HelpText>
                    Example: "Add a step for testing" or "Focus more on security"
                  </HelpText>
                </FormField>
              </WizardStep>

              {/* Step 4: Finalization (Terminal Display) */}
              <WizardStep $active={currentStep === 4}>
                <StepTitle>generating detailed workflow</StepTitle>
                <StepDescription>
                  Finalizing your workflow with detailed steps and instructions.
                </StepDescription>

                <TerminalPanel ref={terminalRef}>
                  {terminalOutput.map((line, index) => (
                    <TerminalLine key={index} type={line.type} text={line.text} />
                  ))}
                  {isGenerating && (
                    <TerminalLine type="info">
                      <span style={{ animation: 'blink 1s infinite' }}>▋</span>
                    </TerminalLine>
                  )}
                </TerminalPanel>
              </WizardStep>

              {/* Step 5: Review Generated Workflow */}
              <WizardStep $active={currentStep === 5}>
                <StepTitle>review workflow</StepTitle>
                <StepDescription>
                  Review the generated workflow before saving it to your library.
                </StepDescription>

                {generatedWorkflow && (
                  <>
                    <ReviewSection>
                      <ReviewLabel>task description</ReviewLabel>
                      <ReviewValue>{generatedWorkflow.description}</ReviewValue>
                    </ReviewSection>

                    {generatedWorkflow.context && (
                      <ReviewSection>
                        <ReviewLabel>context</ReviewLabel>
                        <ReviewValue>{generatedWorkflow.context}</ReviewValue>
                      </ReviewSection>
                    )}

                    <ReviewSection>
                      <ReviewLabel>workflow steps</ReviewLabel>
                      <TerminalPanel $compact>
                        {generatedWorkflow.steps.map((step, index) => (
                          <div key={step.id} style={{ marginBottom: carbonSpacing.spacing04 }}>
                            <TerminalLine type="command" text={`step ${index + 1}: ${step.name}`} />
                            <TerminalLine type="info" text={step.description} />
                          </div>
                        ))}
                      </TerminalPanel>
                    </ReviewSection>
                  </>
                )}
              </WizardStep>
            </WizardContent>
          </ContentSection>

          <WizardFooter>
            <div>
              {currentStep > 1 && (
                <Button $ghost onClick={handleReset}>
                  start over
                </Button>
              )}
            </div>
            <ButtonGroup>
              {/* Step 1: Input form */}
              {currentStep === 1 && (
                <Button onClick={handleNext}>
                  generate workflow
                </Button>
              )}

              {/* Step 2: Terminal display (discovery + outline generation) - no buttons while generating */}

              {/* Step 3: Review & refine outline */}
              {currentStep === 3 && (
                <>
                  {refinementFeedback.trim() && (
                    <Button $secondary onClick={refineOutline} disabled={isGenerating}>
                      refine outline
                    </Button>
                  )}
                  <Button onClick={finalizeWorkflow} disabled={isGenerating}>
                    generate detailed workflow
                  </Button>
                </>
              )}

              {/* Step 4: Terminal display (finalization) - no buttons while generating */}

              {/* Step 5: Final review */}
              {currentStep === 5 && (
                <>
                  <Button $secondary onClick={() => setCurrentStep(3)}>
                    back to outline
                  </Button>
                  <Button onClick={handleSave}>
                    save workflow
                  </Button>
                </>
              )}
            </ButtonGroup>
          </WizardFooter>
        </WorkflowContainer>
      }
    />
  );
}

export default WorkflowCreation;
