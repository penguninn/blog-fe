import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
const EditorTag: React.FC = () => {
  const [name, setName] = useState<string>('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagData = {
      name: name
    }
    try {
      if (id) {
        await axios.put(`http://localhost:8080/api/tags/${id}`, tagData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
        });
        toast.success('Tag updated successfully');
      } else {
        await axios.post('http://localhost:8080/api/tags', tagData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
        });
        toast.success('Tag created successfully');
      }
      navigate('/admin/tags');
      toast.success('Update tag list successfully');
    } catch (err) {     
      console.error('Error details:', err);
      toast.error('An error occurred when saving the post');
    }
  };
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        {id ? 'Edit tag' : 'Create new tag'}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Tag name"
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

export default EditorTag;