import React from 'react';

// Simple markdown renderer for travel assistant responses
function renderMarkdown(content) {
  if (!content) return '';
  
  // Split content into lines for processing
  const lines = content.split('\n');
  const elements = [];
  let inTable = false;
  let tableRows = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Handle headers
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} style={{ fontSize: '18px', fontWeight: '700', margin: '12px 0 8px 0', color: '#004C8C' }}>{line.substring(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} style={{ fontSize: '16px', fontWeight: '600', margin: '10px 0 6px 0', color: '#004C8C' }}>{line.substring(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} style={{ fontSize: '14px', fontWeight: '600', margin: '8px 0 4px 0', color: '#004C8C' }}>{line.substring(4)}</h3>);
    }
    // Handle tables
    else if (line.includes('|') && line.split('|').length > 2) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      if (cells.length > 0) {
        tableRows.push(cells);
      }
    }
    // Handle list items
    else if (line.startsWith('- ')) {
      if (inTable) {
        // Close table first
        elements.push(renderTable(tableRows));
        inTable = false;
        tableRows = [];
      }
      elements.push(<div key={i} style={{ margin: '4px 0', paddingLeft: '16px' }}>• {line.substring(2)}</div>);
    }
    // Handle numbered lists
    else if (/^\d+\.\s/.test(line)) {
      if (inTable) {
        // Close table first
        elements.push(renderTable(tableRows));
        inTable = false;
        tableRows = [];
      }
      elements.push(<div key={i} style={{ margin: '4px 0', paddingLeft: '16px' }}>{line}</div>);
    }
    // Handle regular paragraphs
    else if (line) {
      if (inTable) {
        // Close table first
        elements.push(renderTable(tableRows));
        inTable = false;
        tableRows = [];
      }
      elements.push(<div key={i} style={{ margin: '6px 0', lineHeight: '1.5' }}>{line}</div>);
    }
    // Handle empty lines
    else {
      if (inTable) {
        // Close table first
        elements.push(renderTable(tableRows));
        inTable = false;
        tableRows = [];
      }
      elements.push(<br key={i} />);
    }
  }
  
  // Close any remaining table
  if (inTable) {
    elements.push(renderTable(tableRows));
  }
  
  return elements;
}

function renderTable(rows) {
  if (rows.length === 0) return null;
  
  return (
    <div key={`table-${Date.now()}`} style={{ margin: '8px 0', overflowX: 'auto' }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        fontSize: '14px',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ 
              backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc',
              borderBottom: rowIndex < rows.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={{ 
                  padding: '8px 12px', 
                  textAlign: cellIndex === 0 ? 'left' : 'left',
                  borderRight: cellIndex < row.length - 1 ? '1px solid var(--border)' : 'none',
                  fontWeight: rowIndex === 0 ? '600' : 'normal',
                  color: rowIndex === 0 ? '#004C8C' : 'inherit'
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MessageBubble({ role, content, timestamp }) {
  const isUser = role === 'user';
  
  return (
    <div className={`message-row ${isUser ? 'message-row-user' : ''}`}>
      {!isUser && (
        <div className="avatar avatar-assistant">
          <img 
            src={process.env.PUBLIC_URL + '/Miles_logo.png'} 
            alt="Miles" 
            style={{ width: '32px', height: '32px' }}
          />
        </div>
      )}
      <div className={`bubble ${isUser ? 'bubble-user' : 'bubble-assistant'}`}>
        {isUser ? content : renderMarkdown(content)}
        {timestamp && <div className="bubble-meta">{timestamp}</div>}
      </div>
    </div>
  );
}