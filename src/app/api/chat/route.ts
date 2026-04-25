import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { message, propertyId, guestId } = await req.json();

    // 1. Save User Message to Supabase
    const { error: userError } = await supabase
      .from('messages')
      .insert([
        { property_id: propertyId, role: 'user', content: message, guest_id: guestId }
      ]);

    if (userError) throw userError;

    // 2. Fetch Knowledge Base (FAQs) for this property
    const { data: faqs } = await supabase
      .from('faqs')
      .select('*')
      .eq('property_id', propertyId);

    // 3. Mock AI Logic (In V2 we'll send this to OpenAI/Gemini)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    let aiResponse = "";
    const msg = message.toLowerCase();

    // Try to find an answer in our FAQs from Supabase
    const foundFaq = faqs?.find(f => msg.includes(f.question.toLowerCase()));
    
    if (foundFaq) {
      aiResponse = foundFaq.answer;
    } else if (msg.includes("wifi")) {
      aiResponse = "Our WiFi is 'Marrakech_Magic_2024'. It works best in the courtyard!";
    } else if (msg.includes("tour")) {
      aiResponse = "I recommend our Agafay Desert sunset dinner! Would you like the booking link?";
    } else {
      aiResponse = "Salam! Let me check the details for you. Anything else I can help with?";
    }

    // 4. Save AI Response to Supabase
    const { error: aiError } = await supabase
      .from('messages')
      .insert([
        { property_id: propertyId, role: 'assistant', content: aiResponse, guest_id: guestId }
      ]);

    if (aiError) throw aiError;

    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
