import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { registerUser } from "../http/httpService";

function Login() {
  return (
    <div className="page-login">
      <div className="login-top"></div>
      <form action="">
        <div>
          <label>userName</label>
          <input type="text"/>
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password"
            name="password"
          />
        </div>
      </form>
      <button  className="btn btn-primary">
        login
      </button>
      <Link to="/register" className="btn btn-primary">
          register
      </Link>
    </div>
  )
}
export default Login