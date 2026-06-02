import { ui, uiButton, uiButtonDisabled } from "@/lib/styles";
import { ButtonHTMLAttributes } from "react";

export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(40%,50%,90%,0.9),transparent_200%)]" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] bg-repeat bg-[length:250px_250px] opacity-10" />
    </div>
  );
}

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