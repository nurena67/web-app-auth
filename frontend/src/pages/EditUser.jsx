import React, { useEffect } from "react";
import Layout from "./Layout";
import FormEditUser from "../components/FormEditUser";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const EditUser = () => {
  const navigate = useNavigate();

  useEffect(() => {
      const checkLoginAndRole = () => {
        const token = localStorage.getItem("token");
  
        if (!token) {
          navigate("/login"); // Redirect ke login jika token tidak ada
          return;
        }
  
        try {
          const decoded = jwt_decode(token);
          if (decoded.role !== "admin") {
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
          navigate("/login");
        }
      };
  
      checkLoginAndRole();
    }, [navigate]);

  return (
    <Layout>
      <FormEditUser />
    </Layout>
  );
};

export default EditUser;