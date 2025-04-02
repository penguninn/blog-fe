import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { ModeToggle } from "./mode-toggle";
import { IoLogoGithub } from "react-icons/io5";
import Logo from "./logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { RxHamburgerMenu } from "react-icons/rx";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChevronDown } from "lucide-react";

interface CategoryType {
  id: string;
  name: string;
  slug?: string;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

const Navbar = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse<CategoryType[]>>("http://localhost:8080/api/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="w-full fixed top-0 z-50 flex justify-center items-center backdrop-blur-md shadow-sm shadow-neutral-300 dark:shadow-neutral-800">
      <div className="flex container p-2 justify-between items-center">
        <div className="mr-4 hidden sm:inline-block">
          <Logo />
        </div>
        <div className="w-full hidden sm:flex justify-start items-center">
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList className="gap-5">
              <NavigationMenuItem>
                <NavLink
                  to="https://penguninn.com/"
                  target="_blank"
                  className="hover:underline p-2"
                >
                  About
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink
                  target="_blank"
                  to="https://github.com/penguninn/portfolio"
                  className="flex flex-row justify-center items-center hover:underline p-2"
                >
                  <IoLogoGithub />
                  Source
                </NavLink>
              </NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1 px-2 hover:underline">
                    Danh mục
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/category/all" className="w-full">
                      Tất cả bài viết
                    </Link>
                  </DropdownMenuItem>

                  {categories.length > 0 && <DropdownMenuSeparator />}

                  {loading ? (
                    <div className="px-2 py-1 text-sm text-gray-500">Đang tải...</div>
                  ) : (
                    categories.map((category) => (
                      <DropdownMenuItem key={category.id} asChild>
                        <Link
                          to={`/category/${category.slug || category.id}`}
                          className="w-full"
                        >
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuList>
          </NavigationMenu>

        </div>
        <div className="w-full flex justify-center md:justify-end gap-3 items-center">
          <Input className="w-sm focus-visible:ring-0 bg-gray-100" type="search" placeholder="Search anything ..." />
          <ModeToggle />
          <div className="inline-block md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-9 h-9">
                  <RxHamburgerMenu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem asChild>
                  <Link to="https://penguninn.com/" target="_blank">
                    About
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    target="_blank"
                    to="https://github.com/penguninn"
                    className="flex flex-row justify-between items-center"
                  >
                    <IoLogoGithub />
                    Source
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/category/all">
                    Tất cả bài viết
                  </Link>
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link to={`/category/${category.slug || category.id}`}>
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
