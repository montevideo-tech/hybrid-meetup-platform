import { Link as RouterLink } from "react-router-dom";
import logo from "../../assets/logo.svg";

export const Hybridly = () => {
  return (
    <RouterLink to="/">
      <img src={logo} alt="hybridly-logo" />
    </RouterLink>
  );
};

export default Hybridly;
