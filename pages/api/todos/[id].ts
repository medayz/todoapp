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
  if (req.method === "DELETE") {
    await supabase.from("todos").delete().eq("id", req.query?.id);

    return res.status(200).json({ message: "Todo deleted" });
  }

  if (req.method === "PATCH") {
    if (!["created", "current", "done"].includes(req.body?.status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    await supabase
      .from("todos")
      .update({ status: req.body.status })
      .eq("id", req.query?.id);

    return res.status(200).json({ message: "Todo updated" });
  }

  res.status(404).json({ message: "Not Found!" });
}
