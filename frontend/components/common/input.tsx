"use client";
import { ChangeEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { InputType } from "@/interface/type";

const Input = ({
  type,
  className,
  label,
  placeholder,
  value,
  onChange,
}: InputType) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="">
      <label className="text-[13px] text-slate-800">{label}</label>

      <div className="input-box">
        <input
          type={
            type == "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            e.preventDefault();
            onChange?.(e.target.value);
          }}
          className={`${className ? className : "w-full bg-transparent focus:outline-hidden"}`}
        />

        {type === "password" && (
          <>
            {showPassword ? (
              <Eye
                size={22}
                className="text-primary cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <EyeOff
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
