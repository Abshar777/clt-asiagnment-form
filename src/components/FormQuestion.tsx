import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface Question {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'date';
  title: string;
  subtitle?: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface FormQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export function FormQuestion({
  question,
  questionNumber,
  totalQuestions,
  value,
  onChange,
  onNext,
  onPrevious,
  canGoNext,
  isFirst,
  isLast
}: FormQuestionProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canGoNext && !e.shiftKey) {
      e.preventDefault();
      onNext();
    }
  };

  const renderInput = () => {
    const baseClasses = "form-input text-lg p-4 w-full max-w-md bg-transparent border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:ring-0 focus:border-primary placeholder-muted-foreground";
    
    switch (question.type) {
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={question.placeholder || "Type your answer here..."}
            className={`${baseClasses} min-h-[120px] resize-none`}
            rows={4}
          />
        );
      case 'select':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <Button
                key={index}
                variant={value === option ? "default" : "outline"}
                onClick={() => onChange(option)}
                className="w-full max-w-md text-left justify-start p-4 h-auto"
              >
                <span className="mr-3 text-primary font-bold">{String.fromCharCode(65 + index)}</span>
                {option}
              </Button>
            ))}
          </div>
        );
      case 'date':
        return (
          <div className="w-full max-w-md">
            <Input
              type="date"
              value={value}
              onChange={(e) => {
                // const date = new Date(e.target.value);
                // const day = date.getDate().toString().padStart(2, '0');
                // const month = (date.getMonth() + 1).toString().padStart(2, '0');
                // const year = date.getFullYear();
                onChange(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={question.placeholder || "DD/MM/YYYY"}
              className={baseClasses}
            />
            
          </div>
        );
      default:
        return (
          <Input
            type={question.type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={question.placeholder || "Type your answer here..."}
            className={baseClasses}
          />
        );
    }
  };

  return (
    <div className="form-container min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Question Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-primary text-lg font-bold">
              {questionNumber}
            </span>
            <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {question.title}
            {question.required && <span className="text-destructive ml-1">*</span>}
          </h1>
          
          {question.subtitle && (
            <p className="text-muted-foreground text-lg">
              {question.subtitle}
            </p>
          )}
        </div>

        {/* Input */}
        <div className="mb-12">
          {renderInput()}
          {isFocused && question.type !== 'select' && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-muted-foreground">
              <span>press</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter ↵</kbd>
              <span>to continue</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={onPrevious}
            disabled={isFirst}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <Button
            onClick={onNext}
            disabled={!canGoNext}
            className="form-button flex items-center space-x-2 px-6 py-3"
          >
            <span>{isLast ? 'Submit' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}