import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "@/services/categoryService";
import type { Category } from "@/types";
import { normalizeEnvelope } from "@/utils/apiHelpers";

const Footer = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await categoryService.getAll();
        const data = normalizeEnvelope<Category[]>(
          res.data as Category[] | import("@/types").ApiEnvelope<Category[]>
        );
        if (mounted && Array.isArray(data)) setCategories(data);
      } catch {
        // silent fail in footer
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-full  flex flex-col justify-center items-center py-10 mt-10 bg-[var(--footer)] text-[var(--footer-foreground)]">
      <span className="flex px-5 text-center justify-center items-center text-sm text-stone-500 mb-5">
        This blog shares information about technology, programming and more.
      </span>
      {categories.length > 0 ? (
        <div className="w-full flex flex-wrap gap-x-3 gap-y-2 items-center justify-center mb-3">
          <Link
            to={`/`}
            className="dark:text-stone-300 text-neutral-700 hover:text-pink-600 hover:underline transition-colors text-sm"
          >
            Home
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="dark:text-stone-300 text-neutral-700 hover:text-pink-600 hover:underline transition-colors text-sm"
            >
              {cat.name}
            </Link>
          ))}
          <a
            className="dark:text-stone-300 text-neutral-700 hover:text-pink-600 hover:underline transition-colors text-sm"
            href="https://pengunin.me"
            target="_blank"
          >
            About
          </a>
        </div>
      ) : null}
      <div className="list-none flex gap-2 mb-2">
        <div className="list-item">
          <a
            className="inline-block"
            href="mailto:davidmva200x@gmail.com"
            target="_blank"
          >
            <button
              data-slot="button"
              className="whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:hover:bg-accent/50 h-9 px-4 py-2 has-[&gt;svg]:px-3 flex items-center justify-center gap-3 cursor-pointer text-lg dark:text-stone-300 text-neutral-700 hover:text-pink-600 hover:underline hover:bg-transparent"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"></path>
              </svg>
            </button>
          </a>
        </div>
        <div className="list-item">
          <a
            className="inline-block"
            href="https://www.linkedin.com/in/david200x/"
            target="_blank"
          >
            <button
              data-slot="button"
              className="whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:hover:bg-accent/50 h-9 px-4 py-2 has-[&gt;svg]:px-3 flex items-center justify-center gap-3 cursor-pointer text-lg dark:text-stone-300 text-neutral-700 hover:text-pink-600 hover:underline hover:bg-transparent"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 448 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
              </svg>
            </button>
          </a>
        </div>
        <div className="list-item">
          <a
            className="inline-block"
            href="https://x.com/david200x_"
            target="_blank"
          >
            <button
              data-slot="button"
              className="whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:hover:bg-accent/50 h-9 px-4 py-2 has-[&gt;svg]:px-3 flex items-center justify-center gap-3 cursor-pointer text-lg dark:text-stone-300 text-neutral-700 hover:text-pink-600 hover:underline hover:bg-transparent"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
              </svg>
            </button>
          </a>
        </div>
        <div className="list-item">
          <a
            className="inline-block"
            href="https://github.com/penguninn"
            target="_blank"
          >
            <button
              data-slot="button"
              className="whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:hover:bg-accent/50 h-9 px-4 py-2 has-[&gt;svg]:px-3 flex items-center justify-center gap-3 cursor-pointer text-lg dark:text-stone-300 text-neutral-700 hover:text-pink-600 hover:underline hover:bg-transparent"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 496 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
              </svg>
            </button>
          </a>
        </div>
      </div>
      <span className="flex justify-center items-center text-sm text-neutral-500 font-semibold">
        © 2025 Mac Vu Anh Dai. All Rights Reserved.
      </span>
    </div>
  );
};
export default Footer;
