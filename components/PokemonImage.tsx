"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";


interface PokemonImageProps {
  id: number;
  name: string;
  imageUrl: string;
}

const PokemonImage: React.FC<PokemonImageProps> = ({ id, name, imageUrl }) => {
  const router = useRouter();

  const handleClick = useCallback(async () => {
    try {
      const response = await fetch("/api/selectFirstPokemon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name, imageUrl }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        console.error("Failed to select first Pokémon");
      }
    } catch (error) {
      console.error("Error selecting first Pokémon:", error);
    }
  }, [id, name, router]);

  return (
    <div onClick={handleClick} className="flex flex-col items-center mt-20 cursor-pointer">
      <img src={imageUrl} alt={name} className="w-full h-full" />
    </div>
  );
};

export default PokemonImage;
