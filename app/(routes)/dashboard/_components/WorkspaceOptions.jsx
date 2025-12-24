import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function WorkspaceOptions({ workspace, deleteWorkspace }) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDeleteConfirmed = async (event) => {
    console.log("Delete confirmed for workspace:", workspace.id);
    event.stopPropagation();
    try {
      await deleteWorkspace(workspace.id);
      console.log("deleteWorkspace function called successfully");
      setIsAlertOpen(false);
    } catch (error) {
      console.error("Error during delete:", error);
    }
  };

  if (!workspace) {
    console.log("No workspace provided to WorkspaceOptions");
    return null;
  }

  return (
    <>
      <button
        onClick={(event) => {
          console.log("Delete button clicked for workspace:", workspace.id);
          event.preventDefault();
          event.stopPropagation();
          setIsAlertOpen(true);
        }}
        className="flex gap-2 text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <AlertDialog
        open={isAlertOpen}
        onOpenChange={(open) => {
          console.log("Alert dialog open state changed to:", open);
          setIsAlertOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              workspace and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={(e) => {
                console.log("Delete cancelled");
                e.stopPropagation();
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirmed}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default WorkspaceOptions;
