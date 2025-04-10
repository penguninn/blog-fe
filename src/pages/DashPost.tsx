import { useEffect, useState } from "react";
import ItemPost from "@/components/item-post";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { PaginationCustom } from "@/components/pagination-custom";
import { useTitle } from "@/hooks";

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

const DashPost: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Thiết lập tiêu đề trang
  useTitle("Quản lý bài viết");

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get<ApiResponse<PostType[]>>(`/posts?page=${currentPage}&size=5&sort=createdDate,desc`);

      if (response.data) {
        setPosts(response.data.data.contents);
        setTotalPages(response.data.data.totalPages);
        setCurrentPage(response.data.data.page + 1);
      }
    } catch (err) {
      console.error('Error when loading post list:', err);
      toast.error('Cannot load post list');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const handleDeleteSuccess = () => {
    fetchPosts();
    toast.success('Update post list successfully');
  };

  const handlePageChange = (page: number) => {
    console.log(page);
    setCurrentPage(page);
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
          <PaginationCustom totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

export default DashPost;
