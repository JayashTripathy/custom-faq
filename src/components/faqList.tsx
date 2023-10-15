import { Faq } from "@/types/faq";
import { StrictModeDroppable } from "@/utils/StrictModeDroppable";
import { GripVertical } from "lucide-react";
import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
const faqData: Faq[] = [
  {
    id: 1,
    question: "What is Lorem Ipsum?",
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: 2,
    question: "Why do we use it?",
    answer:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    id: 3,
    question: "Where does it come from?",
    answer:
      "Contrary to popular belief, Lorem Ipsum is not simply random text.",
  },
  {
    id: 4,
    question: "How can I use Lorem Ipsum?",
    answer:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
  },
  {
    id: 5,
    question: "Is it useful for web development?",
    answer:
      "Yes, it can be useful for creating placeholder text in web development and design projects.",
  },
  {
    id: 6,
    question: "What are the alternatives to Lorem Ipsum?",
    answer:
      "There are several alternatives to Lorem Ipsum, such as Bacon Ipsum, Cupcake Ipsum, and more.",
  },
  {
    id: 7,
    question: "How can I get started with Lorem Ipsum?",
    answer:
      "You can easily generate Lorem Ipsum text online or use libraries that provide it.",
  },
];

function faqList() {
  const [faqs, setFaqs] = useState(faqData);

  function handleOnDragEnd(result: DropResult) {
    if (!result.destination) return;

    const items = Array.from(faqs);
    const [reorderedItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, reorderedItem as Faq);
    setFaqs(items);
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <StrictModeDroppable droppableId="faqs">
        {(provided) => (
          <ul
            className="flex flex-col gap-3 rounded-2xl border p-4"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {faqs.map((faq, index) => {
              return (
                <Draggable
                  key={faq.id}
                  draggableId={faq.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <li
                      className="relative flex items-center gap-2 rounded-xl bg-secondary"
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <div className=" h-full  p-4">
                        <GripVertical size={25} className="text-gray-400/70" />
                      </div>

                      <div className="border-l-2 border-background/30 p-4 ">
                        <div className="text-lg ">{faq.question}</div>
                        <div className="">{faq.answer}</div>
                      </div>
                    </li>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </ul>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}

export default faqList;
