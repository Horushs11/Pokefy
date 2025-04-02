// src/App.jsx
import PokemonList from './components/PokemonList';
import { Analytics } from "@vercel/analytics/react"

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e2a38]">
            <Analytics />
            <PokemonList />
        </div>
    );
}

export default App;