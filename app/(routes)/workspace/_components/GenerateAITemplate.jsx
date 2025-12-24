import { Button } from "@/components/ui/button";
import { LayoutGrid, Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { chatSession } from "@/config/GoogleAIModel";

function GenerateAITemplate({ setGenerateAIOutput }) {
  const [open, setOpen] = useState(false); // Handles dialog state
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState(false);

  const GenerateFromAI = async () => {
    setLoading(true);
    const PROMPT = "Generate template for editor.js in JSON for " + userInput;
    const result = await chatSession.sendMessage(PROMPT);

    try {
      const output = JSON.parse(result.response.text());
      setGenerateAIOutput(output);
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      setLoading(false);
    }

    setLoading(false);
    setOpen(false); // Close dialog after generating the template
  };

  return (
    <div>
      <Button
        variant="outline"
        className="flex gap-2"
        onClick={() => setOpen(true)} // Open dialog on button click
      >
        <LayoutGrid className="h-4 w-4" /> Generate AI template
      </Button>

      {/* Bind open state and add onOpenChange handler */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate template using AI</DialogTitle>
            <DialogDescription>
              <h2 className="mt-5">Enter your prompt below</h2>
              <Input
                placeholder="Ex. template for grocery items"
                onChange={(event) => setUserInput(event?.target.value)}
              />
              <div className="mt-5 flex gap-5 justify-end">
                {/* Cancel button to close the dialog */}
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant=""
                  disabled={loading || !userInput}
                  onClick={GenerateFromAI}
                >
                  {loading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    "Generate"
                  )}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GenerateAITemplate;
