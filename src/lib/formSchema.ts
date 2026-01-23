import { z } from "zod";

export const formSchema = z.object({
  fullName: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  
  phone: z.string()
    .min(8, "Phone number must be at least 8 characters")
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number"),

  dateOfBirth: z.string().min(1, "Date of birth is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date in YYYY/MM/DD format"),
    

  highestQualification: z.string()
    .min(2, "Highest qualification must be at least 2 characters")
    .max(50, "Highest qualification must be less than 50 characters"),
  
  institutionName: z.string()
    .min(2, "Institution name must be at least 2 characters")
    .max(50, "Institution name must be less than 50 characters"),
  
  fieldOfStudy: z.string()
    .min(2, "Field of study must be at least 2 characters")
    .max(50, "Field of study must be less than 50 characters"),
  
  courseInterest: z.string()
    .min(1, "Please select your course interest"),
  
  howDidYouHearAboutUs: z.string()
    .min(1, "Please select your how did you hear about us")
});

export type FormData = z.infer<typeof formSchema>;

export const getFieldError = (fieldName: keyof FormData, errors: any) => {
  return errors[fieldName]?.message;
};