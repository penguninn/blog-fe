import { useEffect, useRef, useState, useCallback } from "react";
import CardPost from "@/components/card-post-home.tsx";
import { postService } from "@/services/postService";
import { useTitle } from "@/hooks";
import { toast } from "sonner";
import type { ContentBlock, Post, PaginatedResponse } from "@/types";
import { normalizeEnvelope } from "@/utils/apiHelpers";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type PostType = Pick<
  Post,
  "id" | "title" | "slug" | "authorName" | "views" | "createdDate"
> & {
  contents?: ContentBlock[];
  category?: { id: string; name: string };
};

// Skeleton component cho loading state
const CardPostSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[200px] w-full rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-3 w-[150px]" />
    </div>
  </div>
);

const Home = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] =
    useState<boolean>(false);

  // Refs
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const fetchingRef = useRef<boolean>(false);

  // Constants
  const INITIAL_PAGE_SIZE = 6; // Ban đầu chỉ load 6 posts
  const PAGE_SIZE = 9; // Các lần load tiếp theo load 9 posts
  const INTERSECTION_THRESHOLD = 0.1;
  const INTERSECTION_ROOT_MARGIN = "100px";

  useTitle("Home");

  // Fetch posts function
  const fetchPosts = useCallback(
    async (pageNum: number, isInitial: boolean = false) => {
      // Prevent duplicate fetches
      if (fetchingRef.current || (!isInitial && !hasMore)) return;

      fetchingRef.current = true;
      setLoading(true);

      try {
        const res = await postService.getAll({
          page: pageNum,
          size: isInitial ? INITIAL_PAGE_SIZE : PAGE_SIZE,
          sortBy: "CREATED_AT",
          direction: "DESC",
        });

        const data = normalizeEnvelope<PaginatedResponse<Post>>(
          res.data as
            | PaginatedResponse<Post>
            | import("@/types").ApiEnvelope<PaginatedResponse<Post>>
        );

        if (data && Array.isArray(data.contents)) {
          const newPosts = data.contents as unknown as PostType[];

          // Check if we have more data
          const totalElements = data.totalElements || 0;
          const currentTotal = isInitial
            ? INITIAL_PAGE_SIZE
            : INITIAL_PAGE_SIZE + (pageNum - 1) * PAGE_SIZE;
          setHasMore(currentTotal < totalElements);

          // Append new posts (avoid duplicates)
          setPosts((prev) => {
            if (isInitial) return newPosts;
            const existingIds = new Set(prev.map((p) => p.id));
            const uniqueNewPosts = newPosts.filter(
              (p) => !existingIds.has(p.id)
            );
            return [...prev, ...uniqueNewPosts];
          });

          // Update page number for next fetch
          if (!isInitial) {
            setPage(pageNum + 1);
          }
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        toast.error("Failed to load posts");
        setHasMore(false);
      } finally {
        setLoading(false);
        setInitialLoading(false);
        fetchingRef.current = false;
      }
    },
    [hasMore]
  );

  // Initial load - chỉ load 6 posts
  useEffect(() => {
    fetchPosts(1, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Setup Intersection Observer (chỉ khi infinite scroll được enable)
  useEffect(() => {
    if (!infiniteScrollEnabled) {
      // Cleanup observer nếu infinite scroll bị disable
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      return;
    }

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          fetchPosts(page);
        }
      },
      {
        threshold: INTERSECTION_THRESHOLD,
        rootMargin: INTERSECTION_ROOT_MARGIN,
      }
    );

    // Observe the load more element
    if (loadMoreRef.current && hasMore) {
      observerRef.current.observe(loadMoreRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [page, hasMore, loading, fetchPosts, infiniteScrollEnabled]);

  // Handler cho Browse More button
  const handleBrowseMore = useCallback(() => {
    setInfiniteScrollEnabled(true);
    setPage(2); // Start from page 2 since we already loaded initial posts

    // Fetch immediately when button is clicked
    fetchPosts(2);
  }, [fetchPosts]);

  // Scroll to top button
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Render loading skeletons
  const renderSkeletons = (count: number) => (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <CardPostSkeleton key={`skeleton-${index}`} />
      ))}
    </>
  );

  return (
    <div className="w-full flex flex-col justify-start items-center overflow-hidden">
      <div className="w-full max-w-7xl flex flex-col pt-10 items-center justify-center px-8">
        <div className="w-full">
          {/* Initial loading state */}
          {initialLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {renderSkeletons(INITIAL_PAGE_SIZE)}
            </div>
          ) : posts.length === 0 ? (
            <div className="w-full py-20 text-center text-muted-foreground">
              No posts found
            </div>
          ) : (
            <>
              {/* Posts grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    categoryUrl={
                      post.category
                        ? `/category/${post.category.id}`
                        : undefined
                    }
                  />
                ))}

                {/* Loading skeletons for new posts */}
                {loading && infiniteScrollEnabled && renderSkeletons(3)}
              </div>

              {/* Browse More Button - chỉ hiển thị nếu chưa enable infinite scroll */}
              {!infiniteScrollEnabled && hasMore && (
                <div className="my-20 w-full flex justify-center">
                  <Button
                    variant="outline"
                    className="text-sm font-bold"
                    onClick={handleBrowseMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      "Browse more"
                    )}
                  </Button>
                </div>
              )}

              {/* Intersection Observer Target - chỉ hiển thị sau khi click Browse More */}
              {infiniteScrollEnabled && hasMore && (
                <div
                  ref={loadMoreRef}
                  className="w-full py-10 flex justify-center"
                  aria-label="Loading more posts"
                >
                  {loading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span>Loading more posts...</span>
                    </div>
                  ) : (
                    // Invisible trigger element
                    <div className="h-10" />
                  )}
                </div>
              )}

              {/* End of content message */}
              {!hasMore && posts.length > 0 && infiniteScrollEnabled && (
                <div className="w-full py-10 text-center">
                  <p className="text-muted-foreground mb-4">
                    You've reached the end! 🎉
                  </p>
                  <button
                    onClick={scrollToTop}
                    className="text-sm text-primary hover:underline"
                  >
                    Back to top ↑
                  </button>
                </div>
              )}

              {/* End message khi không còn posts và chưa enable infinite scroll */}
              {!hasMore && posts.length > 0 && !infiniteScrollEnabled && (
                <div className="my-20 w-full text-center text-muted-foreground">
                  No more posts available
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
