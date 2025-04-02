import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Blockquote from '@tiptap/extension-blockquote';
import EditorMenuBar from '@/components/editor-menu-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import CodeBlock from '@tiptap/extension-code-block';
import Image from '@tiptap/extension-image';
import axios from 'axios';
import { Select, SelectValue, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import Heading from '@tiptap/extension-heading';
import { MultiSelect } from '@/components/multi-select';

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
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<CategoryType | undefined>();
  const [categories, setCategories] = useState<Array<CategoryType>>([]);
  const [tagOptions, setTagOptions] = useState<Array<TagOption>>([]);
  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);
  const [status, setStatus] = useState<string>('PUBLISHED');
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const editor = useEditor({
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
          class: 'bg-neutral-700 p-2 rounded-md',
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
    content: '',
    editorProps: {
      attributes: {
        class: "min-h-[550px] cursor-text rounded-sm border p-3"
      }
    },
    editable: true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<ApiResponse<CategoryType[]>>('http://localhost:8080/api/categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Cannot fetch categories');
      }
    };  
    fetchCategories();
  }, []);

  useEffect(() => {   
    const fetchTags = async () => {
      try {
        const response = await axios.get<ApiResponse<TagType[]>>('http://localhost:8080/api/tags');
        setTagOptions(response.data.data.map(tag => ({
          label: tag.name,
          value: tag.id
        })));
      } catch (error) {
        console.error('Error fetching tags:', error);
        toast.error('Cannot fetch tags');
      }
    };
    fetchTags();
  }, []);
  

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await axios.get<ApiResponse<PostType>>(`http://localhost:8080/api/posts/i/${id}`);
          const post = response.data.data;
          
          setTitle(post.title);
          setStatus(post.status);
          setCategory(post.category);
          setSelectedTags(post.tags.map(tag => tag.id));
          
          if (post.contents && post.contents.length > 0) {
            editor?.commands.setContent(post.contents[0]);
          }
          
        } catch (error) {
          console.error('Error fetching post:', error);
          toast.error('Cannot fetch post');
        }
      };
      fetchPost();
    }
  }, [id, editor]);

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    if (selectedCategory) {
      setCategory(selectedCategory);
    }
  };

  const handleStatusChange = (status: string) => {
    setStatus(status);
  };

  const createSlugFromTitle = (title: string): string => {
    const slugFromTitle = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    
    if (!id) {
      const timestamp = Date.now().toString();
      return `${slugFromTitle}-${timestamp}`;
    }
    return slugFromTitle;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const currentContent = editor?.getJSON();
      const postData = {
        title: title,
        slug: createSlugFromTitle(title),
        status: status,
        category: category,
        tags: tagOptions.filter(tag => selectedTags.includes(tag.value) ).map(tag => ({
          id: tag.value,
          name: tag.label
        })),
        contents: [
          {
            type: "doc",
            content: currentContent?.content
          }
        ]
      };

      if (id) {
        await axios.put(`http://localhost:8080/api/posts/${id}`, postData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        toast.success('Update post successfully');
      } else {
        await axios.post('http://localhost:8080/api/posts', postData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        toast.success('Create new post successfully');
      }
      navigate('/admin/posts');
      
    } catch (err) {
      console.error('Error details:', err);
      toast.error('An error occurred when saving the post');
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        {id ? 'Edit post' : 'Create new post'}
      </h1>
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
        <div className='mb-4'>
          <MultiSelect
            options={tagOptions}
            onValueChange={setSelectedTags}
            value={selectedTags}
            placeholder="Select tags"
            animation={2}
            maxCount={10}
          />
        </div>
        <div className="mb-4 w-full flex justify-between items-center gap-3">
          <Select 
            onValueChange={handleCategoryChange} 
            value={category?.id}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {
                categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))
              }
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
              <SelectItem value="PUBLISHED">Publish</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-3 mb-4">
          <EditorMenuBar editor={editor} />
          <EditorContent editor={editor} />
        </div>
        <Button 
          type="submit" 
          className='w-full'
        >
          Save
        </Button>
      </form>
    </>
  );
};

export default EditorPost;
