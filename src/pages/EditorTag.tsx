import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import { useTitle } from "@/hooks";

interface ApiResponse {
  status: number;
  message?: string;
  data?: unknown;
}

interface Tag {
  name: string;
}

const TagEditor: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useTitle(id ? "Edit tag" : "Create new tag");

  useEffect(() => {
    if (id) {
      const fetchTag = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get<ApiResponse>(`/tags/${id}`);
          if (response.data.status === 200 && response.data.data) {
            const tagData = response.data.data as Tag;
            setName(tagData.name);
          } else {
            toast.error("Cannot load tag information");
            navigate("/admin/tags");
          }
        } catch (err) {
          console.error("Error details:", err);
          toast.error("An error occurred when loading tag information");
          navigate("/admin/tags");
        } finally {
          setLoading(false);
        }
      };

      fetchTag();
    }
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter the tag name");
      return;
    }

    setLoading(true);
    const tagData = {
      name: name.trim(),
    };

    try {
      if (id) {
        const response = await axiosInstance.put<ApiResponse>(
          `/tags/${id}`,
          tagData
        );
        if (response.data.status === 200) {
          toast.success("Tag updated successfully");
        } else {
          toast.error(response.data.message || "Cannot update tag");
          setLoading(false);
          return;
        }
      } else {
        const response = await axiosInstance.post<ApiResponse>(
          "/tags",
          tagData
        );
        if (response.data.status === 201 || response.data.status === 200) {
          toast.success("Tag created successfully");
        } else {
          toast.error(response.data.message || "Cannot create tag");
          setLoading(false);
          return;
        }
      }

      navigate("/admin/tags");
    } catch (err) {
      console.error("Error details:", err);
      toast.error("An error occurred when saving the tag");
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Edit tag" : "Create new tag"}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Tag name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="rounded-sm focus-visible:ring-0"
            disabled={loading}
            required
          />
        </div>
        <Button variant="outline" type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : "Save"}
        </Button>
      </form>
    </>
  );
};

export default TagEditor;
