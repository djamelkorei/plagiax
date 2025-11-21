import { Text, type TextProps } from "@chakra-ui/react";

export const Logo = (props: TextProps) => {
  return (
    <Text
      className={"font-logo"}
      fontSize="xl"
      fontWeight="bold"
      {...props}
      letterSpacing={0.75}
    >
      Plagia
      <Text as={"span"} color={"orange.500"}>
        X
      </Text>
    </Text>
  );
};
