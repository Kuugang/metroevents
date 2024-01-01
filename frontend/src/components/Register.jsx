import React, { useState } from "react";
import Modal from "react-modal";
import { axiosFetch } from "../utils/axios";

export default function Register({ isOpen, onClose, setRegisterModalIsOpen }) {
  async function handleRegister(e) {
    e.preventDefault();

    try {
      let inputs = {
        firstName: e.target.firstName.value,
        lastName: e.target.lastName.value,
        username: e.target.username.value,
        password: e.target.password.value,
      };

      const data = await axiosFetch.post("/user/register", inputs);

      if (data.status !== 200) {
        throw new Error(data.data.message);
      }
      alert("Registered successfully")
      setRegisterModalIsOpen(false);
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
      <form id="registerForm" className="w-full flex flex-col gap-3" onSubmit={handleRegister}>
        <div className="text-md font-bold flex flex-row items-center justify-center gap-[2px]">
          <h1>Metro</h1>
          <div className="bg-[rgb(255,163,26)] rounded p-[5px] text-black">
            <h1>Events</h1>
          </div>
        </div>

        <h1 className="text-center">Join in on the fun!</h1>
        <hr className="mb-2"></hr>

        <div className="flex flex-row gap-2">
          <input
            className="mb-4 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="registerFirstName"
            placeholder="First Name"
            name="firstName"
            required
          />

          <input
            className="mb-4 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="registerLastName"
            placeholder="Last Name"
            name="lastName"
            required
          />
        </div>

        <input
          className="mb-4 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          id="registerUsername"
          placeholder="Username"
          name="username"
          required
        />

        <input
          className="mb-4 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          id="registerPassword"
          placeholder="Password"
          name="password"
          required
        />

        <button className="bg-[rgb(128,128,128)]">
          Register
        </button>
      </form>
    </Modal>
  );
}
