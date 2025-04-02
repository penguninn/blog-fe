import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Ellipsis } from 'lucide-react';
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

interface TagType {
  id: string;
  name: string;
}

interface ItemPostProps {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string;
  tags: TagType[];
  onDeleteSuccess?: () => void;
}

const ItemPost = ({ id, slug, title, status, category, tags, onDeleteSuccess }: ItemPostProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);

    axios.delete(`http://localhost:8080/api/posts/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(() => {
        toast.success('Delete post successfully');
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      })
      .catch((error) => {
        console.error('Error details:', error);
        toast.error('Cannot delete post: ' + (error.response?.data?.message || 'An error occurred'));
      })
      .finally(() => {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
      });
  }

  return (
    <>
      <div className="w-full flex items-center justify-start border rounded-md p-4 gap-4 shadow-sm shadow-gray-400 dark:shadow-gray-800">
        <div className="flex flex-col gap-3 items-start justify-start w-full ">
          <div className="flex gap-3 items-end">
            <div className="text-2xl font-bold">{title}</div>
            <div className="flex gap-2">
              {tags?.map((tag) => (
                <div key={tag.id} className="text-sm text-gray-500 border rounded-md px-2 bg-gray-200 dark:bg-neutral-800">{tag.name}</div>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-400">{status}</div>
        </div>
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Ellipsis className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/admin/posts/${id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/posts/${slug}`}>View</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post "{title}" will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ItemPost; 
