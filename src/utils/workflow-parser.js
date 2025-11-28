/**
 * Workflow Parser Utility
 *
 * Parses workflow markdown content to extract structured step data
 * including inputs, outputs, skills, tools, and deliverables.
 */

/**
 * Extract structured step data from workflow markdown content
 * @param {string} content - Markdown content with step sections
 * @param {array} stepTitles - Array of step titles from workflow metadata
 * @returns {array} Array of structured step objects
 */
export function parseWorkflowSteps(content, stepTitles = []) {
  const steps = [];

  // Try to parse from content if available
  if (content) {
    // Split content by step headers (## Step N: or ### Step N: - support both formats)
    const stepSections = content.split(/\n#{2,3}\s+Step\s+(\d+):/i);

    // First element is the frontmatter/intro, skip it
    for (let i = 1; i < stepSections.length; i += 2) {
      const stepNumber = parseInt(stepSections[i]);
      const stepContent = stepSections[i + 1] || '';

      // Extract title (first line after the step number)
      const lines = stepContent.trim().split('\n');
      const title = lines[0]?.trim() || stepTitles[stepNumber - 1] || `Step ${stepNumber}`;

      // Extract sections from the step content
      const instruction = extractSection(stepContent, 'Instruction');
      const skills = extractListSection(stepContent, 'Skills');
      const tools = extractListSection(stepContent, 'Tools');
      const resources = extractListSection(stepContent, 'Resources');
      const deliverable = extractSection(stepContent, 'Deliverable');

      // Infer inputs and outputs from instruction and deliverable
      const { inputs, outputs } = inferInputsOutputs(instruction, deliverable, stepNumber);

      steps.push({
        step_number: stepNumber,
        title,
        instruction: instruction || 'No instructions provided',
        skills: skills.length > 0 ? skills : ['General'],
        tools: tools.length > 0 ? tools : [],
        resources: resources,
        deliverable: deliverable || 'Complete the step',
        inputs,
        outputs
      });
    }
  }

  // If no steps found from content parsing, fall back to stepTitles
  if (steps.length === 0 && stepTitles && stepTitles.length > 0) {
    stepTitles.forEach((title, index) => {
      const stepNumber = index + 1;
      steps.push({
        step_number: stepNumber,
        title: typeof title === 'string' ? title : `Step ${stepNumber}`,
        instruction: 'No instructions provided',
        skills: ['General'],
        tools: [],
        resources: [],
        deliverable: 'Complete the step',
        inputs: stepNumber > 1 ? [`Step ${stepNumber - 1} output`] : ['Initial input'],
        outputs: [`Step ${stepNumber} result`]
      });
    });
  }

  return steps;
}

/**
 * Extract content from a markdown section
 * @param {string} content - Step content
 * @param {string} sectionName - Name of the section (e.g., "Instruction")
 * @returns {string} Extracted content
 */
function extractSection(content, sectionName) {
  const regex = new RegExp(`\\*\\*${sectionName}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|\\n##|$)`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

/**
 * Extract list items from a markdown section
 * @param {string} content - Step content
 * @param {string} sectionName - Name of the section
 * @returns {array} Array of list items
 */
function extractListSection(content, sectionName) {
  const sectionContent = extractSection(content, sectionName);
  if (!sectionContent) return [];

  // Extract list items (lines starting with - or *)
  const items = sectionContent
    .split('\n')
    .filter(line => line.trim().match(/^[-*]\s+/))
    .map(line => line.trim().replace(/^[-*]\s+/, '').trim())
    .filter(item => item.length > 0);

  // If no list items found, try to extract from links or plain text
  if (items.length === 0 && sectionContent.trim()) {
    // Extract from markdown links [text](url)
    const linkMatches = sectionContent.matchAll(/\[([^\]]+)\]/g);
    for (const match of linkMatches) {
      items.push(match[1].trim());
    }

    // If still empty, split by comma or newline
    if (items.length === 0) {
      return sectionContent.split(/[,\n]/).map(item => item.trim()).filter(item => item.length > 0);
    }
  }

  return items;
}

/**
 * Infer inputs and outputs from instruction and deliverable text
 * @param {string} instruction - Step instruction text
 * @param {string} deliverable - Step deliverable text
 * @param {number} stepNumber - Step number for default values
 * @returns {object} Object with inputs and outputs arrays
 */
function inferInputsOutputs(instruction, deliverable, stepNumber) {
  const inputs = [];
  const outputs = [];

  // Keywords that indicate inputs
  const inputKeywords = [
    'requires', 'needs', 'using', 'with', 'from', 'receives',
    'takes', 'accepts', 'given', 'based on', 'input', 'provide'
  ];

  // Keywords that indicate outputs
  const outputKeywords = [
    'produces', 'creates', 'generates', 'outputs', 'returns',
    'results in', 'provides', 'delivers', 'saves', 'commits'
  ];

  // Extract from instruction
  if (instruction) {
    const instructionLower = instruction.toLowerCase();

    // Look for input patterns
    for (const keyword of inputKeywords) {
      const regex = new RegExp(`${keyword}\\s+([a-z\\s-]+?)(?:[,.]|$)`, 'gi');
      const matches = instructionLower.matchAll(regex);
      for (const match of matches) {
        const input = match[1].trim();
        if (input.length > 0 && input.length < 50) {
          inputs.push(input);
        }
      }
    }

    // Look for output patterns
    for (const keyword of outputKeywords) {
      const regex = new RegExp(`${keyword}\\s+([a-z\\s-]+?)(?:[,.]|$)`, 'gi');
      const matches = instructionLower.matchAll(regex);
      for (const match of matches) {
        const output = match[1].trim();
        if (output.length > 0 && output.length < 50) {
          outputs.push(output);
        }
      }
    }
  }

  // Extract from deliverable
  if (deliverable) {
    // Deliverable typically describes the output
    const deliverableLower = deliverable.toLowerCase();

    // Add deliverable as output if it's concise
    if (deliverable.length < 100) {
      outputs.push(deliverable);
    } else {
      // Extract noun phrases from deliverable
      const nounPhrases = deliverableLower.match(/(?:a|an|the)\s+([a-z\s-]+?)(?:[,.]|$)/gi);
      if (nounPhrases) {
        nounPhrases.forEach(phrase => {
          const cleaned = phrase.replace(/^(a|an|the)\s+/i, '').trim();
          if (cleaned.length > 0 && cleaned.length < 50) {
            outputs.push(cleaned);
          }
        });
      }
    }
  }

  // Remove duplicates and limit to 3 each
  const uniqueInputs = [...new Set(inputs)].slice(0, 3);
  const uniqueOutputs = [...new Set(outputs)].slice(0, 3);

  // Provide defaults if none found
  return {
    inputs: uniqueInputs.length > 0 ? uniqueInputs : [`Step ${stepNumber - 1} output`],
    outputs: uniqueOutputs.length > 0 ? uniqueOutputs : [`Step ${stepNumber} result`]
  };
}

/**
 * Infer data flow connections between steps based on inputs/outputs
 * @param {array} steps - Array of step objects with inputs and outputs
 * @returns {array} Array of connection objects
 */
export function inferStepConnections(steps) {
  const connections = [];

  for (let i = 0; i < steps.length - 1; i++) {
    const currentStep = steps[i];
    const nextStep = steps[i + 1];

    // Find matching outputs -> inputs
    currentStep.outputs.forEach((output, outputIdx) => {
      nextStep.inputs.forEach((input, inputIdx) => {
        // Simple text matching (case insensitive, partial match)
        const outputLower = output.toLowerCase();
        const inputLower = input.toLowerCase();

        if (
          outputLower.includes(inputLower) ||
          inputLower.includes(outputLower) ||
          // Check for common words (3+ chars)
          hasCommonWords(outputLower, inputLower, 3)
        ) {
          connections.push({
            sourceStep: i,
            targetStep: i + 1,
            sourceHandle: outputIdx,
            targetHandle: inputIdx,
            label: output
          });
        }
      });
    });

    // If no specific connections found, create a generic sequential connection
    if (connections.filter(c => c.sourceStep === i).length === 0) {
      connections.push({
        sourceStep: i,
        targetStep: i + 1,
        sourceHandle: 0,
        targetHandle: 0,
        label: 'Sequential',
        type: 'sequential'
      });
    }
  }

  return connections;
}

/**
 * Check if two strings have common words of minimum length
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @param {number} minLength - Minimum word length
 * @returns {boolean} True if common words found
 */
function hasCommonWords(str1, str2, minLength = 3) {
  const words1 = str1.split(/\s+/).filter(w => w.length >= minLength);
  const words2 = str2.split(/\s+/).filter(w => w.length >= minLength);

  return words1.some(w1 => words2.some(w2 => w1 === w2));
}

/**
 * Calculate positions for step nodes in the canvas
 * @param {object} parentPosition - Parent workflow node position {x, y}
 * @param {number} stepCount - Number of steps
 * @returns {array} Array of position objects for each step
 */
export function calculateStepPositions(parentPosition, stepCount) {
  const HORIZONTAL_OFFSET = 50;  // Indent from parent
  const VERTICAL_SPACING = 150;  // Space between steps
  const START_OFFSET = 120;      // Start below parent node

  const positions = [];

  for (let i = 0; i < stepCount; i++) {
    positions.push({
      x: parentPosition.x + HORIZONTAL_OFFSET,
      y: parentPosition.y + START_OFFSET + (i * VERTICAL_SPACING)
    });
  }

  return positions;
}

export default {
  parseWorkflowSteps,
  inferStepConnections,
  calculateStepPositions
};
