

import { FC } from "react";

interface ErrorInterface {
  message: string;
}

const Error: FC<ErrorInterface> = ({ message }) => {
  return (
    <div className="animate__animate animate__fadeIn flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 shadow-sm max-w-md my-3">
      <i className="ri-error-warning-line text-2xl text-red-600 shrink-0"></i>

      <div className="flex-1">
        <h3 className="font-semibold text-red-700">
          Something went wrong
        </h3>

        <p className="text-sm text-red-600 mt-1 break-words">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Error;

