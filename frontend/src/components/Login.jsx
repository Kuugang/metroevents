import React, { useState, useContext, useEffect } from "react";
import { MyContext } from "../utils/Context";
import { jwtDecode } from "jwt-decode";
import { axiosFetch } from "../utils/axios";
import { getCookie } from "../utils/helper";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import Modal from "react-modal";

export default function Login({
  isOpen,
  onClose,
  openRegisterModal,
  setLoginModalIsOpen,
}) {
  const { isLoggedIn, setIsLoggedIn, setUserData } = useContext(MyContext);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      let inputs = {
        username: e.target.username.value,
        password: e.target.password.value,
      };

      const data = await axiosFetch.post("/user/login", inputs);

      if (data.status !== 200) {
        throw new Error(data.data.message);
      }

      setLoginModalIsOpen(false);
      setIsLoggedIn(true);

      const token = data.data.user.token;
      const auth = `auth=${token};Path=/;Domain=metroevents-api.vercel.app;SameSite=None;Secure;`
      console.log(token);
      console.log(auth)


      document.cookie = "username=John Doe";
      document.cookie = `jwt=${token}`

      document.cookie = auth;

      localStorage.setItem("userDetails", JSON.stringify(data.data.user));
      localStorage.setItem("token", JSON.stringify(data.data.user.token));
      setUserData(data.data.user);
      navigate("/dashboard");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={
        "w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-max bg-[rgb(41,41,41)] shadow-md rounded px-8 pt-6 pb-8 mb-4 z-50"
      }
    >
      <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
        <div className="text-md font-bold flex flex-row items-center justify-center gap-[2px]">
          <h1>Metro</h1>
          <div className="bg-[rgb(255,163,26)] rounded p-[5px] text-black">
            <h1>Events</h1>
          </div>
        </div>

        <div>
          <input
            type="text"
            name="username"
            id="loginUsername"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Your username"
            required
          ></input>
        </div>

        <div>
          <input
            type="password"
            name="password"
            id="loginPassword"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Your password"
            required
          ></input>
        </div>
        <button type="submit" className="bg-[rgb(128,128,128)]">
          Log In
        </button>

        <hr></hr>

        <h1 className="text-center">Don't have an account yet?</h1>
        <button
          id="registerButton"
          className="bg-[rgb(128,128,128)]"
          type="button"
          onClick={openRegisterModal}
        >
          Create an Account
        </button>
      </form>
    </Modal>
  );
}
