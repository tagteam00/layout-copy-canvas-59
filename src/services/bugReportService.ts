import { supabase } from "@/integrations/supabase/client";

export interface BugReportData {
  problemDescription: string;
  suggestion?: string;
  pageContext: string;
}

export const submitBugReport = async (data: BugReportData) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User must be authenticated to submit bug reports");
  }

  const { error } = await supabase
    .from('bug_reports')
    .insert([
      {
        user_id: user.id,
        problem_description: data.problemDescription,
        suggestion: data.suggestion || null,
        page_context: data.pageContext,
        user_agent: navigator.userAgent,
      }
    ]);

  if (error) {
    console.error("Error submitting bug report:", error);
    throw new Error("Failed to submit bug report. Please try again.");
  }
};