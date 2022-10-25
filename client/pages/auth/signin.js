import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";

const SigninForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest(
    {
      url: "/api/users/signin",
      method: "post",
      body: { email, password },
    },
    () => Router.push("/")
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    await doRequest();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>

      <div className="mb-3">
        <label className="form-label">Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign In</button>
    </form>
  );
};

export default SigninForm;
