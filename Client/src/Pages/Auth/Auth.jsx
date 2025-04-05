import React, { useState, useContext } from "react";
import Login from "../../assets/account.png";
import Victory from "../../assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AppContext from "@/Context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const { handleReg, handleLog } = useContext(AppContext);
  const navigate = useNavigate();

  const validateSignup = async () => {
    if (!firstname.length || !email.length || !password.length || !confirmPassword.length) {
      toast.error("All fields are required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    const register = await handleReg(email, password, firstname);
    if (!register) {
      toast.error("Error in Registering User");
      return false;
    }
    if (register.profileSetup === false) {
      navigate("/profile");
      return;
    }
    navigate("/chat");
    toast.success("User Created Successfully");
    console.log("User Created : ", register);
    return true;
  };

  const handleLogin = async () => {
    if (!email.length || !password.length) {
      toast.error("All fields are required");
      return;
    }
    const login = await handleLog(email, password);
    if (!login) {
      toast.error("Error in Logging User");
      return;
    }
    if (login.profileSetup === false) {
      navigate("/profile");
      return;
    }
    if (login.profileSetup === true) {
      navigate("/chat");
      return;
    }
    toast.success("User Logged Successfully");
    console.log("User Logged : ", login);
  };

  const handleSignup = async () => {
    const isValid = await validateSignup();
    if (!isValid) return;
    console.log("Success");
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-800 via-gray-700 to-blue-900">
      <div className="w-full max-w-5xl h-[70vh] min-h-[650px] bg-gray-900/80 border border-gray-700/50 shadow-xl rounded-2xl grid xl:grid-cols-2 overflow-hidden transition-all duration-500 hover:shadow-blue-500/10">
        {/* Left Section */}
        <div className="flex flex-col gap-4 items-center justify-center p-6 md:p-8">
          <div className="flex flex-col items-center text-center space-y-3 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-gray-100 tracking-tight drop-shadow-md">
                Welcome Back
              </h1>
              <img
                src={Victory}
                alt="Victory"
                className="h-14 md:h-16 xl:h-20 transition-transform duration-300 hover:scale-110 hover:rotate-12"
              />
            </div>
            <p className="text-base text-gray-400 max-w-sm leading-relaxed">
              Sign in or create an account to continue your adventure
            </p>
          </div>

          <div className="w-full max-w-lg">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 w-full bg-transparent mb-6">
                <TabsTrigger
                  value="login"
                  className="py-4 text-gray-400 text-base font-medium transition-all duration-300 
                    data-[state=active]:text-gray-100 data-[state=active]:bg-blue-500/10 hover:text-gray-200 hover:bg-gray-800/50"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="py-4 text-gray-400 text-base font-medium transition-all duration-300 
                    data-[state=active]:text-gray-100 data-[state=active]:bg-blue-500/10 hover:text-gray-200 hover:bg-gray-800/50"
                >
                  Signup
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="flex flex-col gap-4 mt-0 animate-in fade-in duration-500">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-lg px-5 py-6 text-base bg-gray-800/50 border border-gray-700/50 text-gray-200 placeholder-gray-500 
                    focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 hover:bg-gray-800/80"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-lg px-5 py-6 text-base bg-gray-800/50 border border-gray-700/50 text-gray-200 placeholder-gray-500 
                    focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 hover:bg-gray-800/80"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  onClick={handleLogin}
                  className="rounded-lg py-6 text-base bg-blue-600 hover:bg-blue-700 text-white font-medium 
                    transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
                >
                  Sign In
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="flex flex-col gap-4 mt-0 animate-in fade-in duration-500">
                <Input
                  placeholder="First Name"
                  type="text"
                  className="rounded-lg px-5 py-5 text-base bg-gray-800/50 border border-gray-700/50 text-gray-200 placeholder-gray-500 
                    focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 hover:bg-gray-800/80"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-lg px-5 py-5 text-base bg-gray-800/50 border border-gray-700/50 text-gray-200 placeholder-gray-500 
                    focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 hover:bg-gray-800/80"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-lg px-5 py-5 text-base bg-gray-800/50 border border-gray-700/50 text-gray-200 placeholder-gray-500 
                    focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 hover:bg-gray-800/80"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-lg px-5 py-5 text-base bg-gray-800/50 border border-gray-700/50 text-gray-200 placeholder-gray-500 
                    focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 hover:bg-gray-800/80"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  onClick={handleSignup}
                  className="rounded-lg py-6 text-base bg-blue-600 hover:bg-blue-700 text-white font-medium 
                    transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
                >
                  Create Account
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden xl:flex items-center justify-center h-full w-full bg-gradient-to-tr from-gray-800 via-blue-800 to-gray-900 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          <img
            src={Login}
            alt="Account illustration"
            className="max-h-[80%] max-w-[80%] object-contain transition-transform duration-500 hover:scale-110 hover:rotate-6 drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;