import { JSONLoader } from "langchain/document_loaders/fs/json";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

import { TextLoader } from "langchain/document_loaders/fs/text";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { supabaseClient } from "@/lib/supabaseClient";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Faq, Social } from "@/types/faq";
import { formSchema } from "@/lib/validators/editFaqForm";
import { z } from "zod";
import ChatOpenAI from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY!,
});

export const createEmbeddings = async (props: {
  data: z.infer<typeof formSchema> & { id: string };
}) => {
  const { data } = props;
  if (!data.faqs) return;

  function formatFAQ(question: string, answer: string) {
    return `Question: ${question}\nAnswer: ${answer}`;
  }

  const { title, description, address, backdrop, logo, theme, socials } = data;

  const filteredProps = {
    title,
    description,
    address,
    backdrop,
    logo,
    theme,
  };

  const formattedOtherDetails = Object.entries(filteredProps).map(
    ([key, value]) => `${key}: "${value}".\n`,
  );
  const formatedSocials =
    socials &&
    socials.map(
      (social: Social) =>
        `The name of the website link is "${social.name}" and the URL for this is  "${social.url}."`,
    );

  if (!data.faqs) return;
  const formattedFaq = data.faqs
    .map((faq) => formatFAQ(faq.question, faq.answer))
    .join("\n");

  const stagingTrainingData = new Blob(
    [
      ...formattedOtherDetails,
      "\n",
      "Frequently asked question are -\n",
      ...formattedFaq,
      "\n",
      ...formatedSocials,
    ],
    { type: "text/plain" },
  );

  const loader = new TextLoader(stagingTrainingData);
  const dataset = await loader.load();

  const trainingData = dataset.map((item) => ({
    pageContent: item.pageContent,
    metadata: { ...item.metadata, faqId: data.id, faqTitle: data.title },
  }));

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 3000,
    chunkOverlap: 50,
    lengthFunction: (item) => item.length,
  });
  const splittedTrainingData = await splitter.splitDocuments(trainingData);

  const client = supabaseClient();
  await SupabaseVectorStore.fromDocuments(splittedTrainingData, embeddings, {
    client,
    tableName: "documents",
    queryName: "match_documents",
  });
};
