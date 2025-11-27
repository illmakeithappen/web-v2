import React, { memo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Handle, Position } from 'reactflow';
import { carbonColors, carbonSpacing } from '../../../styles/carbonTheme';

const NodeContainer = styled.div`
  background: ${carbonColors.layer01};
  border: 2px solid ${props => props.$selected ? carbonColors.interactive01 : '#fa4d56'};
  border-radius: 8px;
  padding: ${carbonSpacing.spacing03};
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.15s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing02};
  margin-bottom: ${carbonSpacing.spacing03};
  padding-bottom: ${carbonSpacing.spacing02};
  border-bottom: 1px solid ${carbonColors.ui04};
`;

const NodeIcon = styled.div`
  width: 24px;
  height: 24px;
  background: #fa4d56;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
`;

const NodeTitleInput = styled.input`
  flex: 1;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${carbonColors.text01};
  background: transparent;
  border: none;
  padding: 2px 4px;
  border-radius: 2px;

  &:hover {
    background: ${carbonColors.field01};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    background: ${carbonColors.field01};
  }
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: ${carbonColors.text02};
  cursor: pointer;
  padding: 2px;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.15s ease;

  ${NodeContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    color: ${carbonColors.supportError};
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  max-height: 250px;
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
`;

const Th = styled.th`
  background: ${carbonColors.field01};
  border: 1px solid ${carbonColors.ui04};
  padding: 4px 8px;
  text-align: left;
  font-weight: 600;
  color: ${carbonColors.text01};
  position: relative;
`;

const ThInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  font-weight: 600;
  font-size: 0.75rem;
  color: ${carbonColors.text01};
  padding: 0;

  &:focus {
    outline: none;
    background: ${carbonColors.layer01};
  }
`;

const Td = styled.td`
  border: 1px solid ${carbonColors.ui04};
  padding: 0;
`;

const CellInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  padding: 4px 8px;
  font-size: 0.75rem;
  color: ${carbonColors.text01};

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    outline-offset: -2px;
    background: ${carbonColors.field01};
  }
`;

const TableActions = styled.div`
  display: flex;
  gap: ${carbonSpacing.spacing02};
  margin-top: ${carbonSpacing.spacing02};
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 2px 6px;
  background: ${carbonColors.field01};
  border: 1px solid ${carbonColors.ui04};
  border-radius: 3px;
  color: ${carbonColors.text02};
  cursor: pointer;
  font-size: 0.625rem;
  transition: all 0.15s ease;

  &:hover {
    background: ${carbonColors.hoverUI};
    color: ${carbonColors.text01};
  }
`;

const DeleteColButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 16px;
  height: 16px;
  background: ${carbonColors.supportError};
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  font-size: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s ease;

  ${Th}:hover & {
    opacity: 1;
  }
`;

const DeleteRowButton = styled.button`
  background: transparent;
  border: none;
  color: ${carbonColors.text02};
  cursor: pointer;
  font-size: 0.625rem;
  padding: 0 4px;

  &:hover {
    color: ${carbonColors.supportError};
  }
`;

const handleStyle = {
  background: '#fa4d56',
  width: 10,
  height: 10,
  border: '2px solid white',
};

function TableNode({ data, selected }) {
  // Initialize table data
  const [title, setTitle] = useState(data.title || 'Table');
  const [columns, setColumns] = useState(
    data.columns || ['Column 1', 'Column 2', 'Column 3']
  );
  const [rows, setRows] = useState(
    data.rows || [
      ['', '', ''],
      ['', '', '']
    ]
  );

  // Update parent data when table changes
  const updateData = useCallback((newTitle, newColumns, newRows) => {
    if (data.onDataChange && data.id) {
      data.onDataChange(data.id, {
        title: newTitle,
        columns: newColumns,
        rows: newRows
      });
    }
  }, [data]);

  // Handle cell change
  const handleCellChange = (rowIndex, colIndex, value) => {
    const newRows = rows.map((row, ri) =>
      ri === rowIndex
        ? row.map((cell, ci) => (ci === colIndex ? value : cell))
        : row
    );
    setRows(newRows);
    updateData(title, columns, newRows);
  };

  // Handle header change
  const handleHeaderChange = (colIndex, value) => {
    const newColumns = columns.map((col, i) => (i === colIndex ? value : col));
    setColumns(newColumns);
    updateData(title, newColumns, rows);
  };

  // Handle title change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    updateData(e.target.value, columns, rows);
  };

  // Add row
  const addRow = () => {
    const newRow = new Array(columns.length).fill('');
    const newRows = [...rows, newRow];
    setRows(newRows);
    updateData(title, columns, newRows);
  };

  // Add column
  const addColumn = () => {
    const newColumns = [...columns, `Column ${columns.length + 1}`];
    const newRows = rows.map(row => [...row, '']);
    setColumns(newColumns);
    setRows(newRows);
    updateData(title, newColumns, newRows);
  };

  // Delete row
  const deleteRow = (rowIndex) => {
    if (rows.length <= 1) return;
    const newRows = rows.filter((_, i) => i !== rowIndex);
    setRows(newRows);
    updateData(title, columns, newRows);
  };

  // Delete column
  const deleteColumn = (colIndex) => {
    if (columns.length <= 1) return;
    const newColumns = columns.filter((_, i) => i !== colIndex);
    const newRows = rows.map(row => row.filter((_, i) => i !== colIndex));
    setColumns(newColumns);
    setRows(newRows);
    updateData(title, newColumns, newRows);
  };

  // Handle node delete
  const handleDelete = (e) => {
    e.stopPropagation();
    if (data.onDelete && data.id) {
      data.onDelete(data.id);
    }
  };

  return (
    <NodeContainer $selected={selected}>
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyle}
      />

      <NodeHeader>
        <NodeIcon>T</NodeIcon>
        <NodeTitleInput
          value={title}
          onChange={handleTitleChange}
          placeholder="Table name"
        />
        <DeleteButton onClick={handleDelete} title="Delete node">
          X
        </DeleteButton>
      </NodeHeader>

      <TableWrapper className="nodrag">
        <Table>
          <thead>
            <tr>
              {columns.map((col, colIndex) => (
                <Th key={colIndex}>
                  <ThInput
                    value={col}
                    onChange={(e) => handleHeaderChange(colIndex, e.target.value)}
                  />
                  {columns.length > 1 && (
                    <DeleteColButton
                      onClick={() => deleteColumn(colIndex)}
                      title="Delete column"
                    >
                      X
                    </DeleteColButton>
                  )}
                </Th>
              ))}
              <Th style={{ width: '24px', padding: '4px' }}></Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <Td key={colIndex}>
                    <CellInput
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      placeholder="..."
                    />
                  </Td>
                ))}
                <Td style={{ width: '24px', padding: '0', textAlign: 'center' }}>
                  {rows.length > 1 && (
                    <DeleteRowButton
                      onClick={() => deleteRow(rowIndex)}
                      title="Delete row"
                    >
                      X
                    </DeleteRowButton>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      <TableActions className="nodrag">
        <ActionButton onClick={addRow}>+ Row</ActionButton>
        <ActionButton onClick={addColumn}>+ Column</ActionButton>
      </TableActions>

      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle}
      />
    </NodeContainer>
  );
}

export default memo(TableNode);
