import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/prisma/db";
import { Card } from "@/components/ui/card";


const userData = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const userDataAndPokemon = await prisma.user.findFirst({
    where: {
      id: session?.user?.id,
    },
    include: { firstPokemon: true, pokemons: true },
  });
  return userDataAndPokemon;
};

export default async function Profile() {
  const userDataAndPokemon = await userData();
  if (!userDataAndPokemon) {
    return <div>No user data found</div>;
  }

  const { name, email, firstPokemon, pokemons } = userDataAndPokemon;

  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-8">
      <Card title="First Pokémon">
        <div className="flex flex-col justify-center items-center shadow-md p-4">
          <p>
            Name: {firstPokemon?.pokemonName}
          </p>
          <p>
            Id: {firstPokemon?.pokemonId}
          </p>
          {firstPokemon?.pokemonImage ? (
            <img
              src={firstPokemon?.pokemonImage}
              alt={firstPokemon?.pokemonName}
              className="w-32 h-32"
            />
          ) : (
            <p>No image available</p>
          )}
        </div>
      </Card>
      <div className="w-full max-h-96 overflow-y-auto p-4 border rounded-lg mt-4">
        <div className="text-center font-bold text-3xl mb-4">Your Favourite Pokemons</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pokemons.map((pokemon: any) => (
            <Card key={pokemon.id} title={pokemon.name}>
              <div className="flex flex-col items-center">
                {pokemon.image ? (
                  <img src={pokemon.image} alt={pokemon.name} className="w-32 h-32" />
                ) : (
                  <p>No image available</p>
                )}
                <p className="mt-2">Experience: {pokemon.experience}</p>
                <p className="mt-2">Type: {pokemon.type || "Unknown"}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}