import { dailyBrief } from "../../content/dailyBrief";

export async function GET() {
  return Response.json({ brief: dailyBrief });
}
