import { Link as RouterLink } from "react-router-dom";
import logo from "../../assets/logo.svg";
import Icon from "../Icon";

export const Hybridly = () => {
  return (
    <RouterLink to="/">
      <Icon icon={logo} name="hybridly logo" />
    </RouterLink>
  );
};

export default Hybridly;
