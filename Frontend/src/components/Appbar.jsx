import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown.jsx";

export const Appbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");

    // Check if token exists in local storage
    if (!userToken) {
      navigate("/signin"); // Redirect to sign-in page if token doesn't exist
    } else {
      axios
        .get("/api/v1/all/Allmessage", {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        })
        .then((response) => {
          setUser(response.data); // Set user data from API
        });
    }
  }, [navigate]); // Add navigate to dependencies

  return (
    <div className="shadow h-14 flex justify-between items-center md:px-10">
      <Link to={"/dashboard"}>
        <div className="flex flex-col justify-center h-full ml-4 font-bold">
          PayTM App
        </div>
      </Link>
      <div className="flex items-center justify-center gap-2">
        <div className="rounded-full h-10 w-10 p-4 bg-slate-200 flex justify-center mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {/* Conditionally render ProfileDropdown only if user data is available */}
            {user ? <ProfileDropdown user={user} /> : "Loading..."}
          </div>
        </div>
      </div>
    </div>
  );
};
