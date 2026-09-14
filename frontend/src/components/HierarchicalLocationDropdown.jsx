import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Sparkles,
  Globe,
  ChevronRight,
  Check,
  Building,
  Navigation,
  Compass,
  Search
} from 'lucide-react';
import {
  SPECIAL_LOCATION_SCOPES,
  HIERARCHICAL_REGIONS,
  filterHierarchicalLocations
} from '../data/resdexSuggestions';

/**
 * HierarchicalLocationDropdown
 * Renders an enterprise searchable autocomplete suggestion dropdown directly underneath
 * the candidate location input, organizing locations into:
 * India → Region → State → City, plus pinned special scopes.
 */
export default function HierarchicalLocationDropdown({
  searchQuery = '',
  onSelectLocation,
  onClose,
  selectedLocations = []
}) {
  const [activeTab, setActiveTab] = useState('all');

  // Filtered list when user is typing
  const searchResults = useMemo(() => {
    return filterHierarchicalLocations(searchQuery);
  }, [searchQuery]);

  // Is the user actively searching or in default browsing mode?
  const isSearching = Boolean(searchQuery && searchQuery.trim().length > 0);

  // Helper to highlight matching text in search results
  const highlightMatch = (text, query) => {
    if (!query || !query.trim()) return text;
    const clean = query.trim();
    const regex = new RegExp(`(${clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} style={{ backgroundColor: '#fef08a', color: '#854d0e', fontWeight: 700, borderRadius: '2px', padding: '0 2px' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Check if an item is already selected
  const isSelected = (name) => {
    if (!name) return false;
    if (typeof selectedLocations === 'string') {
      return selectedLocations.toLowerCase().includes(name.toLowerCase());
    }
    if (Array.isArray(selectedLocations)) {
      return selectedLocations.some(loc => 
        (typeof loc === 'string' ? loc : loc.name).toLowerCase() === name.toLowerCase()
      );
    }
    return false;
  };

  return (
    <div
      className="hierarchical-location-dropdown"
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '12px',
        boxShadow: '0 16px 36px -4px rgba(0,0,0,0.16), 0 8px 16px -6px rgba(0,0,0,0.08)',
        zIndex: 100,
        overflow: 'hidden',
        maxHeight: '440px',
        display: 'flex',
        flexDirection: 'column',
        animation: 'resdexDropdownFadeIn 0.15s ease-out'
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP PINNED ROW: Special Scopes Presets                     */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          padding: '10px 14px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Compass size={13} style={{ color: '#0056b3' }} />
            <span>Special Location Scopes</span>
          </span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            {isSearching ? `${searchResults.length} matches found` : 'Quick 1-Click Selection'}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {SPECIAL_LOCATION_SCOPES.map((scope) => {
            const selected = isSelected(scope.name);
            return (
              <button
                key={scope.id}
                type="button"
                onClick={() => {
                  onSelectLocation(scope.name, scope);
                  if (onClose) onClose();
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  border: selected ? '1px solid #0056b3' : '1px solid #cbd5e1',
                  backgroundColor: selected ? '#eff6ff' : '#ffffff',
                  color: selected ? '#0056b3' : '#334155',
                  fontSize: '12px',
                  fontWeight: selected ? 700 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (!selected) {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#94a3b8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected) {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }
                }}
                title={scope.description}
              >
                <span>{scope.icon}</span>
                <span>{scope.name}</span>
                {selected && <Check size={12} style={{ color: '#0056b3' }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. BROWSING TABS (Shown when not actively searching)         */}
      {/* ------------------------------------------------------------- */}
      {!isSearching && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f1f5f9',
            padding: '4px 8px 0 8px',
            borderBottom: '1px solid #e2e8f0',
            overflowX: 'auto',
            gap: '4px'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderBottom: activeTab === 'all' ? '2.5px solid #0056b3' : '2.5px solid transparent',
              background: 'none',
              color: activeTab === 'all' ? '#0056b3' : '#64748b',
              fontSize: '12px',
              fontWeight: activeTab === 'all' ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            All Regions & Hubs
          </button>
          {HIERARCHICAL_REGIONS.map((reg) => (
            <button
              key={reg.id}
              type="button"
              onClick={() => setActiveTab(reg.id)}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderBottom: activeTab === reg.id ? '2.5px solid #0056b3' : '2.5px solid transparent',
                background: 'none',
                color: activeTab === reg.id ? '#0056b3' : '#64748b',
                fontSize: '12px',
                fontWeight: activeTab === reg.id ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{reg.icon}</span>
              <span>{reg.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. SCROLLABLE CONTENT BODY                                    */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: '320px',
          padding: isSearching ? '6px 0' : '8px 0'
        }}
      >
        {/* A. SEARCH MODE (When user types query) */}
        {isSearching ? (
          <div>
            {searchResults.length > 0 ? (
              searchResults.map((item, idx) => {
                const selected = isSelected(item.name);
                const isScope = item.type === 'scope';
                const isState = item.type === 'state';

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      onSelectLocation(item.name, item);
                      if (onClose) onClose();
                    }}
                    style={{
                      padding: '10px 16px',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      backgroundColor: selected ? '#eff6ff' : '#ffffff',
                      transition: 'background-color 0.12s'
                    }}
                    onMouseEnter={(e) => {
                      if (!selected) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!selected) e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px' }}>{item.icon || '📍'}</span>
                        <span style={{ fontSize: '13px', fontWeight: isScope ? 700 : 600, color: selected ? '#0056b3' : '#0f172a' }}>
                          {highlightMatch(item.name, searchQuery)}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: isScope ? '#fef3c7' : isState ? '#e0f2fe' : '#f1f5f9',
                            color: isScope ? '#92400e' : isState ? '#0369a1' : '#475569'
                          }}
                        >
                          {item.badge}
                        </span>
                      </div>

                      {/* Hierarchical Breadcrumb Trail */}
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '3px', paddingLeft: '22px' }}>
                        <span>Hierarchy:</span>
                        <strong style={{ color: '#475569', fontWeight: 600 }}>{item.breadcrumb}</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{item.count}</span>
                      {selected ? (
                        <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center' }}>
                          <Check size={15} />
                        </span>
                      ) : (
                        <ChevronRight size={14} style={{ color: '#cbd5e1' }} />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: '#64748b' }}>
                <Search size={22} style={{ color: '#cbd5e1', margin: '0 auto 6px', display: 'block' }} />
                <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  No locations matching "{searchQuery}"
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                  Try typing a city name, state (e.g. Punjab, Maharashtra), region (North India), or special scope.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* B. BROWSING MODE (Categorized by Region → State → City) */
          <div>
            {HIERARCHICAL_REGIONS.filter(reg => activeTab === 'all' || activeTab === reg.id).map((reg) => (
              <div key={reg.id} style={{ marginBottom: '14px' }}>
                {/* Region Header with direct selection button */}
                <div
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px' }}>{reg.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      {reg.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectLocation(reg.scopeName, { type: 'scope', name: reg.scopeName, region: reg.name });
                      if (onClose) onClose();
                    }}
                    style={{
                      border: 'none',
                      background: '#eff6ff',
                      color: '#0056b3',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                  >
                    Select {reg.scopeName}
                  </button>
                </div>

                {/* States under this Region */}
                <div style={{ padding: '6px 16px' }}>
                  {reg.states.map((st, sIdx) => (
                    <div key={sIdx} style={{ marginBottom: '10px' }}>
                      {/* State row with "Select All" button */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '4px 0',
                          borderBottom: '1px dashed #e2e8f0',
                          marginBottom: '6px'
                        }}
                      >
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                          {st.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const stName = `${st.name} (All cities)`;
                            onSelectLocation(stName, { type: 'state', name: stName, state: st.name, region: reg.name });
                            if (onClose) onClose();
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#0056b3',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          Select All {st.name}
                        </button>
                      </div>

                      {/* Cities in this State */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {st.cities.map((city, cIdx) => {
                          const selected = isSelected(city.name);
                          return (
                            <button
                              key={cIdx}
                              type="button"
                              onClick={() => {
                                onSelectLocation(city.name, {
                                  type: 'city',
                                  name: city.name,
                                  state: st.name,
                                  region: reg.name,
                                  country: reg.id === 'international' ? 'International' : 'India'
                                });
                                if (onClose) onClose();
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                border: selected ? '1px solid #0056b3' : '1px solid #e2e8f0',
                                backgroundColor: selected ? '#eff6ff' : '#f8fafc',
                                color: selected ? '#0056b3' : '#1e293b',
                                fontSize: '11.5px',
                                fontWeight: selected ? 700 : 500,
                                cursor: 'pointer',
                                transition: 'all 0.1s'
                              }}
                              onMouseEnter={(e) => {
                                if (!selected) {
                                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                                  e.currentTarget.style.borderColor = '#cbd5e1';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!selected) {
                                  e.currentTarget.style.backgroundColor = '#f8fafc';
                                  e.currentTarget.style.borderColor = '#e2e8f0';
                                }
                              }}
                              title={`${city.name} (${st.name}, ${reg.name}) - ${city.count}`}
                            >
                              <span>{city.name}</span>
                              {selected && <Check size={11} style={{ color: '#0056b3' }} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. FOOTER NOTE                                                */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          padding: '6px 14px',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          fontSize: '11px',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span>
          💡 <em>Tip: You can select multiple cities, entire states, or regional scopes.</em>
        </span>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#0056b3',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Close [Esc]
        </button>
      </div>
    </div>
  );
}
