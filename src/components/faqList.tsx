import { Faq } from "@/types/faq";
import { StrictModeDroppable } from "@/utils/StrictModeDroppable";
import {
  CopyPlusIcon,
  Edit,
  GripVertical,
  Pencil,
  Plus,
  Trash,
  Trash2,
} from "lucide-react";
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
import { UseFieldArrayReplace, set } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

type FaqMode = "add" | "edit";

function FaqList(props: {
  updateFaq: UseFieldArrayReplace<
    {
      title: string;
      faqs: {
        id: number;
        question: string;
        answer: string;
      }[];
      logo?: string | undefined;
      backdrop?: string | undefined;
      organization?: string | undefined;
      description?: string | undefined;
      address?: string | undefined;
      socials: {
        name: string;
        url: string;
      }[];
    },
    "faqs"
  >;
}) {
  const { toast } = useToast();
  const { updateFaq } = props;
  const [faqs, setFaqs] = useState([] as Omit<Faq, "faqId">[]);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });
  const [editMode, setEditMode] = useState<null | FaqMode>(null);
  const [currFaqId, setCurrFaqId] = useState<number | null>(null);

  function handleOnDragEnd(result: DropResult) {
    if (!result.destination) return;

    const { source, destination } = result;
    const items = [...faqs];

    const [reorderedItem] = items.splice(source.index, 1);

    if (!reorderedItem) return;
    items.splice(destination.index, 0, reorderedItem);

    setFaqs(items);
  }
  const validateFaq = () => {
    if (formData.question === "") {
      toast({
        title: "Question is required.",
        type: "background",
        duration: 2000,
      });
      return false;
    } else if (formData.answer === "") {
      toast({
        title: "Answer is required.",
        type: "background",
        duration: 2000,
      });
      return false;
    }
    return true;
  };

  const addFaq = () => {
    const isValid = validateFaq();
    if (isValid) {
      const index = faqs.length + 1;
      try {
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

        setEditMode(null);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const editFaq = (id: number) => {
    setCurrFaqId(id);
    const index = faqs.findIndex((faq) => faq.id === id);
    const newFaq = [...faqs];
    const currentFaq = newFaq[index];
    if (currentFaq) {
      setFormData(currentFaq);
      setEditMode("edit");
    }
  };

  const deleteFaq = (id: number) => {
    const newfaq = faqs.filter((faq) => faq.id !== id);
    setFaqs(newfaq);
  };

  useEffect(() => {
    updateFaq(faqs);
  }, [faqs]);

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <StrictModeDroppable droppableId="faqs">
          {(provided) => (
            <ul
              className="flex flex-col gap-3 rounded-2xl border p-2 md:p-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="flex items-center justify-between ">
                ALL FAQ&apos;s
                <div>
                  {/* feature to add  */}
                  {/* <Button className="mx-2" variant={"outline"} type="button">
                    Import JSON
                  </Button> */}

                  <Button
                    className=""
                    variant={"outline"}
                    type="button"
                    onClick={() => setEditMode("add")}
                  >
                    Add <Plus size={20} className="ml-2 text-primary" />
                  </Button>
                </div>
              </div>

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
                        <div className=" flex  h-full items-center justify-center p-1 md:p-4">
                          <GripVertical
                            size={25}
                            className="text-gray-400/70"
                          />
                        </div>

                        <div className="flex-1 border-l-2 border-background/30 p-2 md:p-4 ">
                          <div className="text-sm md:text-lg">
                            {faq.question}
                          </div>
                          <div className="">{faq.answer}</div>
                        </div>
                        <button type="button" onClick={() => editFaq(faq.id)}>
                          <Pencil />
                        </button>
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
                                  FAQ
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

      <AlertDialog open={editMode === null ? false : true}>
        <AlertDialogContent>
          <AlertDialogHeader className=" mb-6  flex items-start">
            <AlertDialogTitle className="flex gap-3 capitalize">
              {editMode == "edit" ? <Edit /> : <CopyPlusIcon />}
              {editMode}
            </AlertDialogTitle>
            <br />
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
              value={formData.answer}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setFormData({
                  question: "",
                  answer: "",
                });
                setEditMode(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                const isValid = validateFaq();
                if (editMode === "edit" && isValid) {
                  const index = faqs.findIndex((faq) => faq.id === currFaqId);
                  const newFaq = [...faqs];
                  const currentFaq = newFaq[index];
                  if (currentFaq) {
                    newFaq[index] = {
                      ...currentFaq,
                      ...formData,
                    };
                    setFaqs(newFaq);
                    setEditMode(null);
                    setFormData({
                      question: "",
                      answer: "",
                    });
                  }
                } else if (editMode === "add") {
                  addFaq();
                }
              }}
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default FaqList;
