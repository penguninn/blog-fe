import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ModeToggle } from "@/components/mode-toggle";
import { login as loginApi } from "@/api/authService";

const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { tokens } = await loginApi(username, password);
      login(tokens);      
      toast.success("Đăng nhập thành công");
      navigate(from, { replace: true });
    } catch (error) {
      let errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader className="flex justify-between">
          <div className="flex flex-col gap-2">
          <CardTitle>Đăng nhập</CardTitle>
          <CardDescription>
            Đăng nhập vào hệ thống
          </CardDescription>
          </div>
          <ModeToggle />
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit" className="w-full mt-3" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signin;