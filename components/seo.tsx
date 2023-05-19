import Head from "next/head";

interface SeoProps {
  seoTitle: string;
}

export default function Seo({ seoTitle }: SeoProps) {
  const headText = `${seoTitle} | Mini-Twitter`;

  return (
    <Head>
      <title>{headText}</title>
    </Head>
  );
}
