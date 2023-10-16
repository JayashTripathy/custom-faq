import { Faq } from "@/types/faq";
import { StrictModeDroppable } from "@/utils/StrictModeDroppable";
import { GripVertical, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "./ui/textarea";
import { UseFieldArrayReplace } from "react-hook-form";


function FaqList(props: {
  updateFaq: UseFieldArrayReplace<
    {
      title: string;
      faqs: {
        id: number;
        question: string;
        answer: string;
      }[];
      organization?: string | undefined;
      description?: string | undefined;
      address?: string | undefined;
    },
    "faqs"
  >;
}) {
  const { updateFaq } = props;
  const [faqs, setFaqs] = useState([] as Faq[]);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  function handleOnDragEnd(result: DropResult) {
    if (!result.destination) return;

    const { source, destination } = result;
    const items = [...faqs];

    const [reorderedItem] = items.splice(source.index, 1);

    if (!reorderedItem) return;
    items.splice(destination.index, 0, reorderedItem);

    setFaqs(items);
  }

  const addFaq = () => {
    const index = faqs.length + 1;

    setFaqs([
      ...faqs,
      {
        ...formData,
        id: index,
      },
    ]);

    setFormData({
      question: "",
      answer: "",
    });
  };

  useEffect(() => {
    updateFaq(faqs);
  }, [faqs]);

  return (
    <AlertDialog>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <StrictModeDroppable droppableId="faqs">
          {(provided) => (
            <ul
              className="flex flex-col gap-3 rounded-2xl border p-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="flex items-center justify-between ">
                ALL FAQ&apos;s
                <AlertDialogTrigger asChild>
                  <Button className="" variant={"outline"}>
                    Add more <Plus size={20} className="ml-2 text-primary" />
                  </Button>
                </AlertDialogTrigger>
              </div>
              <AlertDialogContent>
                <AlertDialogHeader className=" mb-6  flex items-start">
                  <AlertDialogTitle>Add a new faq</AlertDialogTitle>
                  <Label htmlFor="question">Question</Label>
                  <Input
                    name="question"
                    value={formData.question}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea
                    name="answer"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-primary hover:bg-primary/90"
                    onClick={addFaq}
                  >
                    {" "}
                    Add
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
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
                          <GripVertical
                            size={25}
                            className="text-gray-400/70"
                          />
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
    </AlertDialog>
  );
}

export default FaqList;
