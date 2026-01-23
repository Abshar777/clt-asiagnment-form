import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface FormCompleteProps {
  onRestart: () => void;
  loading: boolean;
}

export function FormComplete({ onRestart, loading }: FormCompleteProps) {
  const [showTerms, setShowTerms] = useState(false);
  return (
    <div className={`form-container  h-[100vh] overflow-y-auto min-h-screen flex items-center justify-center ${showTerms ? 'pt-[15rem]' : 'pt-[2rem]'} pb-[2rem] px-4`}>
      <div className={`form-welcome md:pt-0 ${showTerms ? 'pt-[35rem]' : 'pt-[1rem]'} text-center max-w-2xl mx-auto`}>
        {/* Success Icon */}
        <div className="mb-12 flex justify-center">
          <div className="form-card w-32 h-32 bg-primary/20 rounded-3xl flex items-center justify-center shadow-xl">
            <CheckCircle className="w-16 h-16 text-primary" />
          </div>
        </div>

        {/* Success Message */}
     
        {!showTerms && (
          <div className="space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Thank you for sharing your feedback! Your input helps us improve the learning experience for everyone.
            </h1>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={() => {
            if (showTerms) {
              setShowTerms(false);
            } else {
              onRestart();
            }
          }}
          variant={showTerms ? "outline" : "default"}
          disabled={loading}
          size="lg"
          className="form-button px-12 py-6 text-lg border-2 hover:bg-primary/10"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : showTerms ? (
            "I agree "
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </div>
  );
}
