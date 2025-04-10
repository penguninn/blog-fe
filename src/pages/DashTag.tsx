import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTitle } from "@/hooks";

const DashTag: React.FC = () => {

  interface TagType {
    id: string;
    name: string;
  }

  interface ApiResponse {
    status: number;
    message: string;
    data: TagType[];
  }

  const [tags, setTags] = useState<TagType[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<TagType>();
  
  // Set page title
  useTitle("Manage tags");

  const fetchTags = async () => {
    try {
      const response = await axiosInstance.get<ApiResponse>('/tags');
      if (response.data) {
        setTags(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/tags/${id}`);
      toast.success('Tag deleted successfully');
      fetchTags();
      toast.success('Update tag list successfully');
    } catch (err) {
      console.error('Error deleting tag:', err);
      toast.error('Error deleting tag');
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link to="/admin/tags/create" className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> Create new tag
          </Link>
        </Button>
      </div>

      {tags.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-md">
          <p className="text-gray-500 mb-4">No tag yet</p>
          <Button asChild>
            <Link to="/admin/tags/create">Create new tag</Link>
          </Button>
        </div>
      ) : (
        <div className="">
          <Table>
            <TableCaption>List of tags.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">{tag.name}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Link to={`/admin/tags/${tag.id}/edit`}>
                      <Button variant="outline" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon" onClick={() => {
                      setTagToDelete(tag);
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
      {tagToDelete && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The tag "{tagToDelete.name}" will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(tagToDelete.id)}
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

export default DashTag;