import React from "react";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRightCircle } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MainFaqSection from "@/components/mainFaqSection";

const steps = [
  {
    title: "Go to dashboard",
    description: (
      <Link href={"/dashboard"} className="flex gap-2 text-primary">
        {" "}
        Dashboard <ArrowRight size="20" />{" "}
      </Link>
    ),
    image: "/img1.svg",
  },
  {
    title: "Click on create",
    description: " to create your own FAQ page",
    image: "/img2.svg",
  },
  {
    title: "Just Submit!",
    description: "with all your page details",
    image: "/img3.svg",
  },
];

function index() {
  // const {
  //   data: faq,
  //   refetch: refetchFaq,
  //   isLoading: pageLoading,
  // } = api.faq.getFaqPage.useQuery({ faqTitle: "WiseFAQ" });

  return (
    <>
      <div className="absolute left-0 top-0 -z-10 h-screen w-screen bg-[url(/smudge.png)] opacity-40"></div>
      <div className="z-10  mx-auto mb-20 w-screen overflow-hidden overflow-x-hidden md:max-w-[80%]  ">
        <div className="text  shrink-0 whitespace-nowrap py-10 text-center text-2xl md:text-4xl ">
          Craft your FAQ pages
          <br />
          <span className="bg-gradient-to-br from-violet-400  to-primary bg-clip-text font-extrabold italic text-transparent md:text-7xl ">
            {" "}
            Effortlessly!
          </span>
          <Link href={"/dashboard"}>
            <Button
              variant={"outline"}
              className="border-1 mx-auto mt-4 flex h-full items-center justify-center gap-3 rounded-full pr-2 outline-4 md:text-2xl "
            >
              Get your own
              <span className=" rounded-full bg-primary p-2">
                <ChevronRightCircle />
              </span>
            </Button>
          </Link>
          <div className="relative">
            <div className="absolute -left-52 -top-20 -z-[1] md:-left-28   ">
              <svg width="547" height="319" className=" fill-primary ">
                <mask
                  id="a"
                  width="226"
                  height="226"
                  x="161"
                  y="47"
                  maskUnits="userSpaceOnUse"
                >
                  <path d="M353.378 239.322c43.984-43.983 43.978-115.3-.012-159.29-43.991-43.991-115.308-43.997-159.291-.013-43.984 43.983-43.978 115.3.012 159.291 43.991 43.99 115.308 43.996 159.291.012Z" />
                </mask>
                <g mask="url(#a)">
                  <path d="M123.496 193.894v-33.455l33.555.003-.006-33.647 33.454-.001-.002-33.355 33.451.002-.003-33.369 33.534.003-.006-33.565 33.551.006-.003-33.842 18.5.001.001 3.144h-15.356l.002 33.842-33.551-.006.006 33.564-33.533-.002.002 33.369-33.451-.003.003 33.355-33.455.001.003 33.643-33.551.001-.001 33.455-18.336-.001v-3.144l15.192.001Z" />
                  <path d="m139.701 210.099-.003-33.458 33.555.003-.006-33.647 33.454-.001-.002-33.355 33.455.006-.003-33.37h33.53l-.002-33.561 33.547.002.001-33.839 18.496-.002.001 3.144-15.353.002-.001 33.84-33.547-.003.002 33.561-33.53.001.003 33.369-33.455-.006.003 33.355-33.455.001.006 33.647-33.554-.003.002 33.458-18.338-.005-.001-3.144 15.195.005Z" />
                  <path d="M155.903 226.301v-33.455l33.551-.001-.002-33.643 33.454-.001-.002-33.355 33.451.002-.003-33.369 33.534.003-.006-33.565 33.551.006-.003-33.842 18.5.001.001 3.144h-15.356l.002 33.842-33.551-.006.006 33.564-33.533-.002.002 33.369-33.451-.003.003 33.355-33.459-.003.007 33.647-33.551.001-.001 33.455-18.336-.001V226.3l15.192.001Z" />
                  <path d="m172.108 242.506-.003-33.458 33.555.003-.006-33.647 33.454-.001-.002-33.355 33.454.006-.002-33.369 33.53-.001-.003-33.561 33.548.002.001-33.839 18.496-.002.001 3.144-15.353.002-.001 33.84-33.547-.003.002 33.561-33.53.001.003 33.369-33.455-.006.003 33.355-33.455.001.006 33.647-33.554-.003.002 33.458-18.339-.005v-3.144l15.195.005Z" />
                  <path d="m188.31 258.708.001-33.455 33.55-.001-.006-33.647 33.459.003-.003-33.355 33.451.003-.002-33.369 33.533.002-.006-33.564 33.551.006-.003-33.843 18.501.002v3.143H358.98l.002 33.842-33.551-.006.003 33.561-33.53.001.002 33.369-33.451-.003.003 33.355L225 194.75l.006 33.647h-33.551l-.001 33.455-18.335-.001-.001-3.144 15.192.001Z" />
                  <path d="M204.512 274.91v-33.455l33.555.003-.006-33.647 33.454-.001-.002-33.355 33.451.002.001-33.365 33.53-.001-.003-33.561 33.548.002.001-33.839 18.496-.002.001 3.144-15.357-.001.003 33.843-33.551-.006.006 33.564-33.53.001-.001 33.365-33.451-.002.003 33.355-33.455.001.006 33.647-33.554-.003-.001 33.455-18.336-.002v-3.144l15.192.002Z" />
                  <path d="m220.717 291.115.001-33.455 33.551-.001-.007-33.647 33.459.003-.003-33.355 33.451.003-.002-33.369 33.53-.001-.003-33.561 33.548.002V89.895l18.501.002v3.143h-15.356l-.001 33.839-33.547-.003.002 33.561-33.53.001.003 33.369-33.455-.006.006 33.358-33.458-.002.006 33.647-33.555-.003.003 33.458-18.335-.001-.001-3.144 15.192.001Z" />
                  <path d="M236.919 307.317v-33.455l33.555.003-.006-33.647 33.454-.001-.002-33.355 33.451.002-.003-33.369 33.534.003-.006-33.564 33.551.006-.003-33.843 18.5.001.001 3.144-15.356-.001.002 33.843-33.551-.006.006 33.564-33.533-.002.002 33.369-33.451-.003.003 33.355-33.455.001.006 33.647-33.554-.003-.001 33.455-18.336-.001v-3.144l15.192.001Z" />
                  <path d="M236.919 307.317v-33.455l33.555.003-.006-33.647 33.454-.001-.002-33.355 33.451.002-.003-33.369 33.534.003-.006-33.564 33.551.006-.003-33.843 18.5.001.001 3.144-15.356-.001.002 33.843-33.551-.006.006 33.564-33.533-.002.002 33.369-33.451-.003.003 33.355-33.455.001.006 33.647-33.554-.003-.001 33.455-18.336-.001v-3.144l15.192.001Z" />
                  <path d="m253.124 323.522-.003-33.459 33.554.003-.006-33.647 33.458.003-.006-33.359 33.455.006-.002-33.369h33.53l-.003-33.562 33.548.003v-33.839l18.501.001v3.144l-15.356-.001-.001 33.839-33.548-.002.003 33.561-33.53.001.002 33.368-33.454-.006.002 33.356h-33.454l.006 33.647-33.555-.002.003 33.458-18.335-.002-.001-3.144 15.192.002Z" />
                </g>
              </svg>
            </div>
            <div className="absolute -right-28 bottom-0 -z-[1]  -rotate-45 scale-[.25] opacity-50 md:-right-4 md:bottom-80 md:scale-75 ">
              {" "}
              <svg
                width="239"
                height="243"
                viewBox="0 0 239 243"
                className="fill-primary "
              >
                <path d="M183.94 93.2042L183.937 55.738L221.388 55.7409L221.381 17.9643L238.524 17.9657L238.523 0.592822L204.007 0.590113L204.01 38.3629L166.559 38.3599L166.562 75.8262L129.134 75.8232L129.137 113.075L91.7932 113.072L91.7962 150.308L54.4525 150.305L54.4555 187.871L16.9969 187.868L16.9999 225.212L0.0407958 225.211L0.042163 242.583L34.3741 242.586L34.3712 205.243L71.8298 205.245L71.8268 167.68L109.17 167.683L109.168 130.446L146.511 130.449L146.508 93.1975L183.936 93.2004L183.94 93.2042ZM179.603 51.404L179.606 88.8702L142.178 88.8673L142.181 126.119L104.837 126.116L104.84 163.352L67.4966 163.349L67.4996 200.915L30.041 200.912L30.044 238.256L4.37165 238.254L4.37096 229.548L21.33 229.55L21.3271 192.206L58.7857 192.209L58.7827 154.643L96.1263 154.646L96.1234 117.41L133.467 117.413L133.464 80.161L170.892 80.164L170.889 42.6977L208.34 42.7007L208.337 4.92794L234.186 4.92994L234.186 13.6356L217.043 13.6342L217.05 51.4108L179.599 51.4078L179.603 51.404Z" />
              </svg>
            </div>
            <Link href={"/faq/WiseFAQ"} target="_blank">
              <img src="temp.png" alt="" className="mx-auto md:w-4/5 " />

              <Button
                variant={"outline"}
                className="absolute left-1/2 mx-auto  mt-4 flex -translate-x-1/2 items-center justify-center gap-3 pr-4 rounded-full  text-xs shadow-2xl outline-4 md:text-sm bottom-4 md:bottom-14 "
              >
                See the demo <ArrowRight />
              </Button>
            </Link>
            {/* {faq && (
              <div className="w-4/5 h-[600px] mx-auto overflow-auto bg-black">
                <MainFaqSection faq={faq} />
              </div>
            )} */}
          </div>
        </div>
        <div className="">
          <h1 className="  relative mx-4 pb-3 text-4xl font-bold before:absolute before:bottom-[15px] before:left-0  before:-z-10 before:h-4 before:w-40 before:-skew-x-12 before:bg-primary before:content-[''] ">
            Super easy 3 steps.
          </h1>

          <div className="my-4 flex flex-col items-center justify-center gap-3 md:flex-row ">
            {steps.map((step, index) => (
              <Card
                className="flex w-4/5 flex-col justify-between  md:w-full "
                key={index}
              >
                <CardHeader>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent className="max-w-[500px]  p-2">
                  <img src={step.image} alt="" />{" "}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default index;
