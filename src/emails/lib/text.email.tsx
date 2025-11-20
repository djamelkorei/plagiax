import { Text, TextProps } from "@react-email/components";

export const TextEmail = (props: TextProps) => {
  return (
    <Text className="text-[14px] leading-[26px]" {...props}>
      {props.children}
    </Text>
  );
};
