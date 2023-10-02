import AuthForm from "@/components/authForm";
import { authOptions } from "@/server/auth";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { getProviders, signIn } from "next-auth/react";
import { useTheme } from "next-themes";




function SignIn({providers} : InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {theme, setTheme} = useTheme();


  return (
    <div>

    <AuthForm />
    <button onClick={() => setTheme("dark")}>change</button>
    </div>
  )
}

export default SignIn

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);
    
    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!
    if (session) {
      return { redirect: { destination: "/" } };
    }
  
    const providers = await getProviders();
    
    return {
      props: { providers: providers ?? [] },
    }
  }