import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export type User = {
  id: string;
  name: string;
};

type UserItemProps = {
  user: User;
};

const useDeleteUser = (id: string) => {
  const deleteUser = () =>
    fetch(`/api/users/${id}`, { method: "DELETE" }).then((res) => res.json());

  const queryClient = useQueryClient();
  const mutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return { deleteUser: () => mutation.mutate(), status: mutation.status };
};

export default function UserItem({ user }: UserItemProps) {
  const { deleteUser, status } = useDeleteUser(user.id);

  return (
    <li key={user.id} className="flex w-96 my-2">
      <Link
        className="flex-1 text-left py-4 px-8 bg-slate-200 text-teal-800 text-lg font-semibold rounded-md text-ellipsis overflow-hidden hover:bg-slate-300"
        href={`/todos/${user.id}`}
      >
        {user.name}
      </Link>
      <button
        type="button"
        aria-label="Delete user"
        className="py-2 px-4 mx-2 rounded-md bg-red-600 text-teal-50 hover:bg-red-700 hover:cursor-pointer"
        disabled={status === "loading"}
        onClick={deleteUser}
      >
        <TrashIcon className="h-8 w-8 p-0.5 m-0 rounded-md" />
      </button>
    </li>
  );
}
