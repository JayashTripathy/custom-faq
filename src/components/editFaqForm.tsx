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
import { Pencil, PlusCircle, Trash, X } from "lucide-react";
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
import { formSchema } from "@/lib/validators/editFaqForm";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { pagethemes } from "@/utils/pageThemes";
import { useTheme } from "next-themes";
import { Social } from "@/types/faq";

type cropperType = "logo" | "backdrop";

export function EditFaqForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { theme, systemTheme } = useTheme();

  const [pageLogo, setPageLogo] = useState<string | null>(null);
  const [backdrop, setBackdrop] = useState<string | null>(null);

  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);

  const [cropperType, setCropperType] = useState<cropperType | null>(null);

  const createFaqMutation = api.faq.create.useMutation();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      logo: "",
      backdrop: "",
      organization: "",
      description: "",
      address: "",
      faqs: [],
      theme: "purple",
      socials: [],
    },
  });
  const [socials, setSocials] = useState<Social[]>(form.getValues("socials"));
  const [socialInput, setSocialInput] = useState({
    name: "",
    url: "",
  });
  const [selectedTheme, setSelectedTheme] = useState(form.getValues("theme"));

  const { replace } = useFieldArray({ name: "faqs", control: form.control });

  const uploadToCdn = async (blogUrl: string) => {
    const logoImg = await fetch(blogUrl as RequestInfo | URL);
    if (!logoImg.ok) {
      throw new Error("Invalid logo image");
    }

    const blob = await logoImg.blob();
    const file = new File([blob], "new-file", { type: "image/png" });
    console.log("file", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      `${process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}`,
    );

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
    if (!res.ok) {
      throw new Error("Failed to upload to CDN");
    }
    const data: { secure_url: string } = await res.json();
    return data.secure_url;
  };

  const handlePageThemeChange = (themeName: string) => {
    form.setValue("theme", themeName);
    setSelectedTheme(themeName); // Update the local state immediately
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let logo = values.logo;
      let backdrop = values.backdrop;

      if (values.logo) {
        logo = await uploadToCdn(values.logo);
      }

      if (values.backdrop) {
        backdrop = await uploadToCdn(values.backdrop);
      }

      const finalValues = {
        ...values,
        logo,
        backdrop,
      };

      createFaqMutation.mutate(finalValues, {
        onSuccess: (data) => {
          console.log("submitted data", data);
          toast({
            title: "Success!",
            description: "Your FAQ page has been created successfully.",
            duration: 3000,
          });
          void router.push("/");
        },
        onError: (err) => {
          toast({
            title: "Error!",
            description: err.message,
          });
        },
      });
    } catch (error) {
      console.error("Error converting Blob URL to File:", error);
      return null;
    }
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
          duration: 2000,
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
          duration: 2000,
        });
      },
      aspect: 5 / 1,
    },
  ];

  const addSocial = () => {
    if (!socialInput.name || !socialInput.url) {
      toast({
        variant: "default",
        title: "Error!",
        description: `Please fill all the fields`,
      });
      return;
    }
    setSocials((p) => [...p, socialInput]);
  };

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

  useEffect(() => {
    if (pageLogo) {
      form.setValue("logo", pageLogo);
    }

    if (backdrop) {
      form.setValue("backdrop", backdrop);
    }
  }, [pageLogo, backdrop]);

  useEffect(() => {
    form.setValue("socials", socials);
  }, [socials]);

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
            className={` absolute -bottom-16 left-1/2 grid  aspect-square
            w-[120px] -translate-x-1/2  items-center justify-center  rounded-3xl border-[5px] border-background bg-muted p-3   `}
            style={{
              backgroundImage: `url(${pageLogo})`,
              backgroundSize: "cover",
            }}
          >
            {!pageLogo ? (
              <PlusCircle size={44} />
            ) : (
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

        <h1 className="text-xl font-bold ">Socials</h1>
        <div>
          <div className="flex gap-3">
            {socials.map((social, index) => (
              <div
                className="flex items-center justify-center gap-5 rounded-xl bg-secondary p-3"
                key={index}
              >
                <div>
                  {" "}
                  <span className="font-bold "> {social.name} </span> -{" "}
                  {social.url}
                </div>
                <Button
                type="button"
                  variant={"destructive"}
                  className="m-0 h-5 w-5 rounded-full p-0"
                  onClick={() =>
                    setSocials((p) => p.filter((_, i) => i !== index))
                  }
                >
                  <X className=" text-background" size={15} />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex w-full gap-2 p-3 ">
            <div className="mt-4 flex flex-col gap-2 ">
              <Label htmlFor="socialName" className="font-semibold">
                {" "}
                Name{" "}
              </Label>
              <Input
                name="socialName"
                value={socialInput.name}
                onChange={(e) =>
                  setSocialInput((p) => ({
                    ...p,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mt-4 flex flex-1 flex-col gap-2">
              <Label htmlFor="socialUrl" className="font-semibold">
                {" "}
                URL{" "}
              </Label>
              <Input
                name="url"
                value={socialInput.url}
                onChange={(e) =>
                  setSocialInput((p) => ({
                    ...p,
                    url: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <Button
            type="button"
            className="mt-3 w-full font-bold "
            onClick={addSocial}
          >
            Add
          </Button>
        </div>
        <div>
          <h1 className="text-xl font-bold ">Add FAQ&apos;s</h1>
          <div className="my-3">
            <FaqList updateFaq={replace} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl">Choose theme</h1>

          <div className="grid  grid-cols-[repeat(auto-fit,_minmax(100px,1fr))] gap-2 px-2">
            {pagethemes.map((els, index) => {
              const color =
                theme === "system"
                  ? systemTheme == "dark"
                    ? els.darkColor
                    : els.color
                  : theme == "dark"
                  ? els.darkColor
                  : els.color;

              const selected: boolean = selectedTheme === els.name;
              console.log(selected);
              return (
                <button
                  type="button"
                  key={index}
                  onClick={() => handlePageThemeChange(els.name)}
                  className="mt-5 box-border  flex h-32 w-full flex-col justify-center rounded-lg  border p-5 text-left duration-200 ease-in-out hover:bg-accent   "
                  style={{
                    border: selected ? `2px solid ${color}` : "none",
                  }}
                >
                  <div
                    className=" text-2xl   "
                    style={{
                      color: color,
                    }}
                  >
                    {els.name}
                  </div>
                  {Array(2)
                    .fill(0)
                    .map((_, index) => (
                      <div className="" key={els.name + index}>
                        <span
                          style={{
                            color: color,
                          }}
                        >
                          ▸
                        </span>
                        <div
                          className=" w-full flex-grow border-b-[1px] "
                          style={{
                            borderColor: color,
                          }}
                        ></div>
                      </div>
                    ))}
                </button>
              );
            })}
          </div>
        </div>
        <Button
          type="submit"
          disabled={createFaqMutation.isLoading}
          className="w-full py-6 text-2xl font-bold"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
