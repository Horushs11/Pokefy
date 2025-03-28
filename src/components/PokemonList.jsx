// src/components/PokemonList.jsx
import { useEffect, useState, useMemo, useRef } from "react";
import PokemonModal from "./PokemonModal";
import { ChevronDown, Filter } from "lucide-react";
import Fuse from "fuse.js";
import gsap from "gsap";
import logo from "../assets/pokeball.png"; // Asegúrate de tener este archivo en assets

const typeTranslations = {
  normal: "Normal", fire: "Fuego", water: "Agua", electric: "Eléctrico",
  grass: "Planta", ice: "Hielo", fighting: "Lucha", poison: "Veneno",
  ground: "Tierra", flying: "Volador", psychic: "Psíquico", bug: "Bicho",
  rock: "Roca", ghost: "Fantasma", dark: "Siniestro", dragon: "Dragón",
  steel: "Acero", fairy: "Hada"
};

const typeColors = {
  grass: "bg-green-400 text-white", fire: "bg-red-500 text-white",
  water: "bg-blue-400 text-white", bug: "bg-lime-500 text-white",
  normal: "bg-gray-400 text-white", poison: "bg-purple-500 text-white",
  electric: "bg-yellow-400 text-black", ground: "bg-yellow-700 text-white",
  fairy: "bg-pink-400 text-white", fighting: "bg-red-700 text-white",
  psychic: "bg-pink-600 text-white", rock: "bg-yellow-800 text-white",
  ghost: "bg-indigo-800 text-white", ice: "bg-blue-200 text-black",
  dragon: "bg-indigo-600 text-white", dark: "bg-gray-800 text-white",
  steel: "bg-gray-500 text-white", flying: "bg-sky-300 text-black",
};

const PokemonList = () => {
  const [allPokemonList, setAllPokemonList] = useState([]);
  const [displayedPokemons, setDisplayedPokemons] = useState([]);
  const [allDetailedPokemon, setAllDetailedPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 20;
  const filterRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const fetchAllNames = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1300");
        const data = await res.json();
        setAllPokemonList(data.results);
      } catch (err) {
        console.error("Error al cargar lista completa:", err);
      }
    };
    fetchAllNames();
  }, []);

  useEffect(() => {
    const fetchAllDetailedPokemon = async () => {
      try {
        const detailed = await Promise.all(
          allPokemonList.map(async (p) => {
            const res = await fetch(p.url);
            return await res.json();
          })
        );
        setAllDetailedPokemon(detailed);
      } catch (err) {
        console.error("Error al cargar detalles de todos los pokémons:", err);
      }
    };
    if (allPokemonList.length > 0) fetchAllDetailedPokemon();
  }, [allPokemonList]);

  useEffect(() => {
    const currentSlice = allDetailedPokemon.slice(0, (page + 1) * limit);
    setDisplayedPokemons(currentSlice);
  }, [page, allDetailedPokemon]);

  const fuse = useMemo(() => {
    return new Fuse(allDetailedPokemon, {
      keys: ["name"],
      threshold: 0.3,
    });
  }, [allDetailedPokemon]);

  const handleLoadMore = () => {
    if (loadMoreRef.current) {
      gsap.fromTo(
        loadMoreRef.current,
        { scale: 1 },
        {
          scale: 1.2,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        }
      );
    }
    setPage((prev) => prev + 1);
  };

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const filteredList = () => {
    let list = searchTerm ? fuse.search(searchTerm).map((r) => r.item) : allDetailedPokemon;
    if (selectedTypes.length > 0) {
      list = list.filter((pokemon) =>
        pokemon.types.some((t) => selectedTypes.includes(t.type.name))
      );
    }
    if (searchTerm || selectedTypes.length > 0) return list;
    return displayedPokemons;
  };

  const renderCard = (pokemon) => (
    <div
      key={pokemon.id}
      onClick={() => setSelectedPokemon(pokemon)}
      className="cursor-pointer"
    >
      <div className="bg-[#8b9dc3] p-4 rounded-lg shadow-md text-center transition-transform duration-300 ease-in-out hover:scale-105 border border-[#ffffff]">
        <p className="font-bold text-[#212121] text-lg">#{pokemon.id}</p>
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="mx-auto w-20 h-20"
        />
        <p className="capitalize font-semibold text-[#212121] text-xl">
          {capitalize(pokemon.name)}
        </p>
        <div className="mt-4">
          {pokemon.types.map((typeSlot, index) => (
            <span
              key={index}
              className={`inline-block text-sm px-2 py-1 rounded-full mx-1 ${
                typeColors[typeSlot.type.name] || "bg-gray-300 text-black"
              }`}
            >
              {typeTranslations[typeSlot.type.name] || capitalize(typeSlot.type.name)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 mx-0 md:mx-10 lg:mx-32">
      <div className="flex justify-center mb-10">
        <img src={logo} alt="PokéLogo" className="w-16 h-16" />
      </div>

      <div className="flex flex-wrap justify-center mb-6 gap-4 items-start w-full max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Buscar Pokémon por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="relative w-full max-w-xs" ref={filterRef}>
          <button
            onClick={() => setShowTypeFilter(!showTypeFilter)}
            className="flex w-full items-center justify-between bg-white px-4 py-2 border rounded-md shadow-md hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filtrar por tipo</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transform transition-transform ${showTypeFilter ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          {showTypeFilter && (
            <div className="absolute left-0 mt-2 w-full bg-white border rounded-xl shadow-xl z-50 p-4 max-h-80 overflow-y-auto">
              <ul className="grid grid-cols-2 gap-2 w-full">
                {Object.keys(typeTranslations).map((type) => (
                  <li key={type} className="w-full">
                    <label className="flex items-center gap-2 cursor-pointer w-full">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeToggle(type)}
                        className="accent-blue-500"
                      />
                      <span
                        className={`text-sm w-full ${typeColors[type] || "bg-gray-200 text-black"} px-2 py-1 rounded`}
                      >
                        {typeTranslations[type] || capitalize(type)}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {filteredList().map((p) => renderCard(p))}
      </div>

      {!searchTerm && selectedTypes.length === 0 && (
        <div className="flex justify-center mt-6">
          <button
            ref={loadMoreRef}
            onClick={handleLoadMore}
            className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}

      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          typeColors={typeColors}
          typeTranslations={typeTranslations}
        />
      )}
    </div>
  );
};

export default PokemonList;