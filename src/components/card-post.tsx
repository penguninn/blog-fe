import { Link } from "react-router-dom";
import type { ContentBlock } from "@/types";

interface CardPostProps {
slug: string;
title: string;
imageUrl?: string;
authorAvatarUrl?: string;
category?: string;
authorName?: string;
authorUrl?: string;
categoryUrl?: string;
views?: number;
contents?: ContentBlock[] | null;
}

const CardPost = ({
slug,
title,
imageUrl: coverImageUrlProp,
authorAvatarUrl,
category: categoryLabelProp,
authorName,
authorUrl,
categoryUrl: categoryHref,
views,
contents,
}: CardPostProps) => {
// Helpers
const getFirstImageSrc = (
blocks?: ContentBlock[] | null
): string | undefined => {
if (!blocks || blocks.length === 0) return undefined;
const stack = [...blocks];
while (stack.length) {
const node = stack.shift() as ContentBlock;
// TipTap JSONContent shape: node.type and optional attrs/content
const n: any = node as any;
if (n?.type === "image" && typeof n?.attrs?.src === "string")
return n.attrs.src as string;
const children = n?.content as ContentBlock[] | undefined;
if (children && children.length) stack.unshift(...children);
}
return undefined;
};

// Derived values
const firstImageFromContent = getFirstImageSrc(contents);
const coverImageUrl = coverImageUrlProp || firstImageFromContent;
const categoryLabel = categoryLabelProp?.trim() || undefined;
const postHref = `/posts/${slug}`;
const hasViews = typeof views === "number";
const showMeta = Boolean(authorAvatarUrl || authorName || hasViews);

return (
<div className="blog-article-card col-span-1">
    <Link aria-label={`Cover photo of the article titled ${title}`}
        className="blog-article-card-cover mb-4 block w-full overflow-hidden rounded-lg border bg-slate-100 transition-all duration-300 hover:opacity-90 dark:border-slate-800 dark:bg-slate-800"
        to={postHref}>
    {coverImageUrl ? (
    <img alt={title} loading="lazy" decoding="async" className="block w-full duration-300 hover:scale-[1.05]" style={{
        color: "transparent" }} src={coverImageUrl} />
    ) : (
    <div className="block w-full aspect-[16/9] bg-slate-200 dark:bg-slate-900" />
    )}
    </Link>

    {categoryLabel ? (
    <div className="mx-4 mb-2 block">
        {categoryHref ? (
        <Link to={categoryHref}
            className="border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 inline-flex items-center font-medium rounded-md text-xs px-2 py-1 bg-sky-100 dark:bg-primary-400 dark:bg-opacity-10 text-sky-600 dark:text-sky-300 ring-1 ring-inset ring-primary-500 dark:ring-primary-400 ring-opacity-25 dark:ring-opacity-25">
        {categoryLabel}
        </Link>
        ) : (
        <span
            className="border inline-flex items-center font-medium rounded-md text-xs px-2 py-1 bg-sky-100 dark:bg-primary-400 dark:bg-opacity-10 text-sky-600 dark:text-sky-300 ring-1 ring-inset ring-primary-500 dark:ring-primary-400 ring-opacity-25 dark:ring-opacity-25">
            {categoryLabel}
        </span>
        )}
    </div>
    ) : null}

    <h1
        className="blog-article-card-title font-heading text-foreground mx-4 mb-3 block font-extrabold transition-all duration-300 hover:opacity-75 text-xl">
        <Link to={postHref}>{title}</Link>
    </h1>

    {showMeta ? (
    <div className="blog-article-card-author-strip mx-4 flex flex-row flex-wrap items-center">
        {authorAvatarUrl ? (
        <div
            className="blog-article-card-author-photo mr-2 block h-8 w-8 overflow-hidden rounded-full bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
            <img alt={authorName || "Author" } src={authorAvatarUrl} decoding="async"
                className="block h-full w-full object-cover" />
        </div>
        ) : null}
        <div className="flex flex-col items-start leading-snug">
            {authorName ? (
            authorUrl ? (
            <a className="blog-article-card-author-name mb-1 block font-semibold text-slate-700 dark:text-slate-400"
                href={authorUrl} target="_blank" rel="noreferrer">
                {authorName}
            </a>
            ) : (
            <div className="blog-article-card-author-name mb-1 block font-semibold text-slate-700 dark:text-slate-400">
                {authorName}
            </div>
            )
            ) : null}
            {hasViews ? (
            <div className="blog-article-card-article-meta flex flex-row text-sm">
                <p className="text-slate-500 dark:text-slate-400">
                    <Link className="flex flex-row items-center" to={postHref}>
                    <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 512 512" aria-hidden>
                        <path
                            d="M507.8 37.24c6 6.54 5.5 16.65-1 22.6l-176 159.96c-6.4 5.8-16.1 5.6-22.1-.5L190.4 100.1 25.41 220.9c-7.15 5.2-17.152 3.7-22.349-3.5-5.198-7.1-3.617-17.1 3.529-22.3L182.6 67.06c5.5-4.63 15.1-3.94 20.7 1.63L320.5 185.9 485.2 36.16c6.6-5.94 16.7-5.46 22.6 1.08zM112 368v64c0 26.5-21.49 48-48 48s-48-21.5-48-48v-64c0-26.5 21.49-48.9 48-48.9s48 22.4 48 48.9zm-32 64v-64c0-8.8-7.16-16-16-16s-16 7.2-16 16v64c0 8.8 7.16 16 16 16s16-7.2 16-16zm64-160.9c0-25.6 21.5-48 48-48s48 22.4 48 48V432c0 26.5-21.5 48-48 48s-48-21.5-48-48V271.1zm48-16c-8.8 0-16 8.1-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V271.1c0-7.9-7.2-16-16-16zM368 336v96c0 26.5-21.5 48-48 48s-48-21.5-48-48v-96c0-26.5 21.5-48.9 48-48.9s48 22.4 48 48.9zm-32 96v-96c0-8.8-7.2-16.9-16-16.9s-16 8.1-16 16.9v96c0 8.8 7.2 16 16 16s16-7.2 16-16zm64-160.9c0-25.6 21.5-48 48-48s48 22.4 48 48V432c0 26.5-21.5 48-48 48s-48-21.5-48-48V271.1zm48-16c-8.8 0-16 8.1-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V271.1c0-7.9-7.2-16-16-16z" />
                    </svg>
                    <span>{views} views</span>
                    </Link>
                </p>
            </div>
            ) : null}
        </div>
    </div>
    ) : null}
</div>
);
};

export default CardPost;
