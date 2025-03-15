import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {  useSelector } from "react-redux";
import { api } from "@/api";


const SignupForm = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store => store.auth);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const signupHandler = async (e) => {
    e.preventDefault();

    
    try {
      setLoading(true);
      const res = await api.post("/user/register", input);

      if (res.data.success) {
        
        navigate("/login");
        toast.success(res.data.message);
        setLoading(false);
        return res.data;
      }
    } catch (error) {
      toast.error("signup failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=> {
    if(user) {
      navigate('/')
    }
  },[])

  return (
    <div className="flex items-center justify-center w-screen h-screen " style={{
      backgroundColor: "#18181a"
      }}>
      <form
        onSubmit={signupHandler}
      className="shadow-lg flex flex-col gap-5 p-8 w-96 border rounded-sm"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl"
           style={{
            color: "#db1a59"
           }}
          >SNapify</h1>
          <p className="text-sm text-center text-slate-100">
            signup to see posts of other users
          </p>
        </div>
        <div>
          <Label className="text-slate-200">username</Label>
          <Input
            type="text"

            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2 "
          />
        </div>
        <div>
          <Label className="text-slate-200">email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <Label className="text-slate-200">password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 animate-spin"></Loader2>
            please wait
          </Button>
        ) : (
          <Button type="submit" className="bg-[#db1a59] text-white hover:bg-[#db1a59]/50 transition duration-150" >Signup</Button>
        )}

        <span className="text-center text-slate-300">
          Already have an account?{" "}
          <Link className="text-blue-600" to="/login">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default SignupForm;
