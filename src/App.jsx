// src/App.jsx
import PokemonList from './components/PokemonList';
import { Analytics } from "@vercel/analytics/react"

function App() {
    return (
        <div className="min-h-screen bg-[#e3f2fd]">
            <Analytics />
            <PokemonList />
        </div>
    );
}

export default App;