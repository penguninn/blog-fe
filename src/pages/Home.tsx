import { useEffect, useState } from "react";
import CardPost from "@/components/card-post";
import axios from "axios";
import thumb from "@/assets/thumb.jpeg";

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

const Home = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<ApiResponse<PostType[]>>('http://localhost:8080/api/posts');
        if (response.data && response.data.data) {
          setPosts(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center overflow-hidden">
      <div className="w-screen h-[300px] relative flex flex-col items-center justify-center ">
        <img src={thumb} alt="logo" className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900/50 flex flex-col items-center justify-center">
        </div>
      </div>
      <div className="w-full max-w-5xl flex flex-col pt-10 items-center justify-center">
        <div className="w-full flex flex-col gap-4 px-4">
          {posts.map((post) => (
            <CardPost
              key={post.id}
              slug={post.slug}
              title={post.title}
              description={"No description"}
              tags={post.tags}            
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
