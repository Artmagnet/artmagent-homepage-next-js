import classNames from "classnames";
import { ReactNode } from "react";

const clasName = {
  // 기본 스타일
  default: " -full text-lg p-1 rounded-lg font-bold bg-blue-500 text-white",
  // hover 상태에서 추가/변경할 스타일
  hover: "hover:bg-blue-600",
  // disabled 상태에서 추가/변경할 스타일
  disabled: "disabled:cursor-not-allowed disabled:bg-gray-400",
};

export const Button = ({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children?: ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        clasName.default,
        clasName.hover, // disabled가 아닐 때만 hover 클래스 적용
        clasName.disabled
      )}
    >
      {children}
    </button>
  );
};
