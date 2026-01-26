import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FormWelcome } from "@/components/FormWelcome";
import { FormQuestionWithValidation } from "@/components/FormQuestionWithValidation";
import { FormComplete } from "@/components/FormComplete";
import { useToast } from "@/hooks/use-toast";

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
  multiple?: boolean;
  maxFiles?: number;
}

const questions: Question[] = [
  {
    id: "name",
    type: "text",
    title: "1. Name",
    required: true,
    placeholder: "Enter your full name",
  },
  {
    id: "email",
    type: "email",
    title: "2. Email Address",
    required: true,
    placeholder: "Enter your email address",
  },
  {
    id: "mobile",
    type: "tel",
    title: "3. Mobile No",
    required: true,
    placeholder: "Enter your mobile number",
  },
  {
    id: "classDate",
    type: "date",
    title: "4. Class Attended Date",
    required: true,
  },
  {
    id: "classAttended",
    type: "select",
    title: "5. Class Attended",
    required: true,
    options: [
      "B1",
      "B2",
      "B3",
      "B4",
      "B5",
      "B6",
      "B7",
      "B8",
      "B9",
      "B10",
      "INT 1",
      "INT 2",
      "INT 3",
      "INT 4",
      "INT 5",
      "INT 6",
      "INT 7",
      "INT 8",
      "INT 9",
      "INT 10",
    ],
  },
  {
    id: "mentor",
    type: "select",
    title: "6. Mentor",
    required: true,
    options: ["Edwin", "Ashwin", "Rafath", "Sriram", "Nihal", "Mathson"],
  },
  {
    id: "classFeedback",
    type: "select",
    title: "7. How was the class?",
    required: true,
    options: ["Excellent", "Average", "Poor"],
  },
  {
    id: "assignmentUpload",
    type: "file",
    title: "8. Upload Your Assignment",
    subtitle: "You can upload multiple files (PDF, images, or documents)",
    required: true,
    multiple: true, // Enable multiple file selection
    maxFiles: 5,    // Maximum 5 files
  },
  {
    id: "offlineClassAvailability",
    type: "checkbox",
    title:
      "9. If we are planning extra offline classes, when will you be free?",
    required: false,
    options: [
      "Sunday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState<
    "welcome" | "questions" | "complete"
  >(
    localStorage.getItem("currentStep")
      ? (localStorage.getItem("currentStep") as
          | "welcome"
          | "questions"
          | "complete")
      : "welcome",
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    localStorage.getItem("currentQuestionIndex")
      ? parseInt(localStorage.getItem("currentQuestionIndex") || "0")
      : 0,
  );

  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem("answers");
    // Don't restore file objects from localStorage - they can't be serialized properly
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Remove any file entries as they can't be properly stored
        if (parsed.assignmentUpload) {
          delete parsed.assignmentUpload;
        }
        return parsed;
      } catch {
        return {};
      }
    }
    return {};
  });

  const [direction, setDirection] = useState<"left" | "right">("right");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
    localStorage.setItem(
      "currentQuestionIndex",
      currentQuestionIndex.toString(),
    );
    
    // Save answers but exclude files (they can't be properly serialized)
    const answersToSave = { ...answers };
    if (answersToSave.assignmentUpload) {
      delete answersToSave.assignmentUpload;
    }
    localStorage.setItem("answers", JSON.stringify(answersToSave));
  }, [currentStep, currentQuestionIndex, answers]);

  const handleStart = () => {
    setCurrentStep("questions");
    setCurrentQuestionIndex(0);
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const answer = answers[currentQuestion.id];

    // Validation for required fields
    if (currentQuestion.required) {
      // For file type
      if (currentQuestion.type === "file") {
        const hasFiles = Array.isArray(answer) 
          ? answer.length > 0 
          : answer instanceof File;
        
        if (!hasFiles) {
          toast({
            title: "Required Field",
            description: "Please upload at least one file",
            variant: "destructive",
          });
          return;
        }
      }
      // For other types
      else if (!answer || answer?.trim?.() === "") {
        return;
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setDirection("left");
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Last question - proceed to submit
      setCurrentStep("complete");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setDirection("right");
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Auto-advance for select questions
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion?.type === "select" && answers[currentQuestion.id]) {
      const timer = setTimeout(() => {
        handleNext();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [answers, currentQuestionIndex]);

  const url =
    "https://script.google.com/macros/s/AKfycbx_0ceWBWxqDHWD1o1IDTRRhO5brmfzabQSpO-cspQB7fzhRUeJbxFEbIalFptYL63T/exec";

  // Convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Convert files to base64
      const filesArray = [];

      // Handle the assignmentUpload field (can be single File or File[])
      if (answers.assignmentUpload) {
        const files = Array.isArray(answers.assignmentUpload)
          ? answers.assignmentUpload
          : [answers.assignmentUpload];

        // Convert each file to base64
        for (const file of files) {
          if (file instanceof File) {
            try {
              const base64 = await fileToBase64(file);
              filesArray.push({
                name: file.name,
                data: base64,
                mimeType: file.type,
                size: file.size,
              });
            } catch (error) {
              console.error(`Error converting file ${file.name}:`, error);
            }
          }
        }
      }

      // Prepare payload
      const payload = {
        name: answers.name || "",
        email: answers.email || "",
        mobile: answers.mobile || "",
        classDate: answers.classDate || "",
        classAttended: answers.classAttended || "",
        mentor: answers.mentor || "",
        classFeedback: answers.classFeedback || "",
        offlineAvailability: answers.offlineClassAvailability || "",
        files: filesArray, // Send as array
      };

      console.log("Submitting payload:", {
        ...payload,
        files: `${filesArray.length} file(s)`,
      });

      // Send to Google Apps Script
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        // headers: {
        //   "Content-Type": "application/json",
        // },
      });

      const result = await response.json();

      if (result.status === "success") {
        console.log(`Successfully uploaded ${result.fileCount} files`);
        console.log("File URLs:", result.fileUrls);
        
        toast({
          title: "Success 🎉",
          description: `Form submitted with ${result.fileCount} file(s)`,
        });

        // Clear localStorage after successful submission
        localStorage.removeItem("currentStep");
        localStorage.removeItem("currentQuestionIndex");
        localStorage.removeItem("answers");

        return { success: true, data: result };
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Failed to submit form",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = async () => {
    try {
      await handleSubmit();
      
      // Reset state
      setCurrentStep("welcome");
      setCurrentQuestionIndex(0);
      setAnswers({});
    } catch (error) {
      // Error already handled in handleSubmit
      console.error("Failed to submit:", error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] || "" : "";
  
  // Enhanced validation for file uploads
  const canGoNext = currentQuestion
    ? !currentQuestion.required ||
      (currentQuestion.type === "file"
        ? Array.isArray(currentAnswer)
          ? currentAnswer.length > 0
          : currentAnswer instanceof File
        : currentAnswer && (currentAnswer as any)?.trim?.() !== "")
    : false;

  if (currentStep === "welcome") {
    return <FormWelcome onStart={handleStart} />;
  }

  if (currentStep === "complete") {
    return <FormComplete loading={loading} onRestart={handleRestart} />;
  }

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <FormQuestionWithValidation
        key={currentQuestionIndex}
        question={currentQuestion as any}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        value={currentAnswer}
        onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        canGoNext={canGoNext}
        isFirst={currentQuestionIndex === 0}
        isLast={currentQuestionIndex === questions.length - 1}
        allAnswers={answers}
        direction={direction}
      />
    </AnimatePresence>
  );
};

export default Index;