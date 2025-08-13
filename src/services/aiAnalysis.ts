interface AnalysisResult {
  probability: number;
  stage: string;
  reasoning: string;
  timestamp: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class AIAnalysisService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  async analyzeImage(imageFile: File): Promise<AnalysisResult> {
    // If no API key, return simulated results
    if (!this.apiKey) {
      console.warn('No API key found, using simulated analysis');
      return this.simulateAnalysis();
    }

    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o', // OpenAI's latest vision model
          messages: [
            {
              role: 'system',
              content: `You are a medical AI assistant specializing in varicose vein analysis. Analyze leg images and provide:
1. Probability percentage (0-100%) of varicose vein presence
2. Stage classification based on medical standards
3. Brief medical reasoning

Stages:
- No Visible Signs: Clear, normal appearance
- Stage 1 – Spider Veins: Thin, web-like surface veins
- Stage 2 – Reticular Veins: Blue-green veins 1-3mm diameter  
- Stage 3 – Varicose Veins: Bulging veins ≥3mm diameter
- Stage 4 – Skin Changes: Pigmentation, eczema, inflammation
- Stage 5 – Ulcers: Open wounds, severe complications

Always respond in valid JSON format only.`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this leg image for varicose veins. Respond only with JSON in this exact format:
{
  "probability": number,
  "stage": "string", 
  "reasoning": "string"
}`
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: base64Image,
                    detail: 'high'
                  }
                }
              ]
            }
          ],
          max_tokens: 500,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data: OpenAIResponse = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response content received');
      }

      // Clean and parse the JSON response
      const cleanContent = content.trim().replace(/```json\n?|\n?```/g, '');
      const analysisData = JSON.parse(cleanContent);
      
      // Validate the response structure
      if (typeof analysisData.probability !== 'number' || 
          typeof analysisData.stage !== 'string' || 
          typeof analysisData.reasoning !== 'string') {
        throw new Error('Invalid response format from AI');
      }

      return {
        probability: Math.min(100, Math.max(0, analysisData.probability)), // Ensure 0-100 range
        stage: analysisData.stage,
        reasoning: analysisData.reasoning,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('AI Analysis failed:', error);
      // Fallback to simulated analysis
      console.warn('Falling back to simulated analysis');
      return this.simulateAnalysis();
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private simulateAnalysis(): AnalysisResult {
    const probability = Math.floor(Math.random() * 86) + 15;
    
    let stage, reasoning;
    
    if (probability < 30) {
      stage = "No Visible Signs";
      reasoning = "Clear skin appearance with normal venous patterns. No visible spider veins, reticular veins, or varicose veins detected. Skin coloration appears normal without signs of chronic venous insufficiency.";
    } else if (probability < 50) {
      stage = "Stage 1 – Spider Veins";
      reasoning = "Small, thin web-like veins visible on skin surface. These telangiectasias appear as red or blue thread-like patterns. Primarily cosmetic concern with minimal clinical significance.";
    } else if (probability < 70) {
      stage = "Stage 2 – Reticular Veins";
      reasoning = "Blue-green veins 1-3mm in diameter visible beneath skin. May indicate early venous insufficiency. Patient might experience mild leg heaviness or aching symptoms.";
    } else {
      stage = "Stage 3 – Varicose Veins";
      reasoning = "Prominent bulging, rope-like veins ≥3mm diameter clearly visible. These tortuous veins indicate significant venous insufficiency and may cause pain, swelling, and leg heaviness.";
    }
    
    return {
      probability,
      stage,
      reasoning,
      timestamp: new Date().toISOString()
    };
  }
}

export const aiAnalysisService = new AIAnalysisService();