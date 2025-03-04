import { Category, Phrase } from "../types";
import { MessageSquare, Coffee, Utensils, Stethoscope, Home, Heart, Users, Smile, HelpCircle } from "lucide-react";

export const categories: Category[] = [
  { id: "basic", name: "Basic Needs", icon: "MessageSquare" },
  { id: "food", name: "Food & Drink", icon: "Utensils" },
  { id: "medical", name: "Medical", icon: "Stethoscope" },
  { id: "comfort", name: "Comfort", icon: "Home" },
  { id: "social", name: "Social", icon: "Users" },
  { id: "feelings", name: "Feelings", icon: "Heart" },
  { id: "emergency", name: "Emergency", icon: "HelpCircle" },
];

export const phrases: Phrase[] = [
  // Basic Needs
  { id: "1", text: "I need help", category: "basic" },
  { id: "2", text: "Yes", category: "basic" },
  { id: "3", text: "No", category: "basic" },
  { id: "4", text: "Thank you", category: "basic" },
  { id: "5", text: "Please wait", category: "basic" },
  { id: "6", text: "I don't understand", category: "basic" },
  { id: "7", text: "Can you repeat that?", category: "basic" },
  
  // Food & Drink
  { id: "8", text: "I'm hungry", category: "food" },
  { id: "9", text: "I'm thirsty", category: "food" },
  { id: "10", text: "I would like some water", category: "food" },
  { id: "11", text: "I would like something to eat", category: "food" },
  { id: "12", text: "More please", category: "food" },
  { id: "13", text: "That's enough", category: "food" },
  
  // Medical
  { id: "14", text: "I'm in pain", category: "medical" },
  { id: "15", text: "I need my medication", category: "medical" },
  { id: "16", text: "I need to see a doctor", category: "medical" },
  { id: "17", text: "I feel dizzy", category: "medical" },
  { id: "18", text: "I need to use the bathroom", category: "medical" },
  
  // Comfort
  { id: "19", text: "I'm cold", category: "comfort" },
  { id: "20", text: "I'm hot", category: "comfort" },
  { id: "21", text: "I'm uncomfortable", category: "comfort" },
  { id: "22", text: "I need to change position", category: "comfort" },
  { id: "23", text: "I need a blanket", category: "comfort" },
  
  // Social
  { id: "24", text: "I'd like to talk", category: "social" },
  { id: "25", text: "Can we watch TV?", category: "social" },
  { id: "26", text: "I'd like to go outside", category: "social" },
  { id: "27", text: "Can you call my family?", category: "social" },
  { id: "28", text: "I'd like some company", category: "social" },
  
  // Feelings
  { id: "29", text: "I'm happy", category: "feelings" },
  { id: "30", text: "I'm sad", category: "feelings" },
  { id: "31", text: "I'm frustrated", category: "feelings" },
  { id: "32", text: "I'm tired", category: "feelings" },
  { id: "33", text: "I'm bored", category: "feelings" },
  
  // Emergency
  { id: "34", text: "Emergency! I need help now!", category: "emergency" },
  { id: "35", text: "Call 911", category: "emergency" },
  { id: "36", text: "I can't breathe", category: "emergency" },
  { id: "37", text: "Something is wrong", category: "emergency" },
];

export const getCategoryIcon = (categoryId: string) => {
  const category = categories.find(c => c.id === categoryId);
  switch (category?.icon) {
    case "MessageSquare": return MessageSquare;
    case "Utensils": return Utensils;
    case "Stethoscope": return Stethoscope;
    case "Home": return Home;
    case "Users": return Users;
    case "Heart": return Heart;
    case "HelpCircle": return HelpCircle;
    default: return MessageSquare;
  }
};
