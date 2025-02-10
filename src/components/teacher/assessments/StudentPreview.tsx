import Link from "next/link";
import { useState } from "react";
import { MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StudentPreviewProps {
  resultId: string;
  name: string;
  score: number;
  type: "essay" | "identification";
  assessmentId: string;
  onDelete: () => void;
}

export default function StudentPreview({
  resultId,
  name,
  score,
  type,
  assessmentId,
  onDelete,
}: StudentPreviewProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      if (type === "essay") {
        const response = await fetch(`${baseUrl}/essay-results/${resultId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete essay result");
        }
      } else {
        const response = await fetch(`${baseUrl}/identification-results/${resultId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete identification result");
        }
      }
      onDelete();
    } catch (error) {
      console.error("Error deleting result:", error);
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="relative">
      <Link href={`/assessments/${assessmentId}/${type}/${resultId}`}>
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-black">
          <div className="flex flex-col">
            <span className="text-gray-700 text-sm">{name}</span>
            <span className="text-gray-500 text-xs">Score: {score}</span>
          </div>
          <div className="relative dropdown-container">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowDropdown(!showDropdown);
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDropdown(false);
                    setShowDeleteDialog(true);
                  }}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Result</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the result for &ldquo;{name}&ldquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
