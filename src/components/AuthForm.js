import React, { useState } from "react";
import { authService } from "fbase";

const AuthForm = () => {
  const [email, getEmail] = useState("");
  const [password, getPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = event => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      getEmail(value);
    } else if (name === "password") {
      getPassword(value);
    }
  };

  const onSubmit = async event => {
    event.preventDefault();
    try {
      if (newAccount) {
        await authService.createUserWithEmailAndPassword(email, password);
      } else {
        await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => {
    setNewAccount(prev => !prev);
  };
  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input
          type="email"
          placeholder="email"
          name="email"
          value={email}
          onChange={onChange}
          className="authInput"
        />
        <input
          onChange={onChange}
          type="password"
          placeholder="password"
          name="password"
          value={password}
          className="authInput"
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
          className="authInput authSubmit"
        />
        {error && <span className="error">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
