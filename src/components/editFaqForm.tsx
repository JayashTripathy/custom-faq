"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { CSSProperties } from "react";

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

export function EditFaqForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "test",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <div className="relative my-3 grid w-full items-center gap-1.5 rounded-3xl bg-card py-6 mb-20">
        <Label
          htmlFor="backdrop"
          className="grid  aspect-[5/1] items-center justify-center rounded-3xl  border-2 bg-muted p-3 "
          style={{
            "--main-logo-p": 0.5,
          } as CSSProperties}
        >
          <PlusCircle size={44} />
        </Label>
        <Input id="backdrop" type="file" className=" hidden" placeholder=" " />
        <Label
          htmlFor="pageLogo"
          className="grid aspect-square w-40 items-center justify-center rounded-3xl border-[5px]  bg-muted p-3  absolute border-background left-1/2 -bottom-14 -translate-x-1/2   "
        >
          <PlusCircle size={44} />
        </Label>
        <Input id="pageLogo" type="file" className=" hidden" placeholder=" " />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Button type="submit" className="w-full py-6 text-2xl font-bold">
          Submit
        </Button>
      </form>
    </Form>
  );
}
