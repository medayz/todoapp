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
    const { data } = await supabase
      .from("todos")
      .select()
      .eq("user_id", req.query.user);

    return res.status(200).json({ message: "All user todos", data });
  }

  if (req.method === "POST") {
    const text = req.body?.text;
    const userId = req.body?.userId;
    const textLength = text?.length ?? 0;

    if (textLength < 1) {
      return res.status(400).json({ message: "Todo can't be empty!" });
    }

    await supabase.from("todos").insert({ user_id: userId, text });

    return res.status(200).json({ message: "Todo Added!" });
  }

  res.status(404).json({ message: "Not Found!" });
}
