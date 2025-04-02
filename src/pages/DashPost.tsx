import { useEffect, useState } from "react";
import ItemPost from "@/components/item-post";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

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
  status: string;
  category: CategoryType;
  tags: TagType[];
}

interface ApiResponse {
  status: number;
  message: string;
  data  : PostType[];
}

const DashPost: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const fetchPosts = async () => {
    try {
      const response = await axios.get<ApiResponse>('http://localhost:8080/api/posts', {
        headers: {
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (response.data) {
        setPosts(response.data.data);
      }
    } catch (err) {
      console.error('Error when loading post list:', err);
      toast.error('Cannot load post list');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeleteSuccess = () => {
    fetchPosts();
    toast.success('Update post list successfully');
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">Post List</h1>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link to="/admin/posts/create" className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> Create new post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-md">
          <p className="text-gray-500 mb-4">No post yet</p>
          <Button asChild>
            <Link to="/admin/posts/create">Create new post</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <ItemPost
              key={post.id}
              id={post.id}
              slug={post.slug}
              title={post.title}
              status={post.status}
              category={post.category.name}
              tags={post.tags}
              onDeleteSuccess={handleDeleteSuccess}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashPost;
