import { Button } from "@/components/ui/button";
import axios from "axios";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
const DashCategory: React.FC = () => {

  interface CategoryType {
    id: string;
    name: string;
  }

  interface ApiResponse {
    status: number;
    message: string;
    data: CategoryType[];
  }

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryType>();

  const fetchCategories = async () => {
    try {
      const response = await axios.get<ApiResponse>('http://localhost:8080/api/categories', {
        headers: {
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (response.data) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/categories/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      toast.success('Category deleted successfully');
      fetchCategories();
      toast.success('Update category list successfully');
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error('Error deleting category');
    }
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">Category List</h1>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link to="/admin/categories/create" className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> Create new category
          </Link>
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-md">
          <p className="text-gray-500 mb-4">No category yet</p>
          <Button asChild>
            <Link to="/admin/categories/create">Create new category</Link>
          </Button>
        </div>
      ) : (
        <div className="">
          <Table>
            <TableCaption>List of categories.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Link to={`/admin/categories/${category.id}/edit`}>
                      <Button variant="outline" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon" onClick={() => {
                      setCategoryToDelete(category);
                      setIsDeleteDialogOpen(true);
                    }}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {categoryToDelete && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The category "{categoryToDelete.name}" will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(categoryToDelete.id)}
              className="bg-red-500 hover:bg-red-600 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default DashCategory;

