import { Contact_Message } from "@/types/ContactMessages";
import { DailyMessages } from "@/types/DailyMessages";
import { Thought } from "@/types/Thoughts";



export function groupMessagesByDay(
  data: Contact_Message[] | Thought[]
): DailyMessages[] {
  const map = new Map<string, number>();

  data.forEach((msg) => {
    const day = new Date(msg.createdAt).toISOString().slice(0, 10);

    map.set(day, (map.get(day) ?? 0) + 1);
  });

  return Array.from(map.entries())
    .map(([day, messages]) => ({ day, messages }))
    .sort((a, b) => a.day.localeCompare(b.day));
}
