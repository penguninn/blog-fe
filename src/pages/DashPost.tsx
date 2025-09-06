import { useEffect, useState } from "react";
import ItemPost from "@/components/item-post";
import { postService } from "@/services/postService";
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

const DashPost: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useTitle("Quản lý bài viết");

  const fetchPosts = async () => {
    try {
      const page = Math.max(currentPage, 1);
      const res = await postService.getAll({
        page,
        size: 5,
        sortBy: "CREATED_AT",
        direction: "DESC",
      });
      const payload = (res as any).data?.data || (res as any).data || res;
      const data = payload.data ? payload.data : payload;
      if (data && data.contents) {
        setPosts(data.contents);
        setTotalPages(data.totalPages ?? 0);
      }
    } catch (err) {
      console.error("Error when loading post list:", err);
      toast.error("Cannot load post list");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const handleDeleteSuccess = () => {
    fetchPosts();
    toast.success("Update post list successfully");
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">Post List</h1>
      <div className="flex justify-end mb-4">
        <Button variant="outline" asChild>
          <Link to="/admin/posts/create" className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> Create new post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-md">
          <p className="text-gray-500 mb-4">No post yet</p>
          <Button variant="outline" asChild>
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
              tags={post.tags}
              onDeleteSuccess={handleDeleteSuccess}
            />
          ))}
          <PaginationCustom
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default DashPost;
