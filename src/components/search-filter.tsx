import { Icon, Input, InputGroup, InputProps } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";

export const SearchFilter = ({
  loading,
  callback = () => {},
  placeholder = "search",
  ...rest
}: {
  loading: boolean;
  callback: (value: string | null) => void;
  placeholder: string;
} & InputProps) => {
  const [search, setSearch] = useState<string>("");

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (!search.trim()) {
      callback(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      callback(search);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [callback, search]);

  return (
    <InputGroup endElement={<Icon w={4} h={4} as={IoIosSearch} />}>
      <Input
        //disabled={loading}
        value={search}
        type={"search"}
        placeholder={placeholder}
        colorPalette={"primary"}
        onChange={handleOnChange}
        {...rest}
      />
    </InputGroup>
  );
};
