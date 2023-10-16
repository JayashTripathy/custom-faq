import { Faq } from "@/types/faq";
import { StrictModeDroppable } from "@/utils/StrictModeDroppable";
import { GripVertical, Plus, Trash, Trash2 } from "lucide-react";
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

  const deleteFaq = (id: number) => {
    const newfaq = faqs.filter((faq) => faq.id !== id);
    setFaqs(newfaq);
  };

  useEffect(() => {
    updateFaq(faqs);
  }, [faqs]);

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <StrictModeDroppable droppableId="faqs">
        {(provided) => (
          <ul
            className="flex flex-col gap-3 rounded-2xl border p-4"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <AlertDialog>
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
            </AlertDialog>
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
                      <div className=" flex  h-full items-center justify-center p-4">
                        <GripVertical size={25} className="text-gray-400/70" />
                      </div>

                      <div className="flex-1 border-l-2 border-background/30 p-4 ">
                        <div className="text-lg ">{faq.question}</div>
                        <div className="">{faq.answer}</div>
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            className=" bg-transparent text-destructive/80 transition-all duration-100 ease-in-out hover:text-destructive  "
                            variant={"outline"}
                          >
                            <Trash size={25} className=" " />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your
                              <span className="font-bold text-primary">
                                {" "}
                                FAQ page{" "}
                              </span>{" "}
                              and remove your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteFaq(faq.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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

export default FaqList;
