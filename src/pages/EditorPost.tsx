import React, { useState, useEffect } from "react";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Blockquote from "@tiptap/extension-blockquote";
import EditorMenuBar from "@/components/editor-menu-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import CodeBlock from "@tiptap/extension-code-block";
// import Image from "@tiptap/extension-image";
import { UploadImage } from "@/editor/extensions/UploadImage";
import axiosInstance from "@/api/axiosInstance";
import { assetService } from "@/services/assetService";
import { postService } from "@/services/postService";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import Heading from "@tiptap/extension-heading";
import { MultiSelect } from "@/components/multi-select";
import { useTitle } from "@/hooks";

interface CategoryType {
  id: string;
  name: string;
}

interface TagType {
  id: string;
  name: string;
}

interface TagOption {
  label: string;
  value: string;
}

interface PostContent {
  type: string;
  content: JSONContent[];
}

interface PostType {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: CategoryType;
  tags: TagType[];
  contents: PostContent[];
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

const EditorPost: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<CategoryType>();
  const [categories, setCategories] = useState<Array<CategoryType>>([]);
  const [tagOptions, setTagOptions] = useState<Array<TagOption>>([]);
  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);
  const [status, setStatus] = useState<string>("PUBLISHED");

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useTitle(id ? "Edit post" : "Create new post");

  const editor = useEditor({
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
          class: "bg-neutral-300 dark:bg-neutral-700 p-2 rounded-md",
        },
      }),
      UploadImage.configure({
        HTMLAttributes: {
          class: "w-full my-5 border rounded-sm overflow-hidden",
        },
        upload: async (file, onProgress) => {
          return assetService.uploadImage(file, { onProgress });
        },
      }),
      Underline,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "min-h-[550px] cursor-text rounded-sm border p-3",
      },
    },
    editable: true,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const categoriesResponse =
          await axiosInstance.get<ApiResponse<CategoryType[]>>("/categories");
        setCategories(categoriesResponse.data.data);

        const tagsResponse =
          await axiosInstance.get<ApiResponse<TagType[]>>("/tags");
        const options = tagsResponse.data.data.map((tag) => ({
          label: tag.name,
          value: tag.id,
        }));
        setTagOptions(options);

        if (id) {
          const postResponse = await postService.getById(id);
          const payload =
            (postResponse as any).data?.data ||
            (postResponse as any).data ||
            postResponse;
          const post: PostType = payload.data ? payload.data : payload;

          setTitle(post.title);
          setStatus(post.status);
          setCategory(post.category);

          const tagIds = post.tags.map((tag) => tag.id);
          setSelectedTags(tagIds);

          if (post.contents && post.contents.length > 0) {
            editor?.commands.setContent(post.contents[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Cannot load initial data");
      }
    };

    fetchInitialData();
  }, [id, editor]);

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find((cat) => cat.id === categoryId);
    if (selectedCategory) {
      setCategory(selectedCategory);
    }
  };

  const handleStatusChange = (status: string) => {
    setStatus(status);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const currentContent = editor?.getJSON();
      const postData: any = {
        title: title,
        excerpt: undefined,
        status: status,
        categoryId: category?.id,
        tagIds: selectedTags,
        contents: [
          {
            type: "doc",
            content: currentContent?.content,
          },
        ],
      };

      if (id) {
        await postService.update(id, postData);
        toast.success("Update post successfully");
      } else {
        postData.slug = null;
        await postService.create(postData);
        toast.success("Create new post successfully");
      }
      navigate("/admin/posts");
    } catch (err) {
      console.error("Error details:", err);
      toast.error("Error when saving post");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-sm focus-visible:ring-0"
            placeholder="Title"
            required
          />
        </div>
        <div className="mb-4">
          <MultiSelect
            options={tagOptions}
            onValueChange={setSelectedTags}
            defaultValue={selectedTags}
            value={selectedTags}
            placeholder="Select tags"
            animation={2}
            maxCount={10}
            className="border-neutral-200 dark:border-neutral-600"
          />
        </div>
        <div className="mb-4 w-full flex justify-between items-center gap-3">
          <Select onValueChange={handleCategoryChange} value={category?.id}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleStatusChange}
            defaultValue={status}
            value={status}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-3 mb-4">
          <EditorMenuBar editor={editor} />
          <EditorContent editor={editor} />
        </div>
        <Button variant="outline" type="submit" className="w-full">
          Save
        </Button>
      </form>
    </>
  );
};

export default EditorPost;
