import { PresenceTransition } from "native-base";
import { FC } from "react";

export const FadeIn: FC = ({ children }) => (
  <PresenceTransition
    visible={true}
    initial={{
      opacity: 0,
    }}
    animate={{
      opacity: 1,
      transition: {
        duration: 150,
      },
    }}
  >
    {children}
  </PresenceTransition>
);
