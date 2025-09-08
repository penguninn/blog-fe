import { useEffect, useState } from "react";
import CardPost from "@/components/card-post-home.tsx";
import axiosInstance from "@/api/axiosInstance";
import { postService } from "@/services/postService";
import type { PaginatedResponse, Post } from "@/types";
import type { AxiosResponse } from "axios";
import { normalizeEnvelope } from "@/utils/apiHelpers";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocation, useParams } from "react-router-dom";
import { PaginationCustom } from "@/components/pagination-custom";
import { useTitle } from "@/hooks";
import { toast } from "sonner";

import type { ContentBlock } from "@/types";

type PostType = Pick<
    Post,
    "id" | "title" | "slug" | "authorName" | "views" | "createdDate"
> & {
    contents?: ContentBlock[];
    category: { id: string; name: string };
};

const ListPost = () => {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const location = useLocation();
    const { id } = useParams<{ id: string }>();

    useTitle(title);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const page = Math.max(currentPage, 1);
                let loader: Promise<AxiosResponse<PaginatedResponse<Post>>> =
                    postService.getAll({ page, size: 10 });

                if (location.pathname.includes("/posts/new-posts")) {
                    loader = postService.getAll({
                        page,
                        size: 10,
                        sortBy: "CREATED_AT",
                        direction: "DESC",
                    });
                    setTitle("New posts");
                } else if (location.pathname.includes("/category/") && id) {
                    loader = postService.getByCategory(id, {
                        page,
                        size: 10,
                        sortBy: "TITLE",
                        direction: "DESC",
                    });
                    try {
                        const categoryResponse = await axiosInstance.get(
                            `/categories/${id}`
                        );
                        if (categoryResponse.data && categoryResponse.data.data) {
                            setTitle(`${categoryResponse.data.data.name}`);
                            setDescription(`${categoryResponse.data.data.description}`);
                        }
                    } catch (error) {
                        console.warn("Error fetching category:", error);
                    }
                }

                const res = await loader;
                const data = normalizeEnvelope<PaginatedResponse<Post>>(
                    res.data as
                    | PaginatedResponse<Post>
                    | import("@/types").ApiEnvelope<PaginatedResponse<Post>>
                );
                if (data && data.contents) {
                    setPosts(data.contents);
                    setTotalPages(data.totalPages);
                }
            } catch (err) {
                console.warn("Error fetching posts:", err);
                toast.error("Failed to load posts");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [location.pathname, id, currentPage]);

    const handlePageChange = (page: number) => setCurrentPage(page);

    return (
        <div className="w-full flex flex-col justify-start items-center overflow-hidden">
            <div className="w-full max-w-3xl flex flex-col px-10 pt-10 items-center justify-center">
                <div className="w-full flex flex-col justify-center items-center gap-4 px-2">
                    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                        <div>
                            <span className="w-full text-sm font-bold text-start text-slate-600 dark:text-slate-400">
                                CATEGORY
                            </span>
                            <Label className="w-full text-3xl font-bold mb-5 text-start">
                                {title}
                            </Label>
                        </div>
                        <div>
                            <span>{description}</span>
                        </div>
                    </div>
                    <div className="w-full my-10 flex flex-col items-center justify-center">
                        <div className="w-full border-t dark:border-slate-800"></div>
                        <p className="-mt-5 rounded-lg bg-white p-2 px-4 font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                             The articles in this category
                        </p>
                    </div>
                </div>
                {loading ? (
                    <div className="w-full py-8 text-center">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="w-full py-8 text-center">No posts found</div>
                ) : (
                    <div className="w-full flex flex-col gap-10">
                        {posts.map((post) => (
                            <CardPost
                                key={post.id}
                                slug={post.slug}
                                title={post.title}
                                contents={post.contents}
                                category={post.category?.name}
                                authorName={post.authorName}
                                views={post.views}
                                createdDate={post.createdDate}
                                categoryUrl={`/category/${post.category?.id}`}
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
        </div>
    );
};

export default ListPost;
