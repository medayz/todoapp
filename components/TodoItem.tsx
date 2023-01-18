import { ForwardIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "pages/todos/[id]";
import clsx from "clsx";

type TodoItemProps = {
  userId: string;
  todo: Todo;
};

const useMutateTodo = (userId: string, todo: TodoItemProps["todo"]) => {
  const deleteTodo = () =>
    fetch(`/api/todos/${todo.id}`, { method: "DELETE" }).then((res) =>
      res.json(),
    );
  const updateTodoStatus = (current: typeof todo.status) => {
    const nextStatus = {
      created: "current",
      current: "done",
      done: "delete",
    };

    return fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: nextStatus[current] }),
    }).then((res) => res.json());
  };

  const queryClient = useQueryClient();
  const action =
    todo.status === "done" ? deleteTodo : () => updateTodoStatus(todo.status);
  const mutation = useMutation(action, {
    onSuccess: () => {
      queryClient.invalidateQueries(["todos", userId]);
    },
  });

  return () => mutation.mutate();
};

export default function TodoItem({ userId, todo }: TodoItemProps) {
  const mutateTodo = useMutateTodo(userId, todo);

  const iconButtonClass = clsx(
    "h-8 w-8 p-1 m-0 rounded-md hover:cursor-pointer",
    {
      "hover:bg-teal-600": todo.status === "current",
      "hover:bg-slate-300": todo.status === "created",
      "hover:bg-slate-100": todo.status === "done",
    },
  );
  const currentIcon = {
    created: <ForwardIcon className={iconButtonClass} />,
    current: <CheckIcon className={iconButtonClass} />,
    done: <TrashIcon className={iconButtonClass} />,
  };

  return (
    <li
      key={todo.id}
      className={clsx(
        "flex justify-between py-4 px-8 w-96 my-2 text-lg font-semibold rounded-md text-center text-ellipsis overflow-hidden",
        {
          "bg-slate-200 text-teal-800": todo.status === "created",
          "bg-teal-500 text-white": todo.status === "current",
          "bg-slate-200 text-teal-400": todo.status === "done",
        },
      )}
    >
      {todo.text}
      <button type="button" aria-label="Delete user" onClick={mutateTodo}>
        {currentIcon[todo.status]}
      </button>
    </li>
  );
}
