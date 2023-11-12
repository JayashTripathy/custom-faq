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
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";

import { Edit2, Plus, Snail, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

function Dashboard() {
  const router = useRouter();
  const faqQuery = api.faq.getAll.useQuery();
  const session = useSession();

  const faqData = faqQuery?.data;
  const { mutate: deleteFaqPage, isLoading: deleteFaqPageLoading } =
    api.faq.delete.useMutation({
      onSuccess: () => {
        void faqQuery.refetch();
      },
    });


  const CreateBtn = (): ReactNode => {
    return (
      <Link href="/dashboard/editfaq">
        <Button className="flex gap-1  p-3 text-xl" variant={"secondary"}>
          Create <Plus size={23} className="text-primary" />{" "}
        </Button>
      </Link>
    );
  };

  return (
    <div className=" absolute top-0 z-0 flex h-screen w-full flex-col p-4  px-10 pt-32  ">
      <div className="mb-4 flex justify-between text-4xl font-bold">
        <div>Library</div>
        <CreateBtn />
      </div>

      <div className="h-full   overflow-auto  rounded-3xl border bg-muted/10 p-4 ">
        {faqData && faqData?.length === 0 ? (
          <div className=" flex h-full w-full flex-col items-center justify-center gap-3">
            <Snail size={30} />
            <div>seems this place is a quiet library</div>
            <CreateBtn />
          </div>
        ) : faqQuery.isLoading ? (
          <div className="flex flex-col gap-4">
            {Array(20)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-20 w-full animate-pulse rounded-xl bg-muted p-3"
                >
                  <div className=" animate-pulse  rounded-xl bg-muted p-3 delay-75 "></div>
                </div>
              ))}
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {faqData
              ?.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((faq) =>  (
                  <AlertDialog key={faq.id}>
                    <li
                      className="flex max-h-[80px] cursor-pointer justify-between  overflow-hidden rounded-lg border bg-accent/70 p-2 shadow-md transition-all duration-75 ease-in-out hover:bg-accent/50 md:p-4 "
                      key={faq.id}
                    >
                      <button
                        onClick={() => void router.push(`/faq/${faq.title}?adminMode=true`)}
                        className="h-(calc(100%-30px)) w-full overflow-hidden text-left"
                      >
                        <div>{faq.title}</div>
                        <div className=" inline-block  w-[calc(80%)] text-ellipsis  text-sm ">
                          {faq.description}
                        </div>
                      </button>
                      <div className="flex items-center justify-center gap-1">
                        <Button variant={"outline"} className="h-12 w-12">
                          <Edit2 />
                        </Button>
                        {deleteFaqPageLoading ? (
                          <div className="h-12 w-12 p-3">
                            <div className="h-full w-full animate-spin rounded-md border-2 border-t-4 border-primary "></div>
                          </div>
                        ) : (
                          <AlertDialogTrigger asChild>
                            <Button
                              variant={"destructive"}
                              className=" h-12 w-12"
                            >
                              <Trash />
                            </Button>
                          </AlertDialogTrigger>
                        )}
                      </div>
                    </li>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the
                          <span className="font-bold text-primary">
                            {" "}
                            {faq.title} 
                          </span>{" "}
                          and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteFaqPage({ faqId: faq.id })}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )
              )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
