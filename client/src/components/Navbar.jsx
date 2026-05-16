import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { setShowRecruiterLogin } = useContext(AppContext);

  return (
    <div className="shadow-md w-full fixed top-0 left-0 bg-white px-6 py-3 z-999">
      
      <div className="container mx-auto flex justify-between items-center">

        {/* LEFT SIDE - LOGO + BRAND NAME */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            src={assets.logo}
            alt="logo"
            className="h-14 md:h-16 w-auto object-contain"
          />

          <span className="text-lg md:text-xl font-bold text-gray-800">
            Brighter Monday Kenya
          </span>
        </div>

        {/* RIGHT SIDE */}
        {user ? (
          <div className="flex items-center gap-4">
            <Link
              to="/applications"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Applied Jobs
            </Link>

            <span className="text-gray-400">|</span>

            <p className="max-sm:hidden text-gray-700">
              {`${user.firstName || ""} ${user.lastName || ""}`.trim()}
            </p>

            <UserButton />
          </div>
        ) : (
          <div className="flex items-center gap-3 max-sm:text-xs">
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
            >
              Recruiter Login
            </button>

            <Link
              to="/admin"
              className="rounded-full border border-blue-600 bg-blue-50 px-4 py-2 text-blue-700 hover:bg-blue-100 transition"
            >
              Admin
            </Link>

            <button
              onClick={() => openSignIn()}
              className="rounded-full bg-blue-600 px-5 py-2 text-white shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition"
            >
              Job Seeker Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Navbar;

// import React from "react";
// import { assets } from "../assets/assets";
// import {
//   SignedIn,
//   SignedOut,
//   UserButton,
//   useClerk
// } from "@clerk/clerk-react";

// const Navbar = () => {
//   const { openSignIn } = useClerk();

//   return (
//     <header className="shadow-md w-full fixed top-0 left-0 bg-white px-4 py-2">
//       <div className="container mx-auto flex justify-between items-center">
//         <img src={assets.logo} alt="logo" className="h-10" />

//         <div className="flex items-center gap-4">
//           {/* When user is NOT signed in: show recruiter + sign in */}
//           <SignedOut>
//             <button className="text-gray-600">Recruiter Login</button>
//             <button
//               onClick={() => openSignIn({})}
//               className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full"
//             >
//               Login
//             </button>
//           </SignedOut>

//           {/* When user IS signed in: show profile UserButton */}
//           <SignedIn>
//             <UserButton afterSignOutUrl="/" />
//           </SignedIn>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
