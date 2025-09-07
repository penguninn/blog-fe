import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/api/axiosInstance";
import { postService } from "@/services/postService";
import type { ApiEnvelope, PaginatedResponse, Post } from "@/types";
import { normalizeEnvelope } from "@/utils/apiHelpers";
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
} from "./ui/dropdown-menu";
import { RxHamburgerMenu } from "react-icons/rx";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import ProfileCustom from "./profile-custom";

interface CategoryType {
  id: string;
  name: string;
}

interface TagType {
  id: string;
  name: string;
}

interface PostType {
  id: string;
  title: string;
  slug: string;
  tags: TagType[];
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

const Navbar = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PostType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const fetchedCategoriesRef = useRef(false);

  useEffect(() => {
    if (fetchedCategoriesRef.current) return;
    fetchedCategoriesRef.current = true;

    const fetchCategories = async () => {
      try {
        const response =
          await axiosInstance.get<ApiResponse<CategoryType[]>>("/categories");
        if (response.status === 200) {
          const payload = response.data?.data;
          setCategories(Array.isArray(payload) ? payload : []);
        } else {
          toast.error("Cannot fetch categories");
        }
      } catch (error) {
        console.warn("Error fetching categories:", error);
        toast.error("Cannot fetch categories");
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
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-");

      const res = await postService.search({
        query: normalizedQuery,
        page: 1,
        size: 5,
      });
      const data = normalizeEnvelope<PaginatedResponse<Post>>(
        res.data as PaginatedResponse<Post> | ApiEnvelope<PaginatedResponse<Post>>
      );
      const contents = data?.contents;
      setSearchResults(Array.isArray(contents) ? contents : []);
    } catch (error) {
      console.warn("Error searching posts:", error);
      toast.error("Cannot search posts");
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
    <div className="w-full fixed top-0 z-50 flex justify-center items-center backdrop-blur-md shadow-sm shadow-neutral-300 dark:shadow-neutral-800 bg-[var(--navbar)] text-[var(--navbar-foreground)] border-b border-[var(--navbar-border)]">
      <div className="flex w-full py-2 mx-2 sm:mx-10 justify-between items-center">
        <div className="mr-12 hidden sm:inline-block">
          <Logo />
        </div>
        <div className="w-full hidden sm:flex justify-start items-center">
          <NavigationMenu className="hidden lg:block">
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
                  to="https://github.com/penguninn/blog-fe"
                  className="flex flex-row justify-center items-center hover:underline p-2"
                >
                  <IoLogoGithub />
                  Source
                </NavLink>
              </NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 p-2 hover:underline"
                  >
                    Categories
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {categories.length > 0 &&
                    categories.map((category) => (
                      <DropdownMenuItem key={category.id} asChild>
                        <Link
                          to={`/category/${category.id}`}
                          className="w-full"
                        >
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="w-full flex justify-end md:justify-end gap-1.5 md:items-center">
          <div className="w-full sm:w-sm relative">
            <Input
              className="w-full sm:w-sm focus-visible:ring-0 bg-[var(--navbar-input)] border-[var(--navbar-input-border)] text-[var(--navbar-foreground)] shadow-xs hover:shadow-sm"
              type="search"
              placeholder="Search anything ..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowResults(true)}
            />
            {showResults && (searchQuery || searchResults.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--navbar)] text-[var(--navbar-foreground)] rounded-md shadow-lg border border-[var(--navbar-border)]">
                {isSearching ? (
                  <div className="p-2 text-center text-muted-foreground">
                    Searching...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-2 text-center text-muted-foreground">
                    No results found
                  </div>
                ) : (
                  <div className="max-h-[250px] overflow-y-auto">
                    {searchResults.slice(0, 5).map((post) => (
                      <div
                        key={post.id}
                        className="p-3 hover:bg-[var(--navbar-input)] cursor-pointer border-b last:border-b-0 border-[var(--navbar-border)]"
                        onClick={() => handleResultClick(post.slug)}
                      >
                        <div className="font-medium text-foreground">
                          {post.title}
                        </div>
                        {Array.isArray(post.tags) && post.tags.length > 0 && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {post.tags.map((tag) => tag.name).join(", ")}
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
          <div className="inline-block lg:hidden">
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
                  to="https://github.com/penguninn/blog-fe"
                  className="flex flex-row justify-start items-center"
                >
                  <IoLogoGithub />
                  Source
                </Link>
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem key={category.id} asChild>
                  <Link to={`/category/${category.id}`}>{category.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
          <ProfileCustom />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
