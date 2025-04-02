import { Link } from "react-router-dom";
import Pengunin from "./pengunin";
import { Label } from "@radix-ui/react-label";

const Logo = ({ showLabel = true }: { showLabel?: boolean }) => {
  return (
    <Link to="/">
      <div className="flex gap-1 justify-center items-center">
        <Pengunin />
        {showLabel && (
          <Label
            className="cursor-pointer font-bold text-md"
            style={{ fontFamily: `"M PLUS Rounded 1c", sans-serif` }}
          >
            Pengunin
          </Label>
        )}
      </div>
    </Link>
  );
};
export default Logo;
