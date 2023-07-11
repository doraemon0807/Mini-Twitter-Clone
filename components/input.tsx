import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  name: string;
  label: string;
  kind?: "text" | "phone" | "username";
  register: UseFormRegisterReturn;
  required?: boolean;
  regions?: RegionProps[];
  setRegionIndex?: Dispatch<SetStateAction<number>>;
  [key: string]: any;
}

interface RegionProps {
  name: string;
  number: string;
}

export default function Input({
  name,
  label,
  kind = "text",
  register,
  required,
  regions,
  setRegionIndex,
  ...rest
}: InputProps) {
  const [regionNumber, setRegionNumber] = useState("1");
  const [regionName, setRegionName] = useState("CA");
  const [regionMenu, setRegionMenu] = useState(false);

  const handleRegionChange = (i: number) => {
    if (regions && setRegionIndex) {
      setRegionNumber(regions[i].number);
      setRegionName(regions[i].name);
      setRegionMenu(false);
      setRegionIndex(i);
    }
  };

  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        <span>{label}</span>
        <span className="text-sm text-red-500">{required && "*"}</span>
      </label>
      <div className="mt-1">
        {kind === "text" ? (
          <input
            id={name}
            {...register}
            className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
            type={kind}
            {...rest}
          />
        ) : kind === "phone" ? (
          <div className="relative flex rounded-md shadow-sm">
            <div
              onClick={() => setRegionMenu(true)}
              className="flex w-20 cursor-pointer items-center justify-center space-x-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 hover:bg-green-100"
            >
              <Image
                alt=""
                src={`https://flagsapi.com/${regionName}/flat/64.png`}
                width={24}
                height={24}
              />
              <span>{regionNumber}</span>
            </div>
            <input
              onSelect={() => setRegionMenu(false)}
              id={name}
              {...register}
              className="w-full appearance-none rounded-r-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              type={kind}
              {...rest}
            />
            {regionMenu ? (
              <div className="absolute top-full box-border flex flex-col rounded-md border bg-white">
                {regions?.map((region, i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer items-center justify-center space-x-2 p-2 text-sm text-gray-500 hover:bg-green-100"
                    onClick={() => handleRegionChange(i)}
                  >
                    <Image
                      alt=""
                      src={`https://flagsapi.com/${region.name}/flat/64.png`}
                      width={24}
                      height={24}
                    />
                    <span>{region.number}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : kind === "username" ? (
          <div className="flex rounded-md shadow-sm">
            <span className="flex select-none items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
              @
            </span>
            <input
              id={name}
              {...register}
              className="w-full appearance-none rounded-r-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              type={kind}
              {...rest}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
