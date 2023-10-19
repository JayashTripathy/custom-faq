"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useFieldArray, useForm } from "react-hook-form";

import * as z from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { Pencil, PlusCircle, Trash } from "lucide-react";
import {
  CSSProperties,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Textarea } from "./ui/textarea";
import FaqList from "./faqList";
import { useToast } from "@/components/ui/use-toast";
import CropperModal from "./modals/cropperModal";
import BottomDrawer from "./drawer/bottomDrawer";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  organization: z.string().min(2).max(50).optional().or(z.literal("")),
  description: z.string().min(2).max(150).optional().or(z.literal("")),
  address: z.string().min(2).max(100).optional().or(z.literal("")),
  faqs: z
    .array(
      z.object({ id: z.number(), question: z.string(), answer: z.string() }),
    )
    .min(1),
});

type cropperType = "logo" | "backdrop";

export function EditFaqForm() {
  const { toast } = useToast();

  const [pageLogo, setPageLogo] = useState<string | null>(null);
  const [backdrop, setBackdrop] = useState<string | null>(null);

  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);

  const [cropperType, setCropperType] = useState<cropperType | null>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      organization: "",
      description: "",
      address: "",
      faqs: [],
    },
  });

  const { replace } = useFieldArray({ name: "faqs", control: form.control });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values final", values);
  }

  const closeCropper = () => {
    setCropperOpen(false);
    setCropperImage(null);
    setCropperType(null);
  };

  const handleLogoChange = (e: SyntheticEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const file = e.currentTarget.files?.[0];
      const img = file && URL.createObjectURL(file);
      if (img) {
        setCropperType("logo");
        setCropperImage(img);
        setCropperOpen(true);
      }
      e.currentTarget.value = "";
    }
  };
  const backdropChange = (e: SyntheticEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const file = e.currentTarget.files?.[0];
      const img = file && URL.createObjectURL(file);
      if (img) {
        setCropperType("backdrop");
        setCropperImage(img);
        setCropperOpen(true);
      }
      e.currentTarget.value = "";
    }
  };

  const cropperConfig = [
    {
      type: "logo",
      onclose: closeCropper,
      onconfirm: (img: string) => {
        setPageLogo(img);
        closeCropper();
        toast({
          title: "Success!",
          description: "Backdrop image updated.",
          type: "background",
        });
      },
      aspect: 1,
    },
    {
      type: "backdrop",
      onclose: closeCropper,
      onconfirm: (img: string) => {
        setBackdrop(img);
        closeCropper();
        toast({
          title: "Success!",
          description: "Backdrop image updated.",
        });
      },
      aspect: 5 / 1,
    },
  ];

  const selectedCropper = cropperConfig.find((c) => c.type === cropperType);
  useEffect(() => {
    if (form.formState.errors.faqs) {
      toast({
        variant: "default",
        title: "Error!",
        description: `Please add atleast 1 FAQ`,
      });
    }
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      {selectedCropper && (
        <CropperModal
          open={cropperOpen}
          onClose={selectedCropper.onclose}
          image={cropperImage}
          onConfirm={selectedCropper.onconfirm}
          aspect={selectedCropper.aspect}
        />
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form
            .handleSubmit(onSubmit)()
            .catch((err) => console.log("Unexpected error", err));
        }}
        className="space-y-8"
      >
        <div className="relative my-3 mb-20 grid w-full items-center gap-1.5 rounded-3xl bg-card py-6">
          <Label
            htmlFor="backdrop"
            className="grid  aspect-[5/1] w-full items-center justify-center overflow-hidden   rounded-3xl bg-muted   "
            style={
              {
                "--main-logo-p": 0.5,
                backgroundImage: `url(${backdrop})`,
                backgroundSize: "cover",
              } as CSSProperties
            }
          >
            {!backdrop ? (
              <PlusCircle size={44} />
            ) : (
              <BottomDrawer
                title="Options"
                trigger={
                  <Button
                    type="button"
                    variant={"outline"}
                    className="absolute bottom-1 right-10 flex  h-12 w-12 items-center  justify-center rounded-full  border-2 p-3   "
                  >
                    <Pencil />
                  </Button>
                }
                content={
                  <div className="py-10">
                    <button
                      className=" flex items-center gap-4 text-xl"
                      onClick={() => setBackdrop(null)}
                    >
                      <Trash className=" text-destructive " /> Remove backdrop
                      image
                    </button>
                  </div>
                }
              />
            )}
          </Label>
          <Input
            id="backdrop"
            type="file"
            className=" hidden"
            placeholder=" "
            onChange={backdropChange}
            disabled={!!backdrop}
          />
          <Label
            htmlFor="pageLogo"
            className={`} absolute -bottom-16 left-1/2 grid  aspect-square
            w-[120px] -translate-x-1/2  items-center justify-center  rounded-3xl border-[5px] border-background bg-muted p-3   `}
            style={{
              backgroundImage: `url(${pageLogo})`,
              backgroundSize: "cover",
            }}
          >
            {!pageLogo ? <PlusCircle size={44} /> : (
               <BottomDrawer
               title="Options"
               trigger={
                 <Button
                   type="button"
                   variant={"outline"}
                   className="absolute -bottom-4 -right-4 flex  h-8 w-8 items-center  justify-center rounded-full  border-2 p-2   "
                 >
                   <Pencil />
                 </Button>
               }
               content={
                 <div className="py-10">
                   <button
                     className=" flex items-center gap-4 text-xl"
                     onClick={() => setPageLogo(null)}
                   >
                     <Trash className=" text-destructive " /> Remove logo
                   </button>
                 </div>
               }
             />
            )}
          </Label>
          <Input
            id="pageLogo"
            type="file"
            className=" hidden"
            placeholder=" "
            onChange={handleLogoChange}
            disabled={!!pageLogo}
          />
        </div>

        <div className="my-4 flex flex-col gap-8 rounded-xl bg-muted p-4">
          <div className="flex w-full gap-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="WiseFAQ" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is main title of your page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="wise.pvt.ltd" {...field} />
                  </FormControl>
                  <FormDescription>
                    organization / product / company name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your description here."
                    id="message"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type your address here."
                    id="message"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="my-5">
          <FaqList updateFaq={replace} />
        </div>

        <Button type="submit" className="w-full py-6 text-2xl font-bold">
          Submit
        </Button>
      </form>
    </Form>
  );
}
