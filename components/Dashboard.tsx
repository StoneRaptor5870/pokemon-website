"use client";



interface PokemonData {
  id: string;
  pokemonId: number;
  pokemonName: string;
  pokemonImage: string | null;
  userId: string;
}

const Dashboard: React.FC<{ pokemonData: PokemonData }> = ({ pokemonData }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col justify-center items-center m-auto mt-64">
        {pokemonData.pokemonImage ? (
          <img
            src={pokemonData.pokemonImage}
            alt={pokemonData.pokemonName}
            className="w-64 h-64 m-auto"
          />
        ) : (
          <p>No image available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
