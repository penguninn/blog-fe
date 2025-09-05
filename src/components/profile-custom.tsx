import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { LogOut, LogIn, User, UserPen } from "lucide-react";
import { userService, type UserProfile } from "@/services/userService";
import { useKeycloakAuth } from "@/hooks/useKeycloak";

function ProfileCustom() {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout, user: tokenUser } = useKeycloakAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchMe = async () => {
      if (!isAuthenticated) return;
      setLoading(true);
      setError(null);
      try {
        const res = await userService.getCurrent();
        if (!mounted) return;
        const payload = (res as any).data?.data || (res as any).data || res;
        setProfile(payload.data ? payload.data : payload);
      } catch (e) {
        if (!mounted) return;
        setError("Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchMe();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  const handleEditProfile = () => {
    navigate("/user/profile/edit");
  };

  const handleLogout = () => {
    logout?.();
    toast.success("Logout successfully");
    navigate("/");
  };

  const handleLogin = () => {
    login?.({ redirectUri: window.location.href });
  };

  const displayName =
    profile?.displayName ||
    (tokenUser as any)?.preferred_username ||
    (tokenUser as any)?.email ||
    "User";
  const avatarUrl = profile?.avatarUrl || null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-9 h-9 overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-9 h-9 object-cover rounded"
            />
          ) : (
            <User />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 px-2 py-1">
        {isAuthenticated ? (
          <>
            <span className="w-full h-9 py-1 px-2 flex justify-between items-center">
              {loading ? "Loading..." : error ? "Profile" : displayName}
            </span>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button
                variant="outline"
                className="w-full h-9"
                onClick={handleEditProfile}
              >
                <span className="w-full h-full flex justify-between items-center">
                  Edit Profile <UserPen />
                </span>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button
                variant="outline"
                className="w-full h-9"
                onClick={handleLogout}
              >
                <span className="w-full h-full flex justify-between items-center">
                  Logout <LogOut />
                </span>
              </Button>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Button
              variant="outline"
              className="w-full h-9"
              onClick={handleLogin}
            >
              <span className="w-full h-full flex justify-between items-center">
                Login <LogIn />
              </span>
            </Button>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileCustom;
