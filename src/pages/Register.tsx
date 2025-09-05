import { Button } from "@/components/ui/button";
import { useKeycloakAuth } from "@/hooks/useKeycloak";

const Register = () => {
  const { register, isAuthenticated } = useKeycloakAuth();
  return (
    <div className="w-full min-h-[40vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Register</h1>
        {isAuthenticated ? (
          <p className="text-muted-foreground">You are already logged in.</p>
        ) : (
          <Button
            onClick={() => register?.({ redirectUri: window.location.origin })}
          >
            Register with Keycloak
          </Button>
        )}
      </div>
    </div>
  );
};

export default Register;
