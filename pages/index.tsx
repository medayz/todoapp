import { useQuery } from "@tanstack/react-query";
import AddUserForm from "../components/AddUserForm";
import UserItem, { User } from "../components/UserItem";
import { supabase } from "../lib/supabaseClient";

type UsersResponse = {
  data: User[];
  message?: string;
};
type HomeProps = {
  allUsers: UsersResponse;
};

const useUsers = (initialData: UsersResponse): User[] => {
  const fetchUsers = () => fetch("/api/users").then((res) => res.json());
  const { data } = useQuery<UsersResponse>(["users"], fetchUsers, {
    initialData,
  });
  const { data: users = [] } = data;

  return users;
};

export default function Home({ allUsers }: HomeProps) {
  const users = useUsers(allUsers);

  return (
    <main className="bg-slate-100 text-teal-900 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold pt-8 mb-20">Todo App</h1>
      <AddUserForm />
      <ul className="my-16">
        {users.map((user) => (
          <UserItem key={user.id} user={user} />
        ))}
      </ul>
    </main>
  );
}

export async function getServerSideProps() {
  const { data } = await supabase.from("users").select();

  return {
    props: {
      allUsers: {
        data,
      },
    },
  };
}
