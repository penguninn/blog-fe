import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useEditor, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { postService } from "@/services/postService";
import type { ApiEnvelope, Post } from "@/types";
import { normalizeEnvelope } from "@/utils/apiHelpers";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { BulletList } from "@tiptap/extension-bullet-list";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import { Label } from "@/components/ui/label";
import Heading from "@tiptap/extension-heading";
import { useTitle } from "@/hooks";
import { rehype } from "rehype";
import rehypeToc from "@jsdevtools/rehype-toc";
import rehypeSlug from "rehype-slug";

type PostData = Post & { contents: JSONContent[] };

const PostDetails: React.FC = () => {
  const [post, setPost] = useState<PostData | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const [contentHtml, setContentHtml] = useState<string>("");
  const [tocHtml, setTocHtml] = useState<string>("");
  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);

  useTitle(post?.title || "Loading...");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await postService.getBySlug(slug!);
        const data = normalizeEnvelope<Post>(
          res.data as Post | ApiEnvelope<Post>
        );
        setPost(data as PostData);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [slug]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: false,
          blockquote: false,
          orderedList: false,
          bulletList: false,
          codeBlock: false,
        }),
        Heading.configure({
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: "pt-5 pb-2",
          },
        }),
        Blockquote.configure({
          HTMLAttributes: {
            class: "border-l-4 border-neutral-300 dark:border-neutral-600 pl-4",
          },
        }),
        TextAlign.configure({
          types: ["heading", "paragraph", "blockquote"],
        }),
        OrderedList.configure({
          HTMLAttributes: {
            class: "list-decimal pl-10 py-2",
          },
        }),
        BulletList.configure({
          HTMLAttributes: {
            class: "list-disc pl-10 py-2",
          },
        }),
        CodeBlock.configure({
          HTMLAttributes: {
            class: "w-full bg-neutral-200 dark:bg-neutral-700 p-3 rounded-sm",
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: "w-full my-5 border",
            allowBase64: true,
          },
        }),
        Underline,
      ],
      content: post?.contents[0],
      editorProps: {
        attributes: {
          class: "h-full w-full",
        },
      },
      editable: false,
    },
    [post?.contents[0]]
  );

  useEffect(() => {
    const buildHtml = async () => {
      if (!post || !editor) return;
      try {
        const htmlContent = editor.getHTML();
        const processed = await rehype()
          .use(rehypeSlug)
          .use(rehypeToc, {
            headings: ["h1", "h2", "h3", "h4"],
            cssClasses: {
              toc: "table-of-contents",
              list: "toc-list",
              listItem: "toc-item",
              link: "toc-link",
            },
          })
          .process(htmlContent);
        const html = String(processed);
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const tocEl = doc.querySelector(".table-of-contents");
        if (tocEl) {
          setTocHtml(tocEl.outerHTML);
          tocEl.remove();
        } else {
          setTocHtml("");
        }
        setContentHtml(doc.body.innerHTML);
      } catch (e) {
        console.error("Error generating TOC:", e);
        setContentHtml(editor.getHTML());
        setTocHtml("");
      }
    };
    buildHtml();
  }, [editor, post]);

  // No extra TOC behavior; keep previous layout. Render a mobile TOC below category.

  const createdAtIso = post?.createdDate || post?.publishedAt || null;
  const createdAtLabel = createdAtIso
    ? (() => {
        const d = new Date(createdAtIso);
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
      })()
    : undefined;

  return (
    <div className="w-full h-full container mx-auto grid grid-cols-12 gap-4 p-2">
      <div className="flex flex-col items-center col-span-12 xl:col-span-9 border-x border-dashed border-neutral-300 p-5">
        <Label
          className="text-3xl font-extrabold mb-3 text-center"
          style={{ fontFamily: `"M PLUS Rounded 2c", sans-serif` }}
        >
          {post?.title}
        </Label>
        {post?.authorName ? (
          <div className="blog-article-card-author-strip mb-4 flex flex-row flex-wrap items-center">
            <div className="flex flex-col items-center leading-snug">
              {post?.authorName ? (
                <div className="blog-article-card-author-name mb-1 block text-lg font-bold text-slate-700 dark:text-slate-400">
                  {post.authorName}
                </div>
              ) : null}
              {typeof post?.views === "number" || createdAtLabel ? (
                <div className="blog-article-card-article-meta flex flex-row text-sm">
                  <p className="text-slate-500 dark:text-slate-400 flex flex-row items-center">
                    {typeof post?.views === "number" ? (
                      <span className="flex flex-row items-center">
                        <svg
                          className="mr-2 h-4 w-4 fill-current"
                          viewBox="0 0 512 512"
                          aria-hidden
                        >
                          <path d="M507.8 37.24c6 6.54 5.5 16.65-1 22.6l-176 159.96c-6.4 5.8-16.1 5.6-22.1-.5L190.4 100.1 25.41 220.9c-7.15 5.2-17.152 3.7-22.349-3.5-5.198-7.1-3.617-17.1 3.529-22.3L182.6 67.06c5.5-4.63 15.1-3.94 20.7 1.63L320.5 185.9 485.2 36.16c6.6-5.94 16.7-5.46 22.6 1.08zM112 368v64c0 26.5-21.49 48-48 48s-48-21.5-48-48v-64c0-26.5 21.49-48.9 48-48.9s48 22.4 48 48.9zm-32 64v-64c0-8.8-7.16-16-16-16s-16 7.2-16 16v64c0 8.8 7.16 16 16 16s16-7.2 16-16zm64-160.9c0-25.6 21.5-48 48-48s48 22.4 48 48V432c0 26.5-21.5 48-48 48s-48-21.5-48-48V271.1zm48-16c-8.8 0-16 8.1-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V271.1c0-7.9-7.2-16-16-16zM368 336v96c0 26.5-21.5 48-48 48s-48-21.5-48-48v-96c0-26.5 21.5-48.9 48-48.9s48 22.4 48 48.9zm-32 96v-96c0-8.8-7.2-16.9-16-16.9s-16 8.1-16 16.9v96c0 8.8 7.2 16 16 16s16-7.2 16-16zm64-160.9c0-25.6 21.5-48 48-48s48 22.4 48 48V432c0 26.5-21.5 48-48 48s-48-21.5-48-48V271.1zm48-16c-8.8 0-16 8.1-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V271.1c0-7.9-7.2-16-16-16z" />
                        </svg>
                        <span>{post.views} views</span>
                      </span>
                    ) : null}
                    {typeof post?.views === "number" && createdAtLabel ? (
                      <span className="mx-2">•</span>
                    ) : null}
                    {createdAtLabel ? (
                      <time dateTime={createdAtIso || undefined}>
                        {createdAtLabel}
                      </time>
                    ) : null}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {post?.category?.name ? (
          <div className="mb-5 block">
            {post?.category?.id ? (
              <Link
                to={`/category/${post.category.id}`}
                className="border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 inline-flex items-center font-medium rounded-md text-xs px-2 py-1 bg-sky-100 dark:bg-primary-400 dark:bg-opacity-10 text-sky-600 dark:text-sky-300 ring-1 ring-inset ring-primary-500 dark:ring-primary-400 ring-opacity-25 dark:ring-opacity-25"
              >
                {post.category.name}
              </Link>
            ) : (
              <span className="border inline-flex items-center font-medium rounded-md text-xs px-2 py-1 bg-sky-100 dark:bg-primary-400 dark:bg-opacity-10 text-sky-600 dark:text-sky-300 ring-1 ring-inset ring-primary-500 dark:ring-primary-400 ring-opacity-25 dark:ring-opacity-25">
                {post.category.name}
              </span>
            )}
          </div>
        ) : null}
        {/* Mobile TOC for <xl screens: collapsible */}
        {tocHtml ? (
          <div className="w-full xl:hidden mb-4">
            <div className="mobile-toc">
              <button
                type="button"
                className="mobile-toc-header"
                aria-expanded={mobileTocOpen}
                aria-controls="mobile-toc-content"
                onClick={() => setMobileTocOpen((v) => !v)}
              >
                <span className="mobile-toc-title">On this page</span>
                <span
                  className={`mobile-toc-arrow ${mobileTocOpen ? "expanded" : ""}`}
                  aria-hidden
                />
              </button>
              <div
                id="mobile-toc-content"
                className={`mobile-toc-content ${mobileTocOpen ? "expanded" : "collapsed"}`}
              >
                <div
                  className="mobile-toc-inner"
                  dangerouslySetInnerHTML={{ __html: tocHtml }}
                />
              </div>
            </div>
          </div>
        ) : null}
        <div
          className="w-full"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
      <div className="col-span-3 hidden xl:block border-e border-dashed p-5">
        <div className="sticky top-20 space-y-2">
          <span className="font-bold text-xl m-2 text-neutral-500">On this page</span>
          {tocHtml ? (
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: tocHtml }}
            />
          ) : (
            <p className="text-muted-foreground text-sm">
              No Table of Contents
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
