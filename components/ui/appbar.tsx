import { Button } from "./button";


interface AppbarProps {
  user?: {
    name?: string | null;
  };
  // type for onSignin and onSignout
  onSignin: any;
  onSignout: any;
}

export const Appbar = ({ user, onSignin, onSignout }: AppbarProps) => {
  return (
    <div className="flex justify-between border-b px-4 text-[#FFCC00] bg-white">
      <div className="text-2xl font-bold flex flex-row justify-center items-center text-red-600 -m-3">
        <img
          src="https://cdn.dribbble.com/users/6245075/screenshots/16269935/pokeball.png"
          alt="Pokeball"
          className="w-24 h-24 object-contain -mr-6"
        />
        <span>Pokedex</span>
      </div>
      <div className="flex flex-col justify-center pt-2">
        <Button onClick={user ? onSignout : onSignin}>
          {user ? "Logout" : "Login"}
        </Button>
      </div>
    </div>
  );
};
