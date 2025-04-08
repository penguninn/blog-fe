import { useEffect, useState } from "react";
import CardPost from "@/components/card-post";
import axiosInstance from "@/api/axiosInstance";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocation, useParams } from "react-router-dom";
import { PaginationCustom } from "@/components/pagination-custom";

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

const ListPost = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [title, setTitle] = useState<string>("All posts");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let endpoint = `/posts?page=${currentPage}&size=10`;
        
        if (location.pathname.includes('/posts/top-posts')) {
          endpoint = `/posts?page=${currentPage}&size=10&sort=view,desc`;
          setTitle("Top posts");
        } else if (location.pathname.includes('/posts/new-posts')) {
          endpoint = `/posts?page=${currentPage}&size=10&sort=createdDate,desc`;
          setTitle("New posts");
        } else if (location.pathname.includes('/category/') && id) {
          endpoint = `/posts/by-category?categoryId=${id}&page=${currentPage}&size=10&sort=title,desc`;
          try {
            const categoryResponse = await axiosInstance.get(`/categories/${id}`);
            if (categoryResponse.data && categoryResponse.data.data) {
              setTitle(`Category: ${categoryResponse.data.data.name}`);
            }
          } catch (error) {
            console.error('Error fetching category:', error);
          }
        } else if (location.pathname.includes('/tag/') && id) {
          endpoint = `/posts/by-tag?tagId=${id}&page=${currentPage}&size=10&sort=title,desc`;
          try {
            const tagResponse = await axiosInstance.get(`/tags/${id}`);
            if (tagResponse.data && tagResponse.data.data) {
              setTitle(`Tag: ${tagResponse.data.data.name}`);
            }
          } catch (error) {
            console.error('Error fetching tag:', error);
          }
        }

        const response = await axiosInstance.get<ApiResponse<PostType[]>>(`http://localhost:8080/api${endpoint}`);
        if (response.data && response.data.data) {
          setPosts(response.data.data.contents);
          setTotalPages(response.data.data.totalPages);
          setCurrentPage(response.data.data.page + 1);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
    
    fetchPosts();
  }, [location.pathname, id, currentPage]);

  const handlePageChange = (page: number) => {
    console.log(page);
    setCurrentPage(page);
  };

  return (
    <div className="w-full flex flex-col justify-start items-center overflow-hidden">
      <div className="w-full max-w-5xl flex flex-col pt-10 items-center justify-center px-4">
        <div className="w-full flex justify-between items-center gap-4 px-2">
          <Label className="w-full text-3xl font-bold mb-5 text-start">{title}</Label>
          <div className="w-full">
            <Separator className="w-full" />
          </div>
        </div>
        {posts.length === 0 ? (
          <div className="w-full py-8 text-center">No posts</div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            {posts.map((post) => (
              <CardPost
                key={post.id}
                slug={post.slug}
                title={post.title}
                description={"No description"}
                tags={post.tags}
              />
            ))}
            <PaginationCustom totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListPost;
