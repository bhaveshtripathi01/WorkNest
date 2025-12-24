import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import WorkspaceOptions from "./WorkspaceOptions";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { toast } from "sonner";

function WorkspaceItemList({ workspaceList, setWorkspaceList }) {
  const router = useRouter();

  const onClickWorkspaceItem = (workspaceId) => {
    router.push("/workspace/" + String(workspaceId));
  };

  const deleteWorkspace = async (workspaceId) => {
    console.log("Deleting workspace with ID:", workspaceId);
    if (!workspaceId) {
      console.error("Invalid workspace ID:", workspaceId);
      toast.error("Invalid workspace ID!");
      return;
    }

    try {
      const docRef = doc(db, "Workspace", workspaceId);
      await deleteDoc(docRef);
      console.log("Workspace deleted from Firestore");
      toast.success("Workspace deleted successfully!");

      // Force a page refresh
      window.location.reload();
    } catch (error) {
      console.error("Error deleting workspace:", error);
      toast.error("Failed to delete workspace.");
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      {workspaceList.map((workspace) => (
        <div
          key={workspace.id}
          className="border shadow-xl rounded-xl hover:scale-105 transition-all cursor-pointer"
          onClick={() => onClickWorkspaceItem(String(workspace.id))}
        >
          <Image
            src={workspace?.coverImage}
            width={400}
            height={200}
            alt="cover"
            className="h-[150px] object-cover rounded-t-xl"
          />
          <div className="p-4 rounded-b-xl flex justify-between items-center">
            <h2 className="flex gap-2">
              {workspace?.emoji} {workspace.workspaceName}
            </h2>
            <WorkspaceOptions
              workspace={{ ...workspace, id: String(workspace.id) }}
              deleteWorkspace={deleteWorkspace}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default WorkspaceItemList;
