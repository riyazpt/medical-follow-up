import React, {useState} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {auth} from "../config/firebase";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        setMessage("User created successfully!");
        console.log("User created:", userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setMessage("User signed in successfully!");
        console.log("User signed in:", userCredential.user);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && (
          <p className="text-green-500 text-center mb-4">{message}</p>
        )}

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:underline"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
