import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const CreateCategory: React.FC = () => {
  const [name, setName] = useState<string>('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData = {
      name: name
    }
    try {
      if (id) {
        await axios.put(`http://localhost:8080/api/categories/${id}`, categoryData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        toast.success('Category updated successfully');
      } else {
        await axios.post('http://localhost:8080/api/categories', categoryData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        toast.success('Category created successfully');
      }
      navigate('/admin/categories');
      toast.success('Update category list successfully');
    } catch (err) {     
      console.error('Error details:', err);
      toast.error('An error occurred when saving the post');
    }
  };
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        {id ? 'Edit category' : 'Create new category'}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Category name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="rounded-sm focus-visible:ring-0"
            required
          />
        </div>
        <Button type="submit" className="w-full">Save</Button>
      </form>
    </>
    );
  };

export default CreateCategory;
