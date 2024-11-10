import { useNavigate } from "react-router-dom";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useEffect, useState } from "react";
import axios from "axios";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignin = async () => {
    setError(null);
    const endpoint =
      role === "Admin" ? "/api/v1/admin/login" : "/api/v1/user/login";

    try {
      const response = await axios.post(endpoint, {
        username,
        password,
      });

      // Debugging: Log the full response to see its structure
      console.log("Login API Response:", response);

      // Check where the token is stored in the response
      const token = response.data?.data?.token || response.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        console.log("Stored token after login:", localStorage.getItem("token"));

        if (role === "Admin") {
          navigate("/admindashboard");
        } else {
          navigate("/userdashboard");
        }
      } else {
        throw new Error("Token not found in response");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          {error && <p className="text-red-500">{error}</p>}
          <InputBox
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Email"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            label={"Password"}
            type="password"
          />
          <div className="pt-2">
            <label className="block text-left text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="pt-4">
            <Button onClick={handleSignin} label={"Sign in"} />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};
