import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../utils/helper";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (jwtDecode(getCookie("auth")).privilege === null) {
        navigate("/");
      }
    } catch (error) {
      navigate("/");
    }
  }, []);

  return <>{children}</>;
}
export default ProtectedRoute;
