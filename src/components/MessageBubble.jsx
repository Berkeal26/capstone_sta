import React from 'react';

// Visual components for enhanced itinerary display
function ItineraryCard({ day, activities, weather, time }) {
  // Helper function to create Google Maps link
  const createMapLink = (location) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  };

  // Helper function to extract location from activity title
  const extractLocation = (title) => {
    // Common patterns for extracting location names
    const patterns = [
      /Visit (.+?)(?:\s\(|$)/,
      /Explore (.+?)(?:\s|$)/,
      /Discover (.+?)(?:\s|$)/,
      /Enjoy (.+?)(?:\s|$)/,
      /Experience (.+?)(?:\s|$)/,
      /Shop and dine in (.+?)(?:\s|$)/
    ];
    
    for (const pattern of patterns) {
      const match = title.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return null;
  };

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '16px',
      margin: '12px 0',
      backgroundColor: '#f8fafc',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#004C8C',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          marginRight: '12px'
        }}>
          {day}
        </div>
        <div>
          <h4 style={{ margin: '0', color: '#004C8C', fontSize: '16px' }}>Day {day}</h4>
          {time && <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>⏰ {time}</p>}
          {weather && <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>🌤️ {weather}</p>}
        </div>
      </div>
      <div>
        {activities.map((activity, index) => {
          const location = extractLocation(activity.title);
          const mapLink = location ? createMapLink(location) : null;
          
          return (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '8px',
              padding: '8px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#004C8C',
                marginRight: '12px',
                marginTop: '6px',
                flexShrink: 0
              }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                  {mapLink ? (
                    <a 
                      href={mapLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        color: '#004C8C',
                        textDecoration: 'underline',
                        fontWeight: 'bold'
                      }}
                    >
                      {activity.title}
                    </a>
                  ) : (
                    activity.title
                  )}
                </div>
                {activity.description && (
                  <div style={{ fontSize: '14px', color: '#64748b' }}>{activity.description}</div>
                )}
                {activity.duration && (
                  <div style={{ fontSize: '12px', color: '#004C8C', marginTop: '4px' }}>
                    ⏱️ {activity.duration}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LocationCard({ name, description, image, rating, price }) {
  // Helper function to create Google Maps link
  const createMapLink = (location) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  };

  const mapLink = createMapLink(name);

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '16px',
      margin: '8px 0',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {image && (
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '8px',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            fontSize: '12px',
            flexShrink: 0
          }}>
            📍
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '4px' }}>
            <h4 style={{ margin: '0', color: '#004C8C', fontSize: '16px' }}>
              <a 
                href={mapLink} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#004C8C',
                  textDecoration: 'underline',
                  fontWeight: 'bold'
                }}
              >
                {name}
              </a>
            </h4>
          </div>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>{description}</p>
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
            {rating && <span style={{ color: '#f59e0b' }}>⭐ {rating}</span>}
            {price && <span style={{ color: '#004C8C' }}>💰 {price}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to render text with map links
function renderTextWithMapLinks(text) {
  // Common attraction and location patterns
  const locationPatterns = [
    /(Senso-ji Temple)/g,
    /(Tsukiji Outer Market)/g,
    /(Harajuku district)/g,
    /(Shibuya Crossing)/g,
    /(Meiji Shrine)/g,
    /(Yoyogi Park)/g,
    /(Asakusa district)/g,
    /(Tokyo Skytree)/g,
    /(Akihabara)/g,
    /(Ginza)/g,
    /(Imperial Palace)/g,
    /(East Gardens)/g,
    /(Roppongi area)/g,
    /(Eiffel Tower)/g,
    /(Louvre Museum)/g,
    /(Notre-Dame)/g,
    /(Champs-Élysées)/g,
    /(Times Square)/g,
    /(Central Park)/g,
    /(Statue of Liberty)/g,
    /(Brooklyn Bridge)/g,
    /(Golden Gate Bridge)/g,
    /(Alcatraz Island)/g,
    /(Fisherman's Wharf)/g,
    /(Big Ben)/g,
    /(London Eye)/g,
    /(Tower Bridge)/g,
    /(Buckingham Palace)/g,
    /(Colosseum)/g,
    /(Vatican City)/g,
    /(Trevi Fountain)/g,
    /(Spanish Steps)/g
  ];

  let result = text;
  
  locationPatterns.forEach(pattern => {
    result = result.replace(pattern, (match, location) => {
      const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
      return `<a href="${mapLink}" target="_blank" rel="noopener noreferrer" style="color: #004C8C; text-decoration: underline; font-weight: bold;">${location}</a>`;
    });
  });

  return <span dangerouslySetInnerHTML={{ __html: result }} />;
}

// Render itinerary visual components
function renderItineraryVisual(content) {
  const itineraryMatch = content.match(/```itinerary\n([\s\S]*?)\n```/);
  if (!itineraryMatch) return renderMarkdown(content);
  
  try {
    const itineraryData = JSON.parse(itineraryMatch[1]);
    return (
      <div style={{ margin: '16px 0' }}>
        {itineraryData.days?.map((day, index) => (
          <ItineraryCard
            key={index}
            day={day.day || index + 1}
            activities={day.activities || []}
            weather={day.weather}
            time={day.time}
          />
        ))}
      </div>
    );
  } catch (e) {
    return renderMarkdown(content);
  }
}

// Render location visual components
function renderLocationVisual(content) {
  const locationMatch = content.match(/```location\n([\s\S]*?)\n```/);
  if (!locationMatch) return renderMarkdown(content);
  
  try {
    const locationData = JSON.parse(locationMatch[1]);
    return (
      <div style={{ margin: '16px 0' }}>
        {Array.isArray(locationData) ? (
          locationData.map((location, index) => (
            <LocationCard
              key={index}
              name={location.name}
              description={location.description}
              image={location.image}
              rating={location.rating}
              price={location.price}
            />
          ))
        ) : (
          <LocationCard
            name={locationData.name}
            description={locationData.description}
            image={locationData.image}
            rating={locationData.rating}
            price={locationData.price}
          />
        )}
      </div>
    );
  } catch (e) {
    return renderMarkdown(content);
  }
}

// Enhanced markdown renderer with visual components for travel assistant responses
function renderMarkdown(content) {
  if (!content) return '';
  
  // Check for special visual patterns first
  if (content.includes('```itinerary')) {
    return renderItineraryVisual(content);
  }
  
  if (content.includes('```location')) {
    return renderLocationVisual(content);
  }
  
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
      elements.push(<div key={i} style={{ margin: '4px 0', paddingLeft: '16px' }}>• {renderTextWithMapLinks(line.substring(2))}</div>);
    }
    // Handle numbered lists
    else if (/^\d+\.\s/.test(line)) {
      if (inTable) {
        // Close table first
        elements.push(renderTable(tableRows));
        inTable = false;
        tableRows = [];
      }
      elements.push(<div key={i} style={{ margin: '4px 0', paddingLeft: '16px' }}>{renderTextWithMapLinks(line)}</div>);
    }
    // Handle regular paragraphs
    else if (line) {
      if (inTable) {
        // Close table first
        elements.push(renderTable(tableRows));
        inTable = false;
        tableRows = [];
      }
      elements.push(<div key={i} style={{ margin: '6px 0', lineHeight: '1.5' }}>{renderTextWithMapLinks(line)}</div>);
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
    <div key={`table-${rows.length}-${rows[0]?.length || 0}`} style={{ margin: '8px 0', overflowX: 'auto' }}>
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