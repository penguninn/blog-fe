import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
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
}

interface ApiResponseCategory<T> {
  status: number;
  message: string;
  data: T;
}

interface PostType {
  id: string;
  title: string;
  slug: string;
  tags: TagType[];
}

interface TagType {
  id: string;
  name: string;
}

const Navbar = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PostType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get<ApiResponseCategory<CategoryType[]>>("/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowResults(true);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const normalizedQuery = query
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');

      const response = await axiosInstance.get(`/posts/search?query=${normalizedQuery}&page=0&size=5`);
      setSearchResults(response.data.data.contents);
    } catch (error) {
      console.error("Error searching posts:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (slug: string) => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    navigate(`/posts/${slug}`);
  };

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
                  <Button variant="ghost" className="flex items-center gap-1 p-2 hover:underline">
                    Categories
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {categories.length > 0 && (
                    categories.map((category) => (
                      <DropdownMenuItem key={category.id} asChild>
                        <Link
                          to={`/category/${category.id}`}
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
          <div className="relative">
            <Input
              className="w-sm focus-visible:ring-0 bg-gray-100 dark:bg-gray-800" 
              type="search"
              placeholder="Search anything ..." 
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowResults(true)}
            />
            {showResults && (searchQuery || searchResults.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                {isSearching ? (
                  <div className="p-2 text-center text-gray-500">Searching...</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-2 text-center text-gray-500">No results found</div>
                ) : (
                  <div className="max-h-[250px] overflow-y-auto">
                    {searchResults.slice(0, 5).map((post) => (
                      <div
                        key={post.id}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                        onClick={() => handleResultClick(post.slug)}
                      >
                        <div className="font-medium text-gray-900 dark:text-gray-100">{post.title}</div>
                        {post.tags.length > 0 && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {post.tags.map(tag => tag.name).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
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
                    All posts
                  </Link>
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link to={`/category/${category.id}`}>
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
