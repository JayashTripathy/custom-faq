import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const mainFaq = await prisma.faq.create({
    data: {
      title: "WiseFAQ",
      description:
        "WiseFAQ is a no-code application that allows you to build FAQ pages for your products, services, events, stores, or anything else that requires seamless integration. With a few clicks and the entry of your information, your FAQ page is up and running, ready for you to share with anybody. You may also customize your style when designing your page to meet your specific requirements. Furthermore, it is an AI-enabled FAQ page builder, allowing you to develop AI agents that are properly trained and fine-tuned with your data, allowing your page readers to receive their info quickly.",
      logo: "https://res.cloudinary.com/dqibqcwdv/image/upload/v1701509622/mo6pn8nt5vlzkaydpuvm.jpg",
      backdrop:
        "https://res.cloudinary.com/dqibqcwdv/image/upload/v1701509623/ltgtlyrc5auzbpemzhsy.jpg",
      organization: "wisefaq.vercel.app",
      address: "CG, India",
      aiMode: false,
      theme: "purple",
      faqs: {
        create: [
          {
            question: "What is WiseFAQ???",
            answer:
              "WiseFAQ is a no-code tool enabling quick creation of customizable FAQ pages for diverse purposes. It incorporates AI, allowing users to build specialized agents for swift and personalized information retrieval, enhancing the user experience. With a few clicks and details input, users can effortlessly launch their FAQ pages.",
          },
          {
            question: "Can I create multiple FAQ pages?",
            answer:
              "Within the dashboard section, WiseFAQ empowers users to seamlessly craft multiple FAQ pages tailored for distinct purposes, effectively catering to diverse audiences. This feature enables a professional and efficient means of addressing varied information needs for different aspects of your business or service offerings.",
          },
          {
            question:
              "Is there any criteria for custom AI agents in our pages?",
            answer:
              "Once a FAQ page aligns with the specified criteria for an AI agent, WiseFAQ offers an 'AI' option in the admin panel. Enabling this option seamlessly integrates a custom AI agent into your FAQ page, allowing users to interact and obtain information with enhanced efficiency and precision.",
          },
          {
            question: "How many customizing options are there?",
            answer:
              "Right now, you can just change the theme of the page, but in the future, you will be able to alter the typefaces, the design of the FAQ, and many other things.",
          },
          {
            question: "In which tech stack WiseFAQ built?",
            answer:
              "WiseFAQ is constructed on the NextJS framework, employing TailwindCSS for styling, Prisma as its Object-Relational Mapping (ORM) tool, trpc for ensuring type safety in client-server interactions, Supabase as the underlying Postgres database, and Langchain for handling the intricate AI components within the application. This tech stack collectively enhances the platform's performance, scalability, and robustness across various functionalities.",
          },
          {
            question: "How AI functionality works behind the scenes?",
            answer:
              "Upon data validation for AI agent creation, WiseFAQ generates vector embeddings of your page, storing them in the vector store. When a viewer engages with the AI agent, the system conducts a similarity search on the vector store, retrieving relevant splits. These, along with the user's question and previous chat context, are then sent to the transformer, yielding an output that enhances the responsiveness and accuracy of the interaction. This process ensures a dynamic and personalized experience for users interacting with the AI agent.",
          },
          {
            question:
              "Do the users need to log in to interact with the FAQ page?",
            answer:
              "Not at all, WiseFAQ prioritizes user privacy and accessibility. Users can access FAQ pages without providing any personal information, and the AI chat functionality operates without requiring user login. Moreover, the chat interactions are locally stored, addressing privacy concerns and ensuring a secure and confidential user experience throughout the engagement with the AI agent.",
          },
        ],
      },
      socials: {
        create: [
          {
            name: "Creator",
            url: "https://jayash.space/",
          },
          {
            name: "GitHub",
            url: "https://github.com/JayashTripathy/wise-faq",
          },
        ],
      },
    },
  });

  console.log({ mainFaq });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
