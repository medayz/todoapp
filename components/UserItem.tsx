import { useMutation, useQueryClient } from "@tanstack/react-query";
import { XMarkIcon } from "@heroicons/react/24/outline";

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

  return () => mutation.mutate();
};

export default function UserItem({ user }: UserItemProps) {
  const deleteUser = useDeleteUser(user.id);

  return (
    <li
      key={user.id}
      className="flex justify-between py-4 px-8 w-96 my-2 bg-slate-200 text-teal-800 text-lg font-semibold rounded-md text-center text-ellipsis overflow-hidden"
    >
      {user.name}
      <button type="button" aria-label="Delete user" onClick={deleteUser}>
        <XMarkIcon className="h-8 w-8 p-1 m-0 rounded-md hover:bg-slate-300 hover:cursor-pointer" />
      </button>
    </li>
  );
}
