import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

type AddTodoPayload = {
  userId: string;
  text: string;
};

const addTodo = ({ userId, text }: AddTodoPayload) =>
  fetch("/api/todos?", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, userId }),
  });

export default function AddTodoForm() {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const mutation = useMutation(addTodo);

  const { id: currentUser } = router.query;
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const [text = ""] = Array.from(formData.values());

    e.preventDefault();
    e.stopPropagation();
    mutation.mutate(
      { userId: String(currentUser), text: String(text) },
      {
        onSuccess: async (res) => {
          const { message } = await res.json();
          const { status } = res;
          if (status >= 400) {
            setErrorMsg(message);
          }
          formElement.reset();
          queryClient.invalidateQueries(["todos"]);
        },
      },
    );
  };
  const hasError = errorMsg.length > 0;
  const isPosting = mutation.status === "loading";
  const resetError = () => setErrorMsg("");

  return (
    <form onSubmit={handleSubmit} className="mb-16">
      <label
        htmlFor="username"
        className="pl-2 mb-2 block text-lg text-teal-700 font-bold"
      >
        Add new todos
      </label>
      <input
        type="text"
        name="todo"
        aria-label="todo"
        placeholder="Describe the todo"
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
