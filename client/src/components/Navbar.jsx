import React from "react";
import { assets } from "../assets/assets";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useClerk
} from "@clerk/clerk-react";

const Navbar = () => {
  const { openSignIn } = useClerk();

  return (
    <header className="shadow-md w-full fixed top-0 left-0 bg-white px-4 py-2">
      <div className="container mx-auto flex justify-between items-center">
        <img src={assets.logo} alt="logo" className="h-10" />

        <div className="flex items-center gap-4">
          {/* When user is NOT signed in: show recruiter + sign in */}
          <SignedOut>
            <button className="text-gray-600">Recruiter Login</button>
            <button
              onClick={() => openSignIn({})}
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full"
            >
              Login
            </button>
          </SignedOut>

          {/* When user IS signed in: show profile UserButton */}
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
