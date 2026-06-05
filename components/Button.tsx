import { ui, uiButton, uiButtonDisabled } from "@/lib/styles";
import { ButtonHTMLAttributes } from "react";

type ButtonProps = {
  submit?: boolean;
  noStyle?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  submit,
  noStyle,
  type,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const resolvedType = type ?? (submit ? "submit" : "button");

  return (
    <button
      type={resolvedType}
      disabled={disabled}
      className={ui(
        className,
        !noStyle && (disabled ? uiButtonDisabled : uiButton)
      )}
      {...props}
    />
  );
}