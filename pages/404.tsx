import Layout from "@/components/layout";
import Image from "next/image";

import ErrorImage from "../public/404.png";
import Link from "next/link";

export default function FourOhFour() {
  return (
    <Layout seoTitle="Error 404">
      <div className="mt-20 flex flex-col justify-center space-y-10 text-center text-gray-900">
        <h1 className="text-6xl font-medium">Uh Oh...</h1>
        <Image
          alt=""
          src={ErrorImage}
          placeholder="blur"
          width={300}
          className="mx-auto"
        />
        <span className="text-lg">
          The page you are looking for does not exist.
        </span>
        <Link href="/">
          <div className="align-center flex justify-center">
            <div className="rounded-xl border border-gray-300 bg-green-500 px-5 py-2 text-white shadow-md transition-colors hover:bg-green-600">
              Go Back Home
            </div>
          </div>
        </Link>
      </div>
    </Layout>
  );
}
