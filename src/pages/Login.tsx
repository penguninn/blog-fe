import { Button } from "@/components/ui/button";
import { useKeycloakAuth } from "@/hooks/useKeycloak";

const Login = () => {
  const { login, isAuthenticated } = useKeycloakAuth();
  return (
    <div className="w-full min-h-[40vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        {isAuthenticated ? (
          <p className="text-muted-foreground">You are already logged in.</p>
        ) : (
          <Button
            onClick={() => login?.({ redirectUri: window.location.origin })}
          >
            Login with Keycloak
          </Button>
        )}
      </div>
    </div>
  );
};

export default Login;
