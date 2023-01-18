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
    await supabase.from("users").delete().eq("id", req.query?.id);

    return res.status(200).json({ message: "User deleted" });
  }

  res.status(404).json({ message: "Not Found!" });
}
