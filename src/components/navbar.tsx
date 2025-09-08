import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { postService } from "@/services/postService";
import { categoryService } from "@/services/categoryService";
import type { ApiEnvelope, PaginatedResponse, Post, Category } from "@/types";
import { normalizeEnvelope } from "@/utils/apiHelpers";
// NavigationMenu currently unused; keep minimal navbar
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
// import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import ProfileCustom from "./profile-custom";

// Using shared Category type

interface PostType {
    id: string;
    title: string;
    slug: string;
}

const Navbar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
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
        const res = await categoryService.getAll();
        const data = normalizeEnvelope<Category[]>(
          res.data as Category[] | import("@/types").ApiEnvelope<Category[]>
        );
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.warn("Error fetching categories:")
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
                res.data as
                | PaginatedResponse<Post>
                | ApiEnvelope<PaginatedResponse<Post>>
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
        <div className="w-full fixed top-0 z-50 flex flex-col justify-center items-center backdrop-blur-md shadow-sm shadow-neutral-300 dark:shadow-neutral-800 bg-[var(--navbar)] text-[var(--navbar-foreground)] border-b border-[var(--navbar-border)]">
            <div className="flex w-full px-5 py-2 max-w-7xl justify-between items-center">
                <div className="mr-12 hidden md:block">
                    <Logo />
                </div>
                {categories.length > 0 ? (
                    <div className="hidden xl:flex w-full gap-x-2 gap-y-2 items-center justify-center my-2">
                        <Link
                            to={`/`}
                            className=" hover:text-pink-600 hover:underline transition-colors text-sm"
                        >
                            Home
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/category/${cat.id}`}
                                className="border rounded-md border-transparent py-1 px-4 hover:bg-pink-400 hover:border-pink-600 transition-colors text-sm"
                            >
                                {cat.name}
                            </Link>
                        ))}
                        <a
                            className=" hover:text-pink-600 hover:underline transition-colors text-sm"
                            href="https://penguninn.com"
                            target="_blank"
                        >
                            About
                        </a>
                        <Link
                            target="_blank"
                            to="https://github.com/penguninn/blog-fe"
                            className="flex justify-start items-center py-1 px-4 hover:underline hover:text-pink-600 transition-colors text-sm"
                        >
                            Source <IoLogoGithub />
                        </Link>
                    </div>
                ) : null}

                <div className="w-full flex justify-end gap-1.5">
                    <div className="w-full flex justify-end relative">
                        <Input
                            className="w-full md:w-md focus-visible:ring-0 bg-[var(--navbar-input)] border-[var(--navbar-input-border)] text-[var(--navbar-foreground)] shadow-xs hover:shadow-sm"
                            type="search"
                            placeholder="Search anything ..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={() => setShowResults(true)}
                        />
                        {showResults && (searchQuery || searchResults.length > 0) && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--navbar-input)] text-[var(--navbar-foreground)] rounded-md shadow-lg border border-[var(--navbar-border)]">
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
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <ModeToggle />
                    <div className="inline-block xl:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-9 h-9">
                                    <RxHamburgerMenu />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-40 flex flex-col items-end"
                            >
                                <DropdownMenuItem asChild>
                                    <span className="w-full flex justify-center font-bold">
                                        Menu
                                    </span>
                                </DropdownMenuItem>
                                <div className="w-full mt-1 pt-1 border-t border-[var(--navbar-border)]" />
                                <DropdownMenuItem asChild>
                                    <Link to={`/`} className="w-full flex justify-start">
                                        Home
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link
                                        to="https://penguninn.com/"
                                        target="_blank"
                                        className="w-full flex justify-start"
                                    >
                                        About
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        target="_blank"
                                        to="https://github.com/penguninn/blog-fe"
                                        className="w-full flex justify-start items-center"
                                    >
                                        Source <IoLogoGithub />
                                    </Link>
                                </DropdownMenuItem>
                                {categories.map((cat) => (
                                    <DropdownMenuItem asChild key={cat.id}>
                                        <Link
                                            to={`/category/${cat.id}`}
                                            className="w-full flex justify-start text-sm"
                                            onClick={() => setShowResults(false)}
                                        >
                                            {cat.name}
                                        </Link>
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
