import { openai } from "@/lib/openai";
import { vectorEmbeddings } from "@/utils/createPageEmbeddings";
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";
import { Storage } from "@/storage";

export const config = {
  runtime: "edge",
};

type Context = {
  pageContent: string[];
  metadata: any;
};
const handler = async (req: NextRequest) => {
  const data = (await req.json()) as {
    faqId: string;
    question: string;
    context: Context[];
    prevQuestions: Storage["messages"] | [];
  };

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversaton if needed) which includes data of a faq page which include all the pagedata including mainly faq's for it  to answer the users question in text format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in text format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
            
   
        \n----------------\n
  
        PREVIOUS CONVERSATION:
   
        
        \n----------------\n
      CONTEXT:
      ${data.context.map((r) => r.pageContent).join("\n\n")}
      
      Question: ${data.question}`,
      },
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
};

export default handler;
