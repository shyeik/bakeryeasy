import React from "react";

const SignupForm = () => {
  return (
    <div className="bg-white mt-0 px-10 py-10 rounded-3xl border-gray-200">
      <h1 className="text-5xl font-semibold">Welcome Back</h1>
      <p className="font-medium justify-between text-lg text-gray-500 mt-4 ">
        Welcome Please enter your details
      </p>
      <div className="mt-8 ">
        <div>
          <label className="text-lg font-medium">Email</label>
          <input
            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            placeholder="Enter your email"
            type="email"
          />
        </div>
        <div>
          <label className="text-lg font-medium">Password</label>
          <input
            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            placeholder="Enter your Password"
            type="Password"
          />
        </div>
        <div className="mt-8 flex justify-between items-center">
          <div>
            <input type="checkbox" id="remember" />
            <label className="ml-2 font-medium text-base" htmlFor="remember">
              Remember me for 30 days
            </label>
          </div>
          <button className="ml-4 font-medium text-base text-violet-500">
            Forgot password
          </button>
          {/* Add margin-left to the button */}
        </div>
        <div className="mt-8 flex flex-col gap-y-4">
          <button className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 rounded-xl bg-violet-500 text-white text-lg font-bold">
            Sign in
          </button>
          <button>Sign in with Google</button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
