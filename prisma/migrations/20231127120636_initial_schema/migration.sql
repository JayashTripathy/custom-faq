-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "Faq" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "backdrop" TEXT,
    "organization" TEXT,
    "address" TEXT,
    "aiMode" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "theme" TEXT,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "faqId" UUID,

    CONSTRAINT "FaqItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Social" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "faqId" UUID,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT,
    "metadata" JSONB,
    "embedding" vector(1536),

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Faq_title_key" ON "Faq"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Faq_title_userId_key" ON "Faq"("title", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "FaqItem_question_answer_faqId_key" ON "FaqItem"("question", "answer", "faqId");

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaqItem" ADD CONSTRAINT "FaqItem_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "Faq"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "Faq"("id") ON DELETE SET NULL ON UPDATE CASCADE;
