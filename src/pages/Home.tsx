import { useEffect, useRef, useState } from "react";
import CardPost from "@/components/card-post";
import axiosInstance from "@/api/axiosInstance";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useTitle } from "@/hooks";
import { toast } from "sonner";

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
  data: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
    contents: T;
  };
}

const Home = () => {
  const [topPosts, setTopPosts] = useState<PostType[]>([]);
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
        const topResponse = await axiosInstance.get<ApiResponse<PostType[]>>(
          `/posts?page=1&size=5&sortBy=MODIFIED_AT&direction=DESC`
        );
        if (topResponse.data && topResponse.data.data) {
          setTopPosts(topResponse.data.data.contents);
        }
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
        <div className="w-full py-20 text-center">Loading content...</div>
      ) : (
        <>
          <div className="w-full max-w-5xl flex flex-col pt-10 items-center justify-center px-4">
            <div className="w-full flex justify-between items-center gap-4 px-2">
              <Label className="w-full text-3xl font-bold mb-5 text-start">
                Top Posts
              </Label>
              <div className="w-full">
                <Separator className="w-full" />
              </div>
            </div>
            <div className="w-full flex flex-col gap-4">
              {topPosts.length === 0 ? (
                <div className="w-full py-4 text-center">
                  No top posts found
                </div>
              ) : (
                <>
                  {topPosts.map((post) => (
                    <CardPost
                      key={post.id}
                      slug={post.slug}
                      title={post.title}
                      description={"No description"}
                      tags={post.tags}
                    />
                  ))}
                  <Link
                    to={`/posts/top-posts`}
                    className="text-end hover:text-blue-500 hover:underline"
                  >
                    Browse more...
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="w-full max-w-5xl flex flex-col pt-10 items-center justify-center px-4">
            <div className="w-full flex justify-between items-center gap-4 px-2">
              <Label className="w-full text-3xl font-bold mb-5 text-start">
                New Posts
              </Label>
              <div className="w-full">
                <Separator className="w-full" />
              </div>
            </div>
            <div className="w-full flex flex-col gap-4">
              {newPosts.length === 0 ? (
                <div className="w-full py-4 text-center">
                  No new posts found
                </div>
              ) : (
                <>
                  {newPosts.map((post) => (
                    <CardPost
                      key={post.id}
                      slug={post.slug}
                      title={post.title}
                      description={"No description"}
                      tags={post.tags}
                    />
                  ))}
                  <Link
                    to={`/posts/new-posts`}
                    className="text-end hover:text-blue-500 hover:underline"
                  >
                    Browse more...
                  </Link>
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
