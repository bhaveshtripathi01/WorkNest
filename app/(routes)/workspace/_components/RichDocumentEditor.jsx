import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Delimiter from "@editorjs/delimiter";
import Alert from "editorjs-alert";
import List from "@editorjs/list";
import NestedList from "@editorjs/nested-list";
import Checklist from "@editorjs/checklist";
import Embed from "@editorjs/embed";
import SimpleImage from "simple-image-editorjs";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";
import { TextVariantTune } from "@editorjs/text-variant-tune";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useUser } from "@clerk/nextjs";
import Paragraph from "@editorjs/paragraph";
import GenerateAITemplate from "./GenerateAITemplate";

function RichDocumentEditor({ params }) {
  const editorRef = useRef(null);
  const { user } = useUser();
  const isFetched = useRef(false);

  useEffect(() => {
    if (user) {
      InitEditor();
    }
  }, [user]);

  const SaveDocument = async (outputData) => {
    if (!user) return;

    const docRef = doc(db, "documentOutput", params?.documentid);

    try {
      await updateDoc(docRef, {
        output: JSON.stringify(outputData),
        editedBy: user.primaryEmailAddress?.emailAddress,
      });
      console.log("Document saved successfully");
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };

  const GetDocumentOutput = () => {
    const unsubscribe = onSnapshot(
      doc(db, "documentOutput", params?.documentid),
      (doc) => {
        if (
          doc.data()?.editedBy !== user?.primaryEmailAddress?.emailAddress ||
          !isFetched.current
        ) {
          doc.data().editedBy &&
            editorRef.current?.render(JSON.parse(doc.data()?.output));
          isFetched.current = true;
        }
      }
    );
    return unsubscribe;
  };

  const InitEditor = () => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        onChange: () => {
          editor.save().then(SaveDocument);
        },
        onReady: () => {
          GetDocumentOutput();
        },
        holder: "editorjs",
        tools: {
          header: Header,
          delimiter: Delimiter,
          paragraph: Paragraph,
          alert: {
            class: Alert,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+A",
            config: {
              alertTypes: [
                "primary",
                "secondary",
                "info",
                "success",
                "warning",
                "danger",
                "light",
                "dark",
              ],
              defaultType: "primary",
              messagePlaceholder: "Enter something",
            },
          },
          table: Table,
          list: {
            class: List,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+L",
            config: {
              defaultStyle: "unordered",
            },
          },
          checklist: {
            class: Checklist,
            shortcut: "CMD+SHIFT+C",
            inlineToolbar: true,
          },
          image: SimpleImage,
          code: {
            class: CodeTool,
            shortcut: "CMD+SHIFT+P",
          },
          // textVariant: TextVariantTune,
        },
      });
      editorRef.current = editor;
    }
  };

  const handleGenerateAITemplate = async (output) => {
    if (!editorRef.current) return;

    // Render AI template in EditorJS locally
    await editorRef.current.render(output);

    // Save the updated content
    const savedData = await editorRef.current.save();
    await SaveDocument(savedData);
  };

  return (
    <div className=" ">
      <div id="editorjs" className="w-[70%]"></div>
      <div className="fixed bottom-10 md:ml-80 left-0 z-10">
        <GenerateAITemplate setGenerateAIOutput={handleGenerateAITemplate} />
      </div>
    </div>
  );
}

export default RichDocumentEditor;