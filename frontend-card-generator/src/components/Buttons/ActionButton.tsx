import React from "react";
import Button from "@mui/material/Button";

interface ActionButtonProps {
  variant?: "text" | "outlined" | "contained";
  color?: "default" | "inherit" | "primary" | "secondary";
  size?: "small" | "medium" | "large";
  onClick?: (...params: any[]) => void;
  disabled?: boolean;
  sx?: object;
  children: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  variant = "contained",
  size = "medium",
  onClick,
  disabled = false,
  sx = {},
  children,
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      sx={sx}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
