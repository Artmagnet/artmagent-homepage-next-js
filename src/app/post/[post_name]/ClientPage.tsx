"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import style from "./style.module.css";

interface IClientPage {
  source: MDXRemoteSerializeResult;
}

const ClientPage = ({ source }: IClientPage) => {
  return (
    <div className={style.container}>
      <MDXRemote
        {...source}
        components={{
          h1: (props) => (
            <h1
              className="text-3xl underline-offset-8 font-bold flex flex-col gap-3"
              {...props}
            />
          ),
          u: (props) => <u className="text-blue-600 underline" {...props} />,
          table: (props: any) => (
            <table
              className="table-auto w-full border-collapse border border-gray-300"
              {...props}
            />
          ),
          th: (props: any) => (
            <th
              className="border border-gray-300 bg-gray-200 px-4 py-2 text-left"
              {...props}
            />
          ),
          td: (props: any) => (
            <td className="border border-gray-300 px-4 py-2" {...props} />
          ),
        }}
      />
    </div>
  );
};
export default ClientPage;
