const { useState, useEffect, useMemo } = React;

const decks = [
  { deck: 4, name: "Deck 4", venues: [{name: "Family Harbor Lounge", desc: "Exclusive family hangout with snacks"}, {name: "Medical Center", desc: "Ship hospital"}, {name: "Staterooms", desc: "Cabins"}] },
  { deck: 5, name: "Deck 5", venues: [{name: "Grand Central", desc: "Atrium and entertainment hub"}, {name: "Main Dining Room", desc: "Included sit-down dining"}, {name: "Chef's Table", desc: "VIP culinary experience"}] },
  { deck: 6, name: "Deck 6", venues: [{name: "Casino", desc: "Slots and table games"}, {name: "Emeril's Bistro 1396", desc: "Creole & New Orleans cuisine"}, {name: "Fortune Teller Bar", desc: "Craft cocktails with a magical twist"}, {name: "Brass Magnolia", desc: "New Orleans inspired Jazz bar"}, {name: "Theater", desc: "Main stage productions"}, {name: "Punchliner Comedy Club", desc: "Stand-up comedy"}, {name: "Cherry On Top", desc: "Candy and gifts"}, {name: "Piano Bar 88", desc: "Sing-along piano bar"}] },
  { deck: 7, name: "Deck 7", venues: [{name: "Fahrenheit 555 Steakhouse", desc: "Premium steak and seafood"}, {name: "Limelight Lounge", desc: "Nightclub and live music"}, {name: "Alchemy Bar", desc: "Vintage-themed mixology/cocktails"}, {name: "Carnival Kitchen", desc: "Interactive cooking classes"}] },
  { deck: 8, name: "Deck 8", venues: [{name: "Havana Pool & Bar", desc: "Cuban-themed retreat"}, {name: "Chibang!", desc: "Mexican and Chinese fusion dining"}, {name: "Guy's Pig & Anchor", desc: "Smokehouse BBQ & house-brewed craft beer"}, {name: "La Piazza", desc: "Italian street food and coffee"}, {name: "Cucina del Capitano", desc: "Italian family-style dining"}, {name: "Pizzeria del Capitano", desc: "24-hour fresh pizza (Included)"}, {name: "Bonsai Sushi", desc: "Japanese sushi and sashimi"}, {name: "Bonsai Teppanyaki", desc: "Interactive Japanese steakhouse"}] },
  { deck: 9, name: "Decks 9-15", venues: [{name: "Staterooms", desc: "Guest Cabins"}] },
  { deck: 16, name: "Deck 16", venues: [{name: "Lido Pool", desc: "Main pool area"}, {name: "RedFrog Tiki Bar", desc: "Rum and tropical cocktails"}, {name: "BlueIguana Cantina", desc: "Fresh Mexican tacos and burritos (Included)"}, {name: "Street Eats", desc: "Open-air street food stations (Included)"}, {name: "Seafood Shack", desc: "New England-style seafood"}, {name: "Big Chicken", desc: "Shaq's fried chicken (Included)"}, {name: "Lido Marketplace", desc: "Casual international buffet (Included)"}] },
  { deck: 17, name: "Deck 17", venues: [{name: "Cloud 9 Spa", desc: "Massages, thermal suites, and salon"}, {name: "Fitness Center", desc: "Gym and exercise classes"}, {name: "Guy's Burger Joint", desc: "Fresh grilled burgers and fries (Included)"}] },
  { deck: 18, name: "Deck 18", venues: [{name: "Serenity Retreat", desc: "Adults-only relaxation area"}, {name: "WaterWorks", desc: "Water slides and splash zone"}, {name: "Camp Ocean", desc: "Kids' club"}] },
  { deck: 19, name: "Deck 19", venues: [{name: "BOLT", desc: "Ultimate Sea Coaster (Rollercoaster)"}, {name: "SportsSquare", desc: "Mini-golf, ropes course, basketball"}, {name: "Loft 19", desc: "Exclusive retreat with infinity whirlpools"}] },
];

function App() {
  const [activeTab, setActiveTab] = useState('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('mg-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('./mardi-gras-deck-plan-pdf.pdf');

  useEffect(() => {
    localStorage.setItem('mg-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (venueName) => {
    setFavorites(prev => prev.includes(venueName) ? prev.filter(v => v !== venueName) : [...prev, venueName]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfUrl(URL.createObjectURL(file));
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const filteredDecks = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return decks.map(deck => {
      const matchingVenues = deck.venues.filter(v => {
        const matchesSearch = !searchQuery.trim() || v.name.toLowerCase().includes(lowerQuery) || (v.desc && v.desc.toLowerCase().includes(lowerQuery));
        const matchesFav = !showFavorites || favorites.includes(v.name);
        return matchesSearch && matchesFav;
      });

      if (!showFavorites && deck.name.toLowerCase().includes(lowerQuery)) return deck;
      if (matchingVenues.length > 0) return { ...deck, venues: matchingVenues };
      return null;
    }).filter(Boolean);
  }, [searchQuery, showFavorites, favorites]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-10 flex flex-col items-center">
        <h1 className="text-xl font-bold flex items-center gap-2">Mardi Gras Navigator</h1>
        <p className="text-xs text-slate-300 mt-1">Offline Mode Ready</p>
      </header>

      <div className="flex bg-white border-b border-slate-200">
        <button onClick={() => setActiveTab('directory')} className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'directory' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>Directory</button>
        <button onClick={() => setActiveTab('map')} className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'map' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>Deck Map</button>
      </div>

      <main className="flex-1 overflow-auto p-4">
        {activeTab === 'directory' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex gap-2">
              <input type="text" placeholder="Search venues..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              <button onClick={() => setShowFavorites(!showFavorites)} title="Toggle Favorites" className={`px-4 py-3 rounded-xl border shadow-sm font-semibold transition-colors ${showFavorites ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'bg-white border-slate-200 text-slate-500'}`}>
                {showFavorites ? '⭐' : '☆'}
              </button>
            </div>

            <div className="space-y-3 pb-8">
              {filteredDecks.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No venues found.</div>
              ) : (
                filteredDecks.map((deck) => (
                  <div key={deck.deck} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2 font-bold text-slate-700 border-b border-slate-200">{deck.name}</div>
                    <ul className="divide-y divide-slate-100">
                      {deck.venues.map((venue, idx) => (
                        <li key={idx} className="px-4 py-3 flex items-start justify-between">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-800">{venue.name}</span>
                            {venue.desc && <span className="text-xs text-slate-500">{venue.desc}</span>}
                          </div>
                          <button onClick={() => toggleFavorite(venue.name)} className={`p-2 text-xl ${favorites.includes(venue.name) ? 'text-yellow-500' : 'text-slate-300'}`}>
                            {favorites.includes(venue.name) ? '★' : '☆'}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="h-full flex flex-col items-center">
            <div className="w-full h-[75vh] border border-slate-200 rounded-xl overflow-hidden shadow-sm relative">
              <div className="absolute top-2 right-4 flex gap-2 z-10">
                <label className="cursor-pointer bg-slate-900 text-white px-3 py-1 rounded-full text-xs opacity-80 hover:opacity-100 shadow-md">
                  Change Map File
                  <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
              <iframe src={`${pdfUrl}#view=FitH`} className="w-full h-full bg-slate-200" title="Mardi Gras Deck Plan" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
