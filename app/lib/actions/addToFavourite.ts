"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@/prisma/db";
import { redirect } from "next/navigation";

export const handleSaveFavourite = async (pokemon: any) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  try {
    const favorite = await prisma.pokemons.create({
      data: {
        userId: session.user.id,
        pokemonId: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.front_default,
        experience: pokemon.base_experience,
        type: pokemon.types[0].type.name,
      },
    });
  } catch (error) {
    console.error('Error saving favorite Pokémon:', error);
  }
};
