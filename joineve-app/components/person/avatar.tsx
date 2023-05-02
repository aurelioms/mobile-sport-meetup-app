import { Text, View, Avatar as NBAvatar } from "native-base";
import { FC } from "react";

type Props = {
  name: string;
  size?: "md" | "sm" | "lg" | "xs" | "xl";
  color?: string;
};

const extractInitial = (name: string) => {
  const capitalizedName = name.toUpperCase();
  const words = capitalizedName.split(" ").filter(Boolean);

  if (words.length === 1) {
    return capitalizedName.charAt(0).repeat(1);
  } else if (words.length === 2) {
    return words[0].charAt(0) + words[1].charAt(0);
  }

  return words[0].charAt(0) + words[words.length - 1].charAt(0);
};

const getRandomizeColor = (initial: string) => {
  const initialAscii = initial
    .split("")
    .map((char) => char.charCodeAt(0))
    .reduce((acc, val) => acc + val, 0);

  const colors = [
    "yellow.500",
    "amber.500",
    "orange.500",
    "red.600",
    "fuchsia.600",
    "purple.700",
    "indigo.700",
    "blue.600",
    "lime.600",
    "gray.700",
  ];

  return colors[initialAscii % 10];
};

export const Avatar: FC<Props> = ({ name, size = "md", color }) => {
  const nameInitial = extractInitial(name);

  return (
    <NBAvatar
      size={size}
      bgColor={color ? color : getRandomizeColor(nameInitial)}
    >
      {nameInitial}
    </NBAvatar>
  );
};
