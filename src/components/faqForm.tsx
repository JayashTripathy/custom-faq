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
import { CheckCircle, Key, Pencil, PlusCircle, Trash, X } from "lucide-react";
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
import { formSchema } from "@/lib/validators/FaqForm";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { pageFonts, pagethemes } from "@/utils/pageThemes";
import { useTheme } from "next-themes";
import type { Faq, Social, FaqItem } from "@prisma/client";
import Loader from "./loader";
import { FONT } from "@prisma/client";
import useDebounce from "@/hooks/useDebounce";

type cropperType = "logo" | "backdrop";

export function FaqForm(props: {
  mode?: "create" | "edit";
  existingFaqData?: Faq & { socials: Social[] } & { faqs: FaqItem[] };
}) {
  const { mode = "create", existingFaqData } = props;
  const router = useRouter();
  const { toast } = useToast();
  const { theme, systemTheme } = useTheme();
  const [pageLogo, setPageLogo] = useState<string | null>(null);
  const [backdrop, setBackdrop] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);

  const [cropperType, setCropperType] = useState<cropperType | null>(null);
  const [titleAvailable, setTitleAvailable] = useState<boolean | null>(null);

  const createFaqMutation = api.faq.create.useMutation();
  const updateFaqMutation = api.faq.update.useMutation();
  const isTitleAvailableMutation = api.faq.checkIsTitleAvailable.useMutation();

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
      font: FONT.LATO,
    },
  });

  // const [socials, setSocials] = useState(form.getValues("socials"));
  const [loading, setLoading] = useState(false);
  const [socialInput, setSocialInput] = useState({
    name: "",
    url: "",
  });
  const [selectedTheme, setSelectedTheme] = useState(
    existingFaqData?.theme ?? form.getValues("theme"),
  );

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
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
        title: values.title.trim(),
        logo,
        backdrop,
      };

      createFaqMutation.mutate(finalValues, {
        onSuccess: (data) => {
          toast({
            title: "Success!",
            description: "Your FAQ page has been created successfully.",
            duration: 3000,
          });
          setLoading(false);
          void router.push("/dashboard");
        },
        onError: (err) => {
          toast({
            title: "Error!",
            description: "Internaval server error. Please try again later.",
          });
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Error converting Blob URL to File:", error);
      return null;
    }
  };
  const onUpdate = async (values: z.infer<typeof formSchema>) => {
    let canUpdate = false;

    Object.entries(values).forEach(([key, val]) => {
      if (key == "faqs" || key == "socials") return;
      if (existingFaqData && existingFaqData[key as keyof Faq] != val) {
        console.log(
          existingFaqData && existingFaqData[key as keyof Faq],
          val,
          key,
        );
        canUpdate = true;
      }
    });

    if (existingFaqData?.faqs) {
      if (existingFaqData.faqs.length != values.faqs.length) {
        canUpdate = true;
      } else {
        existingFaqData.faqs.forEach((faq, index) => {
          if (faq.question != values.faqs[index]?.question) {
            canUpdate = true;
          }
          if (faq.answer != values.faqs[index]?.answer) {
            canUpdate = true;
          }
        });
      }
    }

    if (existingFaqData?.socials) {
      if (existingFaqData.socials.length != values.socials.length) {
        console.log("socials length not equal");
        canUpdate = true;
      } else {
        existingFaqData.socials.forEach((socials, index) => {
          if (socials.name != values.socials[index]?.name) {
            console.log("socials name not equal");
            canUpdate = true;
          }
        });
      }
    }

    if (canUpdate) {
      try {
        setLoading(true);
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
          title: values.title.trim(),
          logo,
          backdrop,
        };

        {
          existingFaqData?.id &&
            updateFaqMutation.mutate(
              {
                faqId: existingFaqData.id,
                ...finalValues,
              },
              {
                onSuccess: (data) => {
                  toast({
                    title: "Updated!",
                    description: "Your FAQ page has been updated successfully.",
                    duration: 3000,
                  });
                  setLoading(false);
                  void router.push("/dashboard");
                },
                onError: (err) => {
                  toast({
                    title: "Error!",
                    description:
                      "Internaval server error. Please try again later.",
                  });
                  setLoading(false);
                },
              },
            );
        }
      } catch (error) {
        console.error("Error converting Blob URL to File:", error);
        return null;
      }
    } else {
      toast({
        title: "Error!",
        description: "Nothing to update.",
      });
    }
  };

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

  const onAddSocial = () => {
    if (!socialInput.name || !socialInput.url) {
      toast({
        variant: "default",
        title: "Error!",
        description: `Please fill all the fields`,
      });
      return;
    }
    const currVal = form.getValues("socials");
    form.setValue("socials", currVal.concat(socialInput));
    setSocialInput({
      name: "",
      url: "",
    })
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
    } else {
      form.setValue("logo", "");
    }

    if (backdrop) {
      form.setValue("backdrop", backdrop);
    } else {
      form.setValue("backdrop", "");
    }
  }, [pageLogo, backdrop]);


  useEffect(() => {
    if (mode == "edit" && existingFaqData) {
      form.setValue("title", existingFaqData.title, { shouldDirty: false });
      existingFaqData.organization &&
        form.setValue("organization", existingFaqData.organization, {
          shouldDirty: false,
        });
      existingFaqData.description &&
        form.setValue("description", existingFaqData.description, {
          shouldDirty: false,
        });
      existingFaqData.address &&
        form.setValue("address", existingFaqData.address);
      existingFaqData.theme && handlePageThemeChange(existingFaqData.theme);
      existingFaqData.font && form.setValue("font", existingFaqData.font);
      setPageLogo(existingFaqData.logo);
      setBackdrop(existingFaqData.backdrop);
      existingFaqData.socials &&
        form.setValue("socials", existingFaqData.socials);
    }
  }, [mode]);

  const debouncedTitleCheck = useDebounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        (existingFaqData && e.target.value === existingFaqData?.title) ||
        e.target.value == ""
      ) {
        setTitleAvailable(null);
        return;
      }
      isTitleAvailableMutation.mutate(
        { title: e.target.value },
        {
          onSuccess: (data) => {
            console.log("request success  ");
            if (data == true) {
              setTitleAvailable(true);
            } else {
              setTitleAvailable(false);
            }
          },
        },
      );
    },
    1000,
  );

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
            .handleSubmit(mode == "create" ? onSubmit : onUpdate)()
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
                  <FormControl onChange={debouncedTitleCheck}>
                    <Input placeholder="WiseFAQ" {...field} />
                  </FormControl>
                  {isTitleAvailableMutation.isLoading && (
                    <div className="flex whitespace-nowrap text-sm text-secondary-foreground/50 ">
                      <Loader className="mx-2 w-3" />
                      Checking availability of title...{" "}
                    </div>
                  )}
                  {!isTitleAvailableMutation.isLoading &&
                  titleAvailable == true ? (
                    <div className="flex items-center whitespace-nowrap text-sm  text-green-400 ">
                      <CheckCircle className="mx-2 w-3" />
                      Title is available{" "}
                    </div>
                  ) : titleAvailable == false ? (
                    <div className="flex items-center whitespace-nowrap text-sm  text-red-400 ">
                      <CheckCircle className="mx-2 w-3" />
                      Title not available{" "}
                    </div>
                  ) : (
                    <></>
                  )}
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

        <div>
          <h1 className="text-xl font-bold ">Socials</h1>
          <div className="flex gap-3">
            {form.watch("socials").map((social, index) => (
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
                  onClick={() => {
                    const curVal = form.getValues("socials");
                    const updatedSocials = curVal.filter((_, i) => i !== index);
                    console.log(updatedSocials);
                    form.setValue("socials", updatedSocials);
                  }}
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
            onClick={onAddSocial}
          >
            Add
          </Button>
        </div>
        <div>
          <h1 className="text-xl font-bold ">Add FAQ&apos;s</h1>
          <div className="my-3">
            <FaqList
              updateFaq={replace}
              defaultFaqs={existingFaqData?.faqs ?? undefined}
            />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold ">Choose Font</h1>
          <br />
          <div className="grid  grid-cols-[repeat(auto-fit,_minmax(200px,1fr))] gap-2 px-2">
            {Object.entries(pageFonts)?.map(([fontName, variable], index) => {
              return (
                <button
                  key={fontName}
                  type="button"
                  className={` "mt-5 box-border  flex h-32 w-full flex-col justify-center rounded-lg  border p-5 text-left duration-200 ease-in-out hover:bg-accent   ${
                    fontName == form.watch("font") && "bg-accent"
                  } `}
                  style={{
                    fontFamily: `var(${variable})`,
                  }}
                  onClick={() => form.setValue("font", fontName as FONT)}
                >
                  <h1 className="text-lg font-bold">
                    {fontName.replace("_", " ")}
                  </h1>
                  This is a quick brown fox jumps over the lazy dog
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold ">Choose theme</h1>

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
              return (
                <button
                  type="button"
                  key={index}
                  onClick={() => handlePageThemeChange(els.name)}
                  className="mt-5 box-border  flex h-32 w-full flex-col justify-center rounded-lg  border p-5 text-left duration-200 ease-in-out hover:bg-accent    "
                  style={{
                    border: selected
                      ? `2px solid ${color}`
                      : "2px solid 		rgb(72, 86, 106, .2)",
                  }}
                >
                  <div
                    className=" text-2xl   "
                    style={{
                      color: color,
                    }}
                  >
                    {els.name}
                    <span className="text-sm ">
                      {" "}
                      {els.name === "purple" && "(default)"}
                    </span>
                  </div>
                  {Array(2)
                    .fill(0)
                    .map((_, index) => (
                      <div className="w-full" key={els.name + index}>
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
        {mode == "create" ? (
          <Button
            type="submit"
            disabled={loading || titleAvailable == false}
            className="w-full py-6 text-2xl font-bold"
          >
            {!loading ? "Submit" : <Loader className="w-6 " />}
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={loading || titleAvailable == false}
            className="w-full py-6 text-2xl font-bold"
          >
            {!loading ? "save" : <Loader className="w-6 " />}
          </Button>
        )}
      </form>
      <br />
    </Form>
  );
}
