import OpenAI from "openai";

class OpenAIService {
  private client: OpenAI | null = null;
  private recentMessages: { role: string, content: string }[] = [];

  initialize(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
    
    // Load recent messages from localStorage if available
    const savedMessages = localStorage.getItem('recentAIMessages');
    if (savedMessages) {
      try {
        this.recentMessages = JSON.parse(savedMessages);
      } catch (e) {
        console.error("Error parsing saved AI messages:", e);
      }
    }
    
    return this;
  }

  private addMessage(role: 'user' | 'assistant', content: string) {
    this.recentMessages.push({ role, content });
    
    // Keep only the last 10 messages for context
    if (this.recentMessages.length > 10) {
      this.recentMessages = this.recentMessages.slice(this.recentMessages.length - 10);
    }
    
    // Save to localStorage
    localStorage.setItem('recentAIMessages', JSON.stringify(this.recentMessages));
  }

  async completeText(partialText: string): Promise<string> {
    if (!this.client) {
      throw new Error("OpenAI client not initialized. Call initialize() first.");
    }

    try {
      // Add the user's partial text to the message history
      this.addMessage('user', `Complete this: "${partialText}"`);
      
      const completion = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "You are an assistant helping an ALS patient communicate. Complete their sentences naturally and briefly. Keep responses under 15 words unless absolutely necessary. The patient is typing and needs help completing their thought." 
          },
          ...this.recentMessages.slice(-5), // Include recent context
          {
            role: "user",
            content: `Complete this sentence or thought from the patient's perspective: "${partialText}"`
          }
        ],
        max_tokens: 50,
        temperature: 0.7,
      });

      const completedText = completion.choices[0].message.content || "";
      
      // Add the completion to the message history
      this.addMessage('assistant', completedText);
      
      return completedText;
    } catch (error) {
      console.error("Error completing text:", error);
      throw error;
    }
  }

  async suggestResponses(context: string): Promise<string[]> {
    if (!this.client) {
      throw new Error("OpenAI client not initialized. Call initialize() first.");
    }

    try {
      // Add the context to the message history
      this.addMessage('user', context);
      
      const completion = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: `You are an assistant helping an ALS patient communicate. Generate 5 EXTREMELY BRIEF phrases (2-5 words each) that the patient might want to say next.

CRITICAL RULES:
1. Each phrase MUST be 2-5 words only
2. Each phrase MUST be practical for someone with limited mobility
3. Focus on immediate needs, comfort requests, and simple responses
4. DO NOT bundle multiple phrases together
5. DO NOT use complete sentences when shorter phrases work
6. DO NOT include numbering or formatting in your response
7. ONLY return the 5 phrases, one per line

Examples of GOOD phrases:
- Need water please
- Adjust my pillow
- Too cold
- Call nurse
- Thank you
- Yes please
- Turn TV on
- Need bathroom now`
          },
          ...this.recentMessages.slice(-5), // Include recent context
          {
            role: "user",
            content: `The patient just communicated: "${context}". Suggest 5 brief phrases they might want to say next.`
          }
        ],
        max_tokens: 150,
        temperature: 0.8,
      });

      const content = completion.choices[0].message.content || "";
      
      // Parse the response - split by newlines and clean up
      const suggestions = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && line.length <= 30) // Reasonable length check
        .map(line => {
          // Remove any numbering or bullet points
          return line.replace(/^(\d+\.|\*|-)\s*/, '').trim();
        })
        .slice(0, 5); // Ensure we have at most 5 suggestions
      
      // If we somehow got fewer than 3 suggestions, add some fallbacks
      if (suggestions.length < 3) {
        const fallbacks = ["Yes", "No", "Thank you", "Need help", "Not now"];
        while (suggestions.length < 5) {
          const fallback = fallbacks[suggestions.length];
          if (!suggestions.includes(fallback)) {
            suggestions.push(fallback);
          }
        }
      }
      
      // Add the suggestions to the message history
      this.addMessage('assistant', `Suggested phrases: ${suggestions.join(', ')}`);
      
      return suggestions;
    } catch (error) {
      console.error("Error generating suggestions:", error);
      return ["Need help", "Yes", "No", "Thank you", "Please wait"];
    }
  }
}

export const openaiService = new OpenAIService();
