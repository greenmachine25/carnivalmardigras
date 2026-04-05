import React, { useState, useEffect, useMemo } from 'react';

const decks = [
  { deck: 4, name: "Deck 4", venues: [{name: "Family Harbor Lounge", desc: "Exclusive family hangout [cite: 36]"}, {name: "Medical Center", desc: "Medical services"}] },
  { deck: 5, name: "Deck 5", venues: [{name: "Grand Central", desc: "Atrium hub"}, {name: "Main Dining Room", desc: "Included sit-down dining"}] },
  { deck: 6, name: "Deck 6", venues: [{name: "Emeril's Bistro 1396", desc: "Creole cuisine"}, {name: "Fortune Teller Bar", desc: "Cocktails"}, {name: "Punchliner Comedy Club", desc: "Live comedy"}] },
  { deck: 8, name: "Deck 8", venues: [{name: "Havana Pool", desc: "Cuban-themed retreat [cite: 37]"}, {name: "Guy's Pig & Anchor", desc: "BBQ & Brewery"}, {name: "Chibang!", desc: "Mexican/Chinese fusion"}] },
  { deck: 16, name: "Deck 16", venues: [{name: "Big Chicken", desc: "Shaq's fried chicken"}, {name: "Lido Marketplace", desc: "International buffet"}] },
  { deck: 18, name: "Deck 18", venues: [{name: "WaterWorks", desc: "Water slides [cite: 55, 57]"}, {name: "Serenity Retreat", desc: "Adults-only area"}] },
  { deck: 19, name: "Deck 19", venues: [{name: "BOLT", desc: "Rollercoaster [cite: 56, 58]"}, {name: "SportsSquare", desc: "Mini-golf and sports"}] },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('mg-favs') || '[]'));
  // CHANGE THIS TO YOUR LOCAL FILE NAME
  const [pdfUrl, setPdfUrl] = useState('./mardi-gras-deck-plan.pdf');

  useEffect(() => { localStorage.setItem('mg-favs', JSON.stringify(favorites)); }, [favorites]);

  const filteredDecks = useMemo(() => {
    return decks.map(d => ({
      ...d,
      venues: d.venues.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
    })).filter(d => d.venues.length > 0);
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-blue-900 text-white p-4 font-bold text-center shadow-lg">MARDI GRAS NAVIGATOR</header>
      
      <nav className="flex bg-white border-b">
        <button onClick={() => setActiveTab('directory')} className={`flex-1 p-3 ${activeTab === 'directory' ? 'border-b-4 border-blue-600 font-bold' : ''}`}>Directory</button>
        <button onClick={() => setActiveTab('map')} className={`flex-1 p-3 ${activeTab === 'map' ? 'border-b-4 border-blue-600 font-bold' : ''}`}>Map</button>
      </nav>

      <main className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'directory' ? (
          <div className="space-y-4">
            <input 
              className="w-full p-3 rounded-lg border shadow-inner" 
              placeholder="Search (e.g. Sushi, Pool...)" 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            {filteredDecks.map(d => (
              <div key={d.deck} className="bg-white rounded-xl shadow p-4">
                <h2 className="font-black text-blue-800 border-b pb-2 mb-2">{d.name}</h2>
                {d.venues.map(v => (
                  <div key={v.name} className="py-2 flex justify-between">
                    <div>
                      <div className="font-bold">{v.name}</div>
                      <div className="text-xs text-slate-500">{v.desc}</div>
                    </div>
                    <button onClick={() => setFavorites(f => f.includes(v.name) ? f.filter(x => x !== v.name) : [...f, v.name])}>
                      {favorites.includes(v.name) ? '❤️' : '🤍'}
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <iframe src={pdfUrl} className="w-full h-[80vh] rounded-lg border-2" />
        )}
      </main>
    </div>
  );
}
