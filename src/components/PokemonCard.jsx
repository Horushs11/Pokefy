// src/components/PokemonCard.jsx
import React from "react";

const PokemonCard = ({ pokemon, onClick, typeColors, typeTranslations }) => {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div
      onClick={onClick}
      className="cursor-pointer relative bg-gradient-to-br from-[#1e2a38] to-[#2c3e50] border border-[#4b6584] rounded-xl p-4 shadow-lg transition-transform hover:scale-[1.03] hover:shadow-2xl group overflow-hidden"
    >
      {/* Border glow effect */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_#22d3ee] transition-all"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-[#1f2937] rounded-full flex items-center justify-center shadow-inner mb-2 group-hover:scale-105 transition-transform">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-16 h-16 object-contain"
          />
        </div>
        <p className="text-cyan-300 font-bold text-sm tracking-wide">
          #{pokemon.id.toString().padStart(4, '0')}
        </p>
        <h3 className="text-lg font-semibold text-white capitalize">
          {capitalize(pokemon.name)}
        </h3>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {pokemon.types.map((typeSlot, index) => {
            const type = typeSlot.type.name;
            return (
              <span
                key={index}
                className={`text-xs px-3 py-1 rounded-full font-semibold border border-white/20 ${typeColors[type] || "bg-gray-300 text-black"}`}
              >
                {typeTranslations[type] || capitalize(type)}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;