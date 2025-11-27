import React, { createContext, useContext, useReducer, useCallback } from 'react';

const PipelineContext = createContext();

// Action types
const ACTIONS = {
  ADD_INPUT: 'ADD_INPUT',
  REMOVE_INPUT: 'REMOVE_INPUT',
  UPDATE_INPUT: 'UPDATE_INPUT',
  REORDER_INPUTS: 'REORDER_INPUTS',
  ADD_TOOL: 'ADD_TOOL',
  REMOVE_TOOL: 'REMOVE_TOOL',
  UPDATE_TOOL: 'UPDATE_TOOL',
  ADD_OUTPUT: 'ADD_OUTPUT',
  REMOVE_OUTPUT: 'REMOVE_OUTPUT',
  UPDATE_OUTPUT: 'UPDATE_OUTPUT',
  SET_METADATA: 'SET_METADATA',
  LOAD_PIPELINE: 'LOAD_PIPELINE',
  RESET_PIPELINE: 'RESET_PIPELINE',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB'
};

// Initial state
const initialState = {
  metadata: {
    name: 'Untitled Pipeline',
    description: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: '1.0.0'
  },
  inputs: [],
  tools: [],
  outputs: [],
  activeTab: 'inputs'
};

// Reducer function
function pipelineReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_INPUT:
      return {
        ...state,
        inputs: [...state.inputs, { ...action.payload, id: Date.now().toString() }],
        metadata: { ...state.metadata, updatedAt: new Date().toISOString() }
      };

    case ACTIONS.REMOVE_INPUT:
      return {
        ...state,
        inputs: state.inputs.filter(input => input.id !== action.payload),
        metadata: { ...state.metadata, updatedAt: new Date().toISOString() }
      };

    case ACTIONS.UPDATE_INPUT:
      return {
        ...state,
        inputs: state.inputs.map(input =>
          input.id === action.payload.id ? { ...input, ...action.payload.updates } : input
        ),
        metadata: { ...state.metadata, updatedAt: new Date().toISOString() }
      };

    case ACTIONS.REORDER_INPUTS:
      return {
        ...state,
        inputs: action.payload,
        metadata: { ...state.metadata, updatedAt: new Date().toISOString() }
      };

    case ACTIONS.ADD_TOOL:
      return {
        ...state,
        tools: [...state.tools, { ...action.payload, id: Date.now().toString() }],
        metadata: { ...state.metadata, updatedAt: new Date().toISOString() }
      };

    case ACTIONS.REMOVE_TOOL:
      return {
        ...state,
        tools: state.tools.filter(tool => tool.id !== action.payload),
        metadata: { ...state.metadata, updatedAt: new Date().toISOString() }
      };

    case ACTIONS.UPDATE_TOOL:
      return {
        ...state,
        tools: state.tools.map(tool =>
          tool.id === action.payload.id ? { ...tool, ...action.payload.updates } : tool
        ),
        metadata: { ...state.metadata, updatedAt: new Date().toISOString() }
      };

    case ACTIONS.ADD_OUTPUT:
      return {
        ...state,
        outputs: [...state.outputs, { ...action.payload, id: Date.now().toString() }],
        metadata: { ...state.metadata, updatedAt: new Date().toISOString() }
      };

    case ACTIONS.REMOVE_OUTPUT:
      return {
        ...state,
        outputs: state.outputs.filter(output => output.id !== action.payload),
        metadata: { ...state.metadata, updatedAt: new Date().toISOString() }
      };

    case ACTIONS.UPDATE_OUTPUT:
      return {
        ...state,
        outputs: state.outputs.map(output =>
          output.id === action.payload.id ? { ...output, ...action.payload.updates } : output
        ),
        metadata: { ...state.metadata, updatedAt: new Date().toISOString() }
      };

    case ACTIONS.SET_METADATA:
      return {
        ...state,
        metadata: { ...state.metadata, ...action.payload, updatedAt: new Date().toISOString() }
      };

    case ACTIONS.LOAD_PIPELINE:
      return {
        ...action.payload,
        activeTab: state.activeTab
      };

    case ACTIONS.RESET_PIPELINE:
      return {
        ...initialState,
        metadata: {
          ...initialState.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

    case ACTIONS.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload
      };

    default:
      return state;
  }
}

// Provider component
export function PipelineProvider({ children }) {
  const [state, dispatch] = useReducer(pipelineReducer, initialState);

  // Action creators wrapped in useCallback for performance
  const addInput = useCallback((input) => {
    dispatch({ type: ACTIONS.ADD_INPUT, payload: input });
  }, []);

  const removeInput = useCallback((id) => {
    dispatch({ type: ACTIONS.REMOVE_INPUT, payload: id });
  }, []);

  const updateInput = useCallback((id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_INPUT, payload: { id, updates } });
  }, []);

  const reorderInputs = useCallback((inputs) => {
    dispatch({ type: ACTIONS.REORDER_INPUTS, payload: inputs });
  }, []);

  const addTool = useCallback((tool) => {
    dispatch({ type: ACTIONS.ADD_TOOL, payload: tool });
  }, []);

  const removeTool = useCallback((id) => {
    dispatch({ type: ACTIONS.REMOVE_TOOL, payload: id });
  }, []);

  const updateTool = useCallback((id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_TOOL, payload: { id, updates } });
  }, []);

  const addOutput = useCallback((output) => {
    dispatch({ type: ACTIONS.ADD_OUTPUT, payload: output });
  }, []);

  const removeOutput = useCallback((id) => {
    dispatch({ type: ACTIONS.REMOVE_OUTPUT, payload: id });
  }, []);

  const updateOutput = useCallback((id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_OUTPUT, payload: { id, updates } });
  }, []);

  const setMetadata = useCallback((metadata) => {
    dispatch({ type: ACTIONS.SET_METADATA, payload: metadata });
  }, []);

  const loadPipeline = useCallback((pipeline) => {
    dispatch({ type: ACTIONS.LOAD_PIPELINE, payload: pipeline });
  }, []);

  const resetPipeline = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_PIPELINE });
  }, []);

  const setActiveTab = useCallback((tab) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tab });
  }, []);

  // Export pipeline to JSON
  const exportPipeline = useCallback(() => {
    const { activeTab, ...exportData } = state;
    return exportData;
  }, [state]);

  // Validation helpers
  const isValid = useCallback(() => {
    return state.inputs.length > 0 && state.outputs.length > 0;
  }, [state.inputs, state.outputs]);

  const getInputCount = useCallback(() => state.inputs.length, [state.inputs]);
  const getToolCount = useCallback(() => state.tools.length, [state.tools]);
  const getOutputCount = useCallback(() => state.outputs.length, [state.outputs]);

  const value = {
    // State
    pipeline: state,
    inputs: state.inputs,
    tools: state.tools,
    outputs: state.outputs,
    metadata: state.metadata,
    activeTab: state.activeTab,

    // Actions
    addInput,
    removeInput,
    updateInput,
    reorderInputs,
    addTool,
    removeTool,
    updateTool,
    addOutput,
    removeOutput,
    updateOutput,
    setMetadata,
    loadPipeline,
    resetPipeline,
    setActiveTab,

    // Utilities
    exportPipeline,
    isValid,
    getInputCount,
    getToolCount,
    getOutputCount
  };

  return (
    <PipelineContext.Provider value={value}>
      {children}
    </PipelineContext.Provider>
  );
}

// Custom hook to use the context
export function usePipeline() {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
}

export default PipelineContext;
