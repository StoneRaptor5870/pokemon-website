"use server"

import api from "@/app/api/pokemon";

export const pokemonSearch = async (pokemonName: string) => {
  try {
    const response = await api.get(`/pokemon/${pokemonName.toLowerCase()}`);
    const pokemonData = response.data;
    return pokemonData;
  } catch (error) {
    console.log('Error fetching Pokémon data:', error);
  }
};