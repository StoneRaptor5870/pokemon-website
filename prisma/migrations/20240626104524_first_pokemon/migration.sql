-- CreateTable
CREATE TABLE "FirstPokemon" (
    "id" TEXT NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "pokemonName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FirstPokemon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FirstPokemon_userId_key" ON "FirstPokemon"("userId");

-- AddForeignKey
ALTER TABLE "FirstPokemon" ADD CONSTRAINT "FirstPokemon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
