import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import DocumentOptions from "./DocumentOptions";
import {
  deleteDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { toast } from "sonner";

function DocumentList({ documentList, params }) {
  const router = useRouter();

  const DeleteDocument = async (docId, event) => {
    event.stopPropagation();

    try {
      await deleteDoc(doc(db, "workspaceDocuments", docId));

      const workspaceId = Number(params?.workspaceid);
      const q = query(
        collection(db, "workspaceDocuments"),
        where("workspaceId", "==", workspaceId)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const batch = writeBatch(db);
        batch.delete(doc(db, "workspaces", workspaceId.toString()));
        await batch.commit();

        toast("Document and Workspace Deleted!");
        router.push("/dashboard");
      } else {
        toast("Document Deleted!");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document!");
    }
  };

  return (
    <div>
      {documentList.map((doc, index) => (
        <div
          key={index}
          onClick={() =>
            router.push("/workspace/" + params?.workspaceid + "/" + doc?.id)
          }
          className={`mt-3 p-2 px-3 hover:bg-gray-200 
            rounded-lg cursor-pointer flex justify-between items-center
            ${doc?.id == params?.documentid && "bg-white"}
            `}
        >
          <div className="flex gap-2 items-center">
            {!doc.emoji && (
              <Image src={"/loopdocument.svg"} width={20} height={20} />
            )}
            <h2 className="flex gap-2">
              {" "}
              {doc?.emoji} {doc.documentName}
            </h2>
          </div>
          <DocumentOptions
            doc={doc}
            deleteDocument={(docId, event) => DeleteDocument(docId, event)}
          />
        </div>
      ))}
    </div>
  );
}

export default DocumentList;
