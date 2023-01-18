import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "lib/supabaseClient";

type Data = {
  message: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === "GET") {
    const { data } = await supabase.from("users").select();

    return res.status(200).json({ message: "All users", data });
  }

  if (req.method === "POST") {
    if (req.body?.username?.length < 3) {
      return res.status(400).json({
        message: "Please enter a username with a minimum of 3 characters",
      });
    }

    const { count: usersCount } = await supabase
      .from("users")
      .select("*", { count: "exact" });

    if (Number(usersCount) >= 5) {
      return res.status(400).json({
        message: "Max of 5 users allowed!",
      });
    }

    const { status, error } = await supabase
      .from("users")
      .insert({ name: req.body.username });

    if (status >= 400) {
      const UNIQUE_CONSTRAINT_ERROR = "23505";

      if (error?.code === UNIQUE_CONSTRAINT_ERROR) {
        return res.status(400).json({ message: "Username already exists!" });
      }

      return res.status(500).json({ message: "Something went wrong!" });
    }

    return res.status(200).json({ message: "Added successfully" });
  }

  res.status(404).json({ message: "Not Found!" });
}
