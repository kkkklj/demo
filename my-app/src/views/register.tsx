import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { registerUser } from "../http/httpService";

function Register() {
  return (
    <div className="page-login">
      <button  className="btn btn-primary">
        Next
      </button>
      <Link to="/" className="btn btn-primary">
          login
      </Link>
    </div>
  )
}
export default Register