import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import axiosInstance from '@/api/axiosInstance';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { BulletList } from '@tiptap/extension-bullet-list';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import { Label } from '@/components/ui/label';
import Heading from '@tiptap/extension-heading';
import { useTitle } from '@/hooks';

type TextAlign = 'left' | 'center' | 'right' | 'justify' | null;

interface CategoryType {
  id: string;
  name: string;
}

interface TagType {
  id: string;
  name: string;
}

interface PostData {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: CategoryType;
  tags: TagType[];
  contents: JSONContent[];
}

interface ApiResponse {
  status: number;
  message: string;
  data: PostData;
}

interface HeadingItem {
  id: string;
  level: number;
  text: string;
  children?: HeadingItem[];
}

const PostDetails: React.FC = () => {
  const [post, setPost] = useState<PostData | null>(null);
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const { slug } = useParams<{ slug: string }>();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Set page title
  useTitle(post?.title || 'Loading...');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get<ApiResponse>(`/posts/s/${slug}`);
        setPost(response.data.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [slug]);

  const generateId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const extractHeadings = () => {
    if (!contentRef.current) return;

    const headingElements = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const flatHeadings: HeadingItem[] = [];

    headingElements.forEach((el, index) => {
      const level = parseInt(el.tagName.substring(1));
      const text = el.textContent || `Heading ${index + 1}`;
      const id = generateId(text);

      el.id = id;

      flatHeadings.push({
        id,
        level,
        text
      });
    });

    const rootHeadings: HeadingItem[] = [];
    const stack: HeadingItem[] = [];

    flatHeadings.forEach(heading => {
      while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
        stack.pop();
      }

      if (stack.length === 0) {
        rootHeadings.push(heading);
        stack.push(heading);
      } else {
        const parent = stack[stack.length - 1];
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(heading);
        stack.push(heading);
      }
    });

    setHeadings(rootHeadings);
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Heading.configure({
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: 'pt-5 pb-2',
          },
        }),
        Blockquote.configure({
          HTMLAttributes: {
            class: 'border-l-4 border-neutral-300 dark:border-neutral-600 pl-4',
          },
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph', 'blockquote'],
        }),
        OrderedList.configure({
          HTMLAttributes: {
            class: 'list-decimal pl-10 py-2',
          },
        }),
        BulletList.configure({
          HTMLAttributes: {
            class: 'list-disc pl-10 py-2',
          },
        }),
        CodeBlock.configure({
          HTMLAttributes: {
            class: 'w-full bg-neutral-200 dark:bg-neutral-700 p-3 rounded-sm',
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: 'w-full my-5 border',
            allowBase64: true,
          },
        }),
        Underline,
      ],
      content: post?.contents[0],
      editorProps: {
        attributes: {
          class: "h-full w-full"
        }
      },
      editable: false,
    },
    [post?.contents[0]]
  );

  useEffect(() => {
    if (editor && post) {
      const timer = setTimeout(() => {
        extractHeadings();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [editor, post]);

  const RenderHeadingItems = ({ items }: { items: HeadingItem[] }) => {
    return (
      <ul className="m-0 list-none flex flex-col gap-2">
        {items.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`inline-block no-underline transition-colors hover:text-foreground ${heading.level === 1 ? 'font-medium text-foreground' : 'text-muted-foreground'
                }`}
              onClick={(e) => {
                e.preventDefault();
                scrollToHeading(heading.id);
              }}
            >
              {heading.text}
            </a>
            {heading.children && heading.children.length > 0 && (
              <ul className="m-0 list-none pl-4">
                {heading.children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={`#${child.id}`}
                      className={`inline-block no-underline transition-colors hover:text-foreground ${child.level <= 2 ? 'font-medium text-foreground' : 'text-muted-foreground'
                        }`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToHeading(child.id);
                      }}
                    >
                      {child.text}
                    </a>
                    {child.children && child.children.length > 0 && (
                      <RenderHeadingItems items={child.children} />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full h-full max-w-6xl mx-auto grid grid-cols-12 gap-4 p-2">
      <div className="col-span-12 lg:col-span-8 border-x border-dashed p-5" ref={contentRef}>
        <Label className="text-3xl font-semibold mb-3" style={{ fontFamily: `"M PLUS Rounded 1c", sans-serif` }}>{post?.title}</Label>
        <div className="flex gap-2">
          {post?.tags.map((tag) => (
            <div key={tag.id} className="text-sm min-w-16 text-center text-gray-500 border rounded-md px-2 bg-gray-200 dark:bg-neutral-800">{tag.name}</div>
          ))}
        </div>
        <EditorContent editor={editor} />
      </div>
      <div className="col-span-4 hidden lg:block border-e border-dashed p-5">
        <div className="sticky top-20 space-y-2">
          <p className="font-medium">On This Page</p>
          {headings.length > 0 ? (
            <RenderHeadingItems items={headings} />
          ) : (
            <p className="text-muted-foreground text-sm">No Table of Contents</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
