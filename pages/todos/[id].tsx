import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";

import AddTodoForm from "components/AddTodoForm";
import TodoItem from "components/TodoItem";
import { supabase } from "lib/supabaseClient";

export type Todo = {
  id: string;
  text: string;
  status: "created" | "current" | "done";
};
type TodosResponse = {
  data: Todo[];
  message?: string;
};
type UserTodosProps = {
  allTodos: TodosResponse;
  userName: string;
};

const useTodos = (id: string, initialData: TodosResponse): Todo[] => {
  const fetchTodos = () =>
    fetch(`/api/todos?user=${id}`).then((res) => res.json());
  const { data } = useQuery<TodosResponse>(["todos", id], fetchTodos, {
    initialData,
  });
  const { data: todos = [] } = data ?? {};

  return todos;
};

export default function UserTodos({ allTodos, userName }: UserTodosProps) {
  const {
    query: { id = "" },
  } = useRouter();
  const userId = String(id);
  const todos = useTodos(userId, allTodos);
  const done = todos.filter((todo) => todo.status === "done");
  const current = todos.filter((todo) => todo.status === "current");
  const created = todos.filter((todo) => todo.status === "created");
  const renderTodo = (todo: (typeof todos)[number]) => (
    <TodoItem key={todo.id} userId={userId} todo={todo} />
  );

  return (
    <main className="bg-slate-100 text-teal-900 min-h-screen flex flex-col items-center">
      <div className="flex flex-col w-96 mb-20 pt-8 text-center">
        <h1 className="text-3xl font-bold capitalize">{`${userName} todos`}</h1>
        <Link href="/" className="underline">
          All users
        </Link>
      </div>
      <AddTodoForm />
      <section>
        {current.length > 0 && (
          <h2 className="mt-4 pl-2 mb-2 block text-lg text-teal-700 font-bold">
            In progress:
          </h2>
        )}
        <ul className="mt-4 mb-4">{current.map(renderTodo)}</ul>
        {created.length > 0 && (
          <h2 className="pl-2 mb-2 block text-lg text-teal-700 font-bold">
            To do:
          </h2>
        )}
        <ul className="my-4">{created.map(renderTodo)}</ul>
        {done.length > 0 && (
          <h2 className="pl-2 mb-2 block text-lg text-teal-700 font-bold">
            Done:
          </h2>
        )}
        <ul className="mt-4 mb-16">{done.map(renderTodo)}</ul>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data } = await supabase
    .from("todos")
    .select()
    .eq("user_id", context.params?.id);
  const { data: users } = await supabase
    .from("users")
    .select()
    .eq("id", context.params?.id);
  const [user = {}] = users ?? [];

  return {
    props: {
      allTodos: {
        data,
      },
      userName: user.name,
    },
  };
};
