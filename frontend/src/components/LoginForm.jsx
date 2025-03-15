import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { api } from "@/api";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/slicers/authSlice";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await api.post("/user/login", input);

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));

        toast.success(res.data.message);
        navigate("/");
        setLoading(false);
        return res.data;
      }
    } catch (error) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div
      className="flex items-center justify-center w-screen h-screen "
      style={{
        backgroundColor: "#18181a",
      }}
    >
      <form
        onSubmit={loginHandler}
        className="shadow-lg flex flex-col gap-5 p-8 w-96 border rounded-sm"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl text-[#db1a59]">
            SNapify
          </h1>
          <p className="text-sm text-center">
            Login to see posts of other users
          </p>
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
            <Loader2 className="mr-2 h-4 animate-spin bg-[#db1a59]"></Loader2>
            please wait
          </Button>
        ) : (
          <Button type="submit" className="text-white  transition duration-150">
            Login
          </Button>
        )}

        <span className="text-center text-slate-300">
          Haven't created one?{" "}
          <Link className="text-blue-600" to="/signup">
            Sign up
          </Link>
        </span>
      </form>
    </div>
  );
};

export default LoginForm;
