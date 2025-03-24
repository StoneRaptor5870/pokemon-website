"use client";

import { useState, useEffect } from "react";
import { TextInput } from "./ui/textinput";
import { pokemonSearch } from "@/app/lib/actions/selectFirstPokemon";
import useDebounce from "@/hooks/useDebounce";
import api from "@/app/api/pokemon";
import { Card } from "./ui/card";
import { handleSaveFavourite } from "@/app/lib/actions/addToFavourite";


export default function SearchPokemon() {
  const [pokemon, setPokemon] = useState("");
  const [pokemonData, setPokemonData] = useState<any>(null);
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const debouncedPokemon = useDebounce(pokemon, 300);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await api.get(`/pokemon?offset=0&limit=200`);
        const fetchedPokemonList = response.data.results;

        // Fetch details for each Pokémon to get the images
        const detailedPokemonList = await Promise.all(
          fetchedPokemonList.map(async (pokemon: any) => {
            const pokemonDetails = await api.get(`/pokemon/${pokemon.name}`);
            return { ...pokemon, ...pokemonDetails.data };
          })
        );

        setPokemonList(detailedPokemonList);
      } catch (error) {
        console.log("Error fetching Pokémon list:", error);
      }
    };

    fetchPokemonList();
  }, []);

  const handleSearch = async () => {
    const data = await pokemonSearch(debouncedPokemon);
    setPokemonData(data);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-8">
      <div className="flex gap-4">
        <TextInput
          placeholder="Enter name for a pokemon"
          label="Pokemon Search"
          onChange={(e: any) => {
            setPokemon(e);
          }}
        />
        <div className="mt-8">
          <button
            onClick={handleSearch}
            type="button"
            className="text-white bg-red-600 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-2.5 me-4 mt-1"
          >
            Search
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        {pokemonData ? (
          <Card title={pokemonData.name}>
            <div className="flex flex-col items-center">
              <img
                src={pokemonData.sprites.front_default}
                alt={pokemonData.name}
                className="w-32 h-32"
              />
              <h2 className="text-xl font-bold">{pokemonData.name}</h2>
              <p>Height: {pokemonData.height}</p>
              <p>Weight: {pokemonData.weight}</p>
              <p>
                Type:{" "}
                {pokemonData.types
                  .map((type: any) => type.type.name)
                  .join(", ")}
              </p>
              <button
                onClick={async () => await handleSaveFavourite(pokemonData)}
                className="text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-2.5 mt-2"
              >
                Save as Favorite
              </button>
            </div>
          </Card>
        ) : (
          <p>No Pokémon data to display</p>
        )}
      </div>
      <div className="w-full max-h-96 overflow-y-auto p-4 border rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pokemonList.map((pokemon, index) => (
            <Card key={index} title={pokemon.name}>
              <div className="flex flex-col items-center">
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="w-32 h-32"
                />
                <p className="mt-2">{pokemon.name}</p>
                <button
                  onClick={async () => await handleSaveFavourite(pokemon)}
                  className="text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-2.5 mt-2"
                >
                  Save as Favorite
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
