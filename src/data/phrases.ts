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
  { id: "7", text: "Can you repeat?", category: "basic" },
  { id: "8", text: "Maybe", category: "basic" },
  { id: "9", text: "Not sure", category: "basic" },
  { id: "10", text: "Later please", category: "basic" },
  { id: "11", text: "Stop", category: "basic" },
  { id: "12", text: "Continue", category: "basic" },
  { id: "13", text: "Slower please", category: "basic" },
  { id: "14", text: "Need privacy", category: "basic" },
  
  // Food & Drink
  { id: "15", text: "I'm hungry", category: "food" },
  { id: "16", text: "I'm thirsty", category: "food" },
  { id: "17", text: "Water please", category: "food" },
  { id: "18", text: "Food please", category: "food" },
  { id: "19", text: "More please", category: "food" },
  { id: "20", text: "That's enough", category: "food" },
  { id: "21", text: "Need straw", category: "food" },
  { id: "22", text: "Too hot", category: "food" },
  { id: "23", text: "Too cold", category: "food" },
  { id: "24", text: "Too spicy", category: "food" },
  { id: "25", text: "Ice chips", category: "food" },
  { id: "26", text: "Smaller bites", category: "food" },
  { id: "27", text: "Need napkin", category: "food" },
  { id: "28", text: "Wipe mouth", category: "food" },
  { id: "29", text: "Finished eating", category: "food" },
  { id: "30", text: "Juice please", category: "food" },
  
  // Medical
  { id: "31", text: "I'm in pain", category: "medical" },
  { id: "32", text: "Need medication", category: "medical" },
  { id: "33", text: "Need doctor", category: "medical" },
  { id: "34", text: "Feel dizzy", category: "medical" },
  { id: "35", text: "Need bathroom", category: "medical" },
  { id: "36", text: "Need suction", category: "medical" },
  { id: "37", text: "Hard to breathe", category: "medical" },
  { id: "38", text: "Adjust vent", category: "medical" },
  { id: "39", text: "Pain scale 1-10", category: "medical" },
  { id: "40", text: "Headache", category: "medical" },
  { id: "41", text: "Nauseous", category: "medical" },
  { id: "42", text: "Itchy", category: "medical" },
  { id: "43", text: "Need catheter", category: "medical" },
  { id: "44", text: "Check vitals", category: "medical" },
  { id: "45", text: "Choking", category: "medical" },
  { id: "46", text: "Muscle spasm", category: "medical" },
  
  // Comfort
  { id: "47", text: "I'm cold", category: "comfort" },
  { id: "48", text: "I'm hot", category: "comfort" },
  { id: "49", text: "Uncomfortable", category: "comfort" },
  { id: "50", text: "Reposition me", category: "comfort" },
  { id: "51", text: "Need blanket", category: "comfort" },
  { id: "52", text: "Adjust pillow", category: "comfort" },
  { id: "53", text: "Raise head", category: "comfort" },
  { id: "54", text: "Lower head", category: "comfort" },
  { id: "55", text: "Turn left", category: "comfort" },
  { id: "56", text: "Turn right", category: "comfort" },
  { id: "57", text: "Sit up", category: "comfort" },
  { id: "58", text: "Lie down", category: "comfort" },
  { id: "59", text: "Too bright", category: "comfort" },
  { id: "60", text: "Too dark", category: "comfort" },
  { id: "61", text: "Too loud", category: "comfort" },
  { id: "62", text: "Need glasses", category: "comfort" },
  { id: "63", text: "Adjust bed", category: "comfort" },
  
  // Social
  { id: "64", text: "Let's talk", category: "social" },
  { id: "65", text: "TV please", category: "social" },
  { id: "66", text: "Go outside", category: "social" },
  { id: "67", text: "Call family", category: "social" },
  { id: "68", text: "Need company", category: "social" },
  { id: "69", text: "Read to me", category: "social" },
  { id: "70", text: "Music please", category: "social" },
  { id: "71", text: "Video call", category: "social" },
  { id: "72", text: "Show photos", category: "social" },
  { id: "73", text: "Change channel", category: "social" },
  { id: "74", text: "Volume up", category: "social" },
  { id: "75", text: "Volume down", category: "social" },
  { id: "76", text: "Need phone", category: "social" },
  { id: "77", text: "Check messages", category: "social" },
  { id: "78", text: "Need laptop", category: "social" },
  { id: "79", text: "Need tablet", category: "social" },
  
  // Feelings
  { id: "80", text: "I'm happy", category: "feelings" },
  { id: "81", text: "I'm sad", category: "feelings" },
  { id: "82", text: "Frustrated", category: "feelings" },
  { id: "83", text: "I'm tired", category: "feelings" },
  { id: "84", text: "I'm bored", category: "feelings" },
  { id: "85", text: "Anxious", category: "feelings" },
  { id: "86", text: "Scared", category: "feelings" },
  { id: "87", text: "Lonely", category: "feelings" },
  { id: "88", text: "Overwhelmed", category: "feelings" },
  { id: "89", text: "Need rest", category: "feelings" },
  { id: "90", text: "Feel better", category: "feelings" },
  { id: "91", text: "Feel worse", category: "feelings" },
  { id: "92", text: "Need space", category: "feelings" },
  { id: "93", text: "Need quiet", category: "feelings" },
  { id: "94", text: "Feeling hopeful", category: "feelings" },
  { id: "95", text: "Missing family", category: "feelings" },
  
  // Emergency
  { id: "96", text: "Emergency!", category: "emergency" },
  { id: "97", text: "Call 911", category: "emergency" },
  { id: "98", text: "Can't breathe", category: "emergency" },
  { id: "99", text: "Something's wrong", category: "emergency" },
  { id: "100", text: "Severe pain", category: "emergency" },
  { id: "101", text: "Need nurse now", category: "emergency" },
  { id: "102", text: "Falling", category: "emergency" },
  { id: "103", text: "Chest pain", category: "emergency" },
  { id: "104", text: "Help me up", category: "emergency" },
  { id: "105", text: "Choking emergency", category: "emergency" },
  { id: "106", text: "Can't move", category: "emergency" },
  { id: "107", text: "Trouble swallowing", category: "emergency" },
  { id: "108", text: "Need oxygen", category: "emergency" },
  { id: "109", text: "Seizure", category: "emergency" },
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
