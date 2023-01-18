import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { FormEvent, useState } from "react";

const addUser = (username: string) =>
  fetch("/api/users", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

export default function AddUserForm({}) {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");
  const mutation = useMutation(addUser);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const [username = ""] = Array.from(formData.values());

    e.preventDefault();
    mutation.mutate(String(username), {
      onSuccess: async (res) => {
        const { message } = await res.json();
        const { status } = res;
        if (status >= 400) {
          setErrorMsg(message);
        }
        formElement.reset();
        queryClient.invalidateQueries(["users"]);
      },
    });
  };
  const hasError = errorMsg.length > 0;
  const isPosting = mutation.status === "loading";
  const resetError = () => setErrorMsg("");

  return (
    <form onSubmit={handleSubmit}>
      <label
        htmlFor="username"
        className="pl-2 mb-2 block text-lg text-teal-700 font-bold"
      >
        New user ?
      </label>
      <input
        type="text"
        name="username"
        aria-label="username"
        placeholder="username"
        id="username"
        onChange={resetError}
        className={clsx(
          "py-2 px-4 rounded-md shadow-sm mr-2 placeholder:text-teal-600 w-64 outline-none border-2",
          {
            "border-2 border-solid border-red-500": hasError,
          },
        )}
      />
      <button
        type="submit"
        disabled={isPosting}
        className={clsx("text-slate-200 py-2 px-4 rounded-md w-20", {
          "bg-teal-700": isPosting,
          "bg-teal-900": !isPosting,
        })}
      >
        Add
      </button>
      {hasError && (
        <span className="block text-sm text-red-500 pt-2 pl-1 w-64">
          {errorMsg}
        </span>
      )}
    </form>
  );
}
