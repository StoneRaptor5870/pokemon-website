import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import prisma from "@/prisma/db";

const pokemon = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const userDataAndPokemon = await prisma.user.findFirst({
    where: {
      id: session?.user?.id,
    },
    include: { firstPokemon: true },
  });
  return userDataAndPokemon;
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const name = session?.user?.name;
  const pokemonData = await pokemon();

  if (!session) {
    redirect("/signin");
  }
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 gap-4 bg-[url('./../public/Nature.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="flex justify-center items-center mb-4 text-2xl font-bold">Welcome Back, {name}</div>
      <div className="mb-auto">
        {pokemonData && pokemonData.firstPokemon ? (
          <Dashboard pokemonData={pokemonData.firstPokemon} />
        ) : (
          <p>No Pokémon data found.</p>
        )}
      </div>
    </div>
  );
}