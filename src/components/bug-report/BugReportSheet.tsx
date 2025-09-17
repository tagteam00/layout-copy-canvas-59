import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { submitBugReport } from "@/services/bugReportService";
import { Bug } from "lucide-react";

interface BugReportSheetProps {
  trigger: React.ReactNode;
  pageContext: string;
}

export const BugReportSheet: React.FC<BugReportSheetProps> = ({ trigger, pageContext }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [problemDescription, setProblemDescription] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!problemDescription.trim()) {
      toast.error("Please describe the problem you encountered");
      return;
    }

    setLoading(true);
    
    try {
      await submitBugReport({
        problemDescription: problemDescription.trim(),
        suggestion: suggestion.trim() || undefined,
        pageContext,
      });
      
      toast.success("Bug report submitted successfully! Thank you for your feedback.");
      setProblemDescription("");
      setSuggestion("");
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit bug report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Report a Problem
          </SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="problem" className="text-sm font-medium">
              Problem Description *
            </Label>
            <Textarea
              id="problem"
              placeholder="Please describe the problem you encountered in detail..."
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className="min-h-[120px] resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="suggestion" className="text-sm font-medium">
              Suggestion (Optional)
            </Label>
            <Textarea
              id="suggestion"
              placeholder="Do you have any suggestions on how to fix this issue?"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !problemDescription.trim()}
              className="flex-1"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};