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

interface Category {
  name: string;
}

const CategoryEditor: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useTitle(id ? "Edit category" : "Create new category");

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get<ApiResponse>(
            `/categories/${id}`
          );
          if (response.data.status === 200 && response.data.data) {
            const categoryData = response.data.data as Category;
            setName(categoryData.name);
          } else {
            toast.error("Cannot load category information");
            navigate("/admin/categories");
          }
        } catch (err) {
          console.error("Error details:", err);
          toast.error("An error occurred when loading category information");
          navigate("/admin/categories");
        } finally {
          setLoading(false);
        }
      };

      fetchCategory();
    }
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter the category name");
      return;
    }

    setLoading(true);
    const categoryData = {
      name: name.trim(),
    };

    try {
      let response: { data: ApiResponse };

      if (id) {
        response = await axiosInstance.put<ApiResponse>(
          `/categories/${id}`,
          categoryData
        );
        if (response.data.status === 200) {
          toast.success("Category updated successfully");
        } else {
          toast.error(response.data.message || "Cannot update category");
          setLoading(false);
          return;
        }
      } else {
        response = await axiosInstance.post<ApiResponse>(
          "/categories",
          categoryData
        );
        if (response.data.status === 201 || response.data.status === 200) {
          toast.success("Category created successfully");
        } else {
          toast.error(response.data.message || "Cannot create category");
          setLoading(false);
          return;
        }
      }

      navigate("/admin/categories");
    } catch (err) {
      console.error("Error details:", err);
      toast.error("An error occurred when saving the category");
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Edit category" : "Create new category"}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Category name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="rounded-sm focus-visible:ring-0"
            disabled={loading}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : "Save"}
        </Button>
      </form>
    </>
  );
};

export default CategoryEditor;
