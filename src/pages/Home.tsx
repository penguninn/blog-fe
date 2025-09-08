import { useEffect, useRef, useState } from "react";
import CardPost from "@/components/card-post";
import axiosInstance from "@/api/axiosInstance";
import { Link } from "react-router-dom";
import { useTitle } from "@/hooks";
import { toast } from "sonner";


import type { ContentBlock } from "@/types";

interface PostType {
  id: string;
  title: string;
  slug: string;
  contents?: ContentBlock[]; // optional, may not be present on this endpoint
  category?: { id: string; name: string };
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
    contents: T;
  };
}

const Home = () => {
  const [newPosts, setNewPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useTitle("Home");

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const newResponse = await axiosInstance.get<ApiResponse<PostType[]>>(
          `/posts?page=1&size=5&sortBy=CREATED_AT&direction=DESC`
        );
        if (newResponse.data && newResponse.data.data) {
          setNewPosts(newResponse.data.data.contents);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="w-full flex flex-col justify-start items-center overflow-hidden">
      {loading ? (
        <div className="w-full py-20 text-center">Loading ...</div>
      ) : (
        <>
          <div className="w-full container flex flex-col pt-10 items-center justify-center px-8">
            <div className="w-full">
              {newPosts.length === 0 ? (
                <div className="w-full py-4 text-center">No posts found</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {newPosts.map((post) => (
                      <CardPost
                        key={post.id}
                        slug={post.slug}
                        title={post.title}
                        contents={post.contents}
                        category={post.category?.name}
                        categoryUrl={
                          post.category
                            ? `/category/${post.category.id}`
                            : undefined
                        }
                      />
                    ))}
                  </div>
                  <div className="w-full mt-4 text-right">
                    <Link
                      to={`/posts/new-posts`}
                      className="hover:text-blue-500 hover:underline"
                    >
                      Browse more...
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
