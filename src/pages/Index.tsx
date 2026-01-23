import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FormWelcome } from "@/components/FormWelcome";
import { FormQuestionWithValidation } from "@/components/FormQuestionWithValidation";
import { FormComplete } from "@/components/FormComplete";
import { useToast } from "@/hooks/use-toast";
import { formSchema, type FormData } from "@/lib/formSchema";


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
    subtitle: "Upload PDF or image (Max 10 MB)",
    required: true,
  },
  {
    id: "offlineClassAvailability",
    type: "checkbox",
    title: "9. If we are planning extra offline classes, when will you be free?",
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
      : "welcome"
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    localStorage.getItem("currentQuestionIndex")
      ? parseInt(localStorage.getItem("currentQuestionIndex") || "0")
      : 0
  );

  const [answers, setAnswers] = useState<Record<string, string>>(
    localStorage.getItem("answers")
      ? JSON.parse(localStorage.getItem("answers") || "{}")
      : {}
  );

  const [direction, setDirection] = useState<"left" | "right">("right");
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
    localStorage.setItem(
      "currentQuestionIndex",
      currentQuestionIndex.toString()
    );
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [currentStep, currentQuestionIndex, answers]);

  const handleStart = () => {
    setCurrentStep("questions");
    setCurrentQuestionIndex(0);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const answer = answers[currentQuestion.id];

    // Basic validation for empty required fields
    console.log(currentQuestion.required, answer, "🟢");
    if (currentQuestion.required && (!answer || answer.trim() === "")) {
     
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setDirection("left");
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Validate entire form before submission
      try {
        setCurrentStep("complete");
      } catch (error) {
        toast({
          title: "Validation Error",
          description: "Please check all fields and try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setDirection("right");
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };
  const [ip, setIp] = useState("");
  const [locationData, setLocationData] = useState<any>(null);


  
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.type === "select") {
      handleNext();
    }
  }, [answers]);
  // useEffect(() => {
  //   const fetchIpAndLocation = async () => {
  //     try {
  //       const res = await fetch("https://ipapi.co/json/");
  //       const data = await res.json();
  //       console.log(data, "🟢");
  //       setIp(data.ip);
  //       setLocationData({
  //         city: data.city,
  //         region: data.region,
  //         country: data.country_name,
  //         latitude: data.latitude,
  //         longitude: data.longitude,
  //         timezone: data.timezone,
  //       });
  //     } catch (error) {
  //       console.log("Location fetch error:", error);
  //     }
  //   };

  //   fetchIpAndLocation();
  // }, []);

  const [loading, setLoading] = useState(false);

  const url =
    "https://script.google.com/macros/s/AKfycbyNbrlSXvaZjhIzUiEN4qfKDNnL5fbjdRdL3KESmylTCVejTvQDjQG9KpGtIRFYQ2i-Og/exec";
  const handleSubmit = async () => {
    setLoading(true);

    try {
      await fetch(url, {
        method: "POST",
     
        body: JSON.stringify({
          FullName: answers.fullName,
          Email: answers.emailAddress,
          PhoneNumber: answers.mobileNumber,
          Occupation: answers.occupation,
          GoalForWebinar: answers.goalForWebinar,
          HeardAboutWebinar:"",
         
        }),
      });
     
      toast({
        title: "Application Submitted Successfully!",
        description:
          "Thank you for your response. We will contact you soon. Let’s begin our learning journey from here!",
      });
      setAnswers({});
    } catch (error) {
      console.error(error);
      toast({
        title: "Validation Error",
        description: "Please check all fields and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleRestart = async () => {
    await handleSubmit();
    setCurrentStep("welcome");
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion
    ? answers[currentQuestion.id] || ""
    : "";
  const canGoNext = currentQuestion
    ? !currentQuestion.required ||
      (currentAnswer && currentAnswer.trim() !== "")
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
