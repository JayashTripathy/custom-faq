"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useFieldArray, useForm } from "react-hook-form";
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
import { PlusCircle } from "lucide-react";
import { CSSProperties, SyntheticEvent, useEffect, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import FaqList from "./faqList";
import { useToast } from "@/components/ui/use-toast";

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

export function EditFaqForm() {
  const { toast } = useToast();
  const [pageLogo, setPageLogo] = useState<string | null>(null);
  const [backdrop, setBackdrop] = useState<string | null>(null);

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
      <form onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit(onSubmit)().catch((err => console.log("Unexpected error", err)))} } className="space-y-8">
        <div className="relative my-3 mb-20 grid w-full items-center gap-1.5 rounded-3xl bg-card py-6">
          <Label
            htmlFor="backdrop"
            className="grid  aspect-[5/1] w-full items-center justify-center overflow-hidden   rounded-3xl bg-muted  "
            style={
              {
                "--main-logo-p": 0.5,
              } as CSSProperties
            }
          >
            {backdrop ? (
              <img src={backdrop} className="h-full w-full " />
            ) : (
              <PlusCircle size={44} />
            )}
          </Label>
          <Input
            id="backdrop"
            type="file"
            className=" hidden"
            placeholder=" "
            onChange={(e) => {
              const file = e.target.files?.[0];
              const img = file && URL.createObjectURL(file);
              img && setBackdrop(img);
            }}
            disabled={!!backdrop}
          />
          <Label
            htmlFor="pageLogo"
            className={`absolute -bottom-16 left-1/2 grid aspect-square max-w-[120px] ${
              !pageLogo && "w-[120px]"
            } -translate-x-1/2  items-center justify-center  rounded-3xl border-[5px] border-background bg-muted p-3   `}
          >
            {pageLogo ? (
              <img src={pageLogo} className="h-full w-full object-contain" />
            ) : (
              <PlusCircle size={44} />
            )}
          </Label>
          <Input
            id="pageLogo"
            type="file"
            className=" hidden"
            placeholder=" "
            onChange={(e) => {
              const file = e.target.files?.[0];
              const img = file && URL.createObjectURL(file);
              img && setPageLogo(img);
            }}
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
