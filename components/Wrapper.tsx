import { Box } from "@chakra-ui/core";
import * as React from "react";

export type WrapperVariant = "small" | "regular";

interface WrapperProps {
  variant?: WrapperVariant;
}

const Wrapper: React.FunctionComponent<WrapperProps> = ({
  variant = "regular",
  children,
}) => {
  return (
    <Box
      mt={8}
      mx={"auto"}
      maxW={variant === "regular" ? "800px" : "400px"}
      w="100%"
    >
      {children}
    </Box>
  );
};

export default Wrapper;
