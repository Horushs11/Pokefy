// src/components/PokemonModal.jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";

const PokemonModal = ({ pokemon, onClose, typeColors, typeTranslations }) => {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    ).fromTo(
      modalRef.current,
      { y: -100, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" },
      "<"
    );
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(modalRef.current, {
      y: -100,
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power3.in",
    }).to(
      backdropRef.current,
      {
        opacity: 0,
        duration: 0.2,
      },
      "<"
    );
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl border border-gray-200"
      >
        <div className="text-right">
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-red-500 text-lg font-bold"
          >
            &#10005;
          </button>
        </div>

        <div className="text-center">
          <img
            src={
              pokemon.sprites.versions["generation-v"]["black-white"].animated
                .front_default || pokemon.sprites.front_default
            }
            alt={pokemon.name}
            className="mx-auto w-28 h-28 drop-shadow-lg"
          />
          <h2 className="text-2xl font-extrabold mt-2 text-gray-800">
            {capitalize(pokemon.name)} #{pokemon.id}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Altura: {pokemon.height / 10} m | Peso: {pokemon.weight / 10} kg
          </p>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">Tipos:</h3>
            <div className="flex justify-center flex-wrap gap-2 mt-1">
              {pokemon.types.map((t, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full text-sm shadow-sm border ${
                    typeColors[t.type.name] || "bg-gray-300 text-black"
                  }`}
                >
                  {typeTranslations[t.type.name] || capitalize(t.type.name)}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Estadísticas:
            </h3>
            <ul className="mt-2 text-left text-sm text-gray-700">
              {pokemon.stats.map((stat, i) => (
                <li key={i} className="mb-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{capitalize(stat.stat.name)}</span>
                    <span>{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-400 h-2 rounded-full"
                      style={{ width: `${Math.min(stat.base_stat, 100)}%` }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default PokemonModal;