import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { formSchema, type FormData, getFieldError } from "@/lib/formSchema";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

interface Question {
  id: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "textarea"
    | "select"
    | "date"
    | "file"
    | "checkbox";
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
  allAnswers: Record<string, string>;
  direction: "left" | "right";
}

export function FormQuestionWithValidation({
  question,
  questionNumber,
  totalQuestions,
  value,
  onChange,
  onNext,
  onPrevious,
  canGoNext,
  isFirst,
  isLast,
  allAnswers,
  direction,
}: FormQuestionProps) {
  const [isFocused, setIsFocused] = useState(false);

  const {
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  // Set form values from allAnswers
  useEffect(() => {
    Object.entries(allAnswers).forEach(([key, val]) => {
      setValue(key as keyof FormData, val);
    });
  }, [allAnswers, setValue]);

  const fieldError = getFieldError(question.id as keyof FormData, errors);

  const handleNext = async () => {
    // Trigger validation for current field
    const isValid = await trigger(question.id as keyof FormData);

    if (isValid) {
      onNext();
    }
  };

  const handlePrevious = () => {
    onPrevious();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canGoNext && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleChange = async (newValue: string) => {
    onChange(newValue);
    setValue(question.id as keyof FormData, newValue);
    // Trigger validation after a short delay
  };

  const slideVariants = {
    enter: (direction: string) => ({
      x: direction === "left" ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === "left" ? -300 : 300,
      opacity: 0,
    }),
  };

  const renderInput = () => {
    const baseClasses = `form-input text-base p-4 w-full max-w-md bg-card/50 backdrop-blur-sm border-2 focus:ring-0 placeholder-muted-foreground ${
      fieldError ? "border-destructive" : "border-border"
    }`;
    const ref = useRef<any>(null);
    useEffect(() => {
      ref.current?.focus();
    }, [question.id]);

    switch (question.type) {
      case "textarea":
        return (
          <div className="w-full max-w-md">
            <Textarea
              ref={ref}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={question.placeholder || "Type your answer here..."}
              className={`${baseClasses} min-h-[120px] resize-none rounded-xl`}
              rows={4}
            />
            {fieldError && (
              <div className="flex items-center space-x-2 mt-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{fieldError}</span>
              </div>
            )}
          </div>
        );
      case "select":
        return (
          <div className="space-y-2 w-full max-w-md">
            {question.options?.map((option, index) => (
              <Button
                key={index}
                variant={value === option ? "default" : "outline"}
                onClick={() => handleChange(option)}
                className={`form-option w-full text-left hover:text-black hover:bg-white/80 justify-start p-4 h-auto text-sm ${
                  value === option
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card/30 backdrop-blur-sm "
                }`}
              >
                <span
                  className={cn(
                    "mr-3 text-primary font-bold bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center text-xs",
                    value === option && "bg-primary text-primary-foreground",
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </Button>
            ))}
            {fieldError && (
              <div className="flex items-center space-x-2 mt-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{fieldError}</span>
              </div>
            )}
          </div>
        );
      case "date":
        return (
          <div className="w-full max-w-md">
            <Input
              ref={ref}
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
            {fieldError && (
              <div className="flex items-center space-x-2 mt-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{fieldError}</span>
              </div>
            )}
          </div>
        );

      case "file":
        return (
          <div className="w-full max-w-md">
            {/* Hidden native input */}
            <input
              ref={ref}
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onChange(file.name);
                  setValue(question.id as keyof FormData, file.name, {
                    shouldValidate: true,
                  });
                }
              }}
            />

            {/* Custom UI */}
            <button
              type="button"
              onClick={() => ref.current?.click()}
              className={cn(
                "w-full rounded-xl border-2 border-dashed p-6 text-left transition-all",
                "bg-card/40 backdrop-blur-sm hover:bg-card/70",
                "focus:outline-none focus:ring-2 focus:ring-primary",
                fieldError
                  ? "border-destructive"
                  : "border-border hover:border-primary",
              )}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10">
                  📎
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {value ? "File selected" : "Upload your assignment"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {value || "PDF or Image • Max 10 MB"}
                  </p>
                </div>
              </div>
            </button>

            {fieldError && (
              <p className="text-sm text-destructive mt-2">{fieldError}</p>
            )}
          </div>
        );

      case "checkbox":
        const selected = value ? value.split(",") : [];

        return (
          <div className="space-y-2 flex gap-2 items-center flex-wrap w-full max-w-md">
            {question.options?.map((option) => {
              const checked = selected.includes(option);

              return (
                <Button
                  key={option}
                  variant={checked ? "default" : "outline"}
                  onClick={() => {
                    const updated = checked
                      ? selected.filter((v) => v !== option)
                      : [...selected, option];

                    const joined = updated.join(",");
                    onChange(joined);
                    setValue(question.id as keyof FormData, joined, {
                      shouldValidate: true,
                    });
                  }}
                  className="justify-start hover:bg-primary/10 hover:text-primary"
                >
                  {option}
                </Button>
              );
            })}

            {fieldError && (
              <p className="text-sm text-destructive mt-2">{fieldError}</p>
            )}
          </div>
        );

      default:
        return (
          <div className="w-full max-w-md">
            <Input
              ref={ref}
              type={question.type}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={question.placeholder || "Type your answer here..."}
              className={`${baseClasses} h-12 rounded-xl`}
            />
            {fieldError && (
              <div className="flex items-center space-x-2 mt-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{fieldError}</span>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="form-container min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-2xl mx-auto"
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
      >
        <ScrollArea className="h-[calc(100vh-200px)]">
          {/* Question Header */}
          <div className="mb-8 form-card p-6 bg-card/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-primary/20 rounded-xl p-3">
                <span className="text-primary text-xl font-bold">
                  {questionNumber}
                </span>
              </div>
              <div className="flex-1 h-2 bg-border/30 rounded-full overflow-hidden">
                <motion.div
                  className="form-progress h-full bg-primary rounded-full shadow-sm"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(questionNumber / totalQuestions) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
              {question.title}
              {question.required && (
                <span className="text-destructive ml-2">*</span>
              )}
            </h1>

            {question.subtitle && (
              <p className="text-muted-foreground text-base leading-relaxed">
                {question.subtitle}
              </p>
            )}
          </div>

          {/* Input */}
          <div className="mb-8 flex justify-center">{renderInput()}</div>

          {/* Helper Text */}
          {isFocused && question.type !== "select" && !fieldError && (
            <motion.div
              className="mb-6 flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-2 text-xs text-muted-foreground bg-muted/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                <span>press</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">
                  Enter ↵
                </kbd>
                <span>to continue</span>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={isFirst}
              className="flex items-center space-x-2 text-muted-foreground hover:text-black px-4 py-2 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Previous</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canGoNext || !!fieldError}
              className="form-button flex items-center space-x-2 px-6 py-2 text-sm shadow-lg"
            >
              <span>{isLast ? "Submit Application" : "Next"}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  );
}
