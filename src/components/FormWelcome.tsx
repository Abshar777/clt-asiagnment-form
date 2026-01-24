import { Button } from "@/components/ui/button";

interface FormWelcomeProps {
  onStart: () => void;
}

export function FormWelcome({ onStart }: FormWelcomeProps) {
  return (
    <div className="form-container min-h-screen flex items-center justify-center px-4">
      <div className="form-welcome text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="form-logo mb-12 flex justify-center">
          <img 
            src="/logo.png" 
            alt="Delta Digital Academy Logo" 
            className="w-20 h-20 object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            ASSAIGNMENT FORM
            </h1>
            {/* <h2 className="text-xl md:text-2xl text-muted-foreground font-medium mb-2">
            Why digital marketers will earn more in 2026
            </h2> */}
            <p className="text-muted-foreground text-lg leading-relaxed">
          CLT ACADEMY , DUBAI , UAE
            </p>
          </div>

        {/* Start Button */}
        <div className="flex flex-col items-center space-y-4">
          <Button
            onClick={onStart}
            size="lg"
            className="form-button px-16 py-8 text-xl font-bold shadow-xl hover:shadow-2xl"
          >
            Start
          </Button>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground form-fade-in">
              <span>press</span>
              <kbd className="px-3 py-2 bg-muted rounded-xl text-xs font-mono">Enter ↵</kbd>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center justify-center space-x-3 text-muted-foreground form-fade-in">
            <div className="p-2 bg-muted/20 rounded-xl">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
            </div>
            <span>Takes 4 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
}