import { useGT } from "gt-next";

export const useExamples = () => {
  const t = useGT();

  return [
    t(
      "Yesterday I had a full breakdown at work. I tried to hide it, but my manager noticed. I told him I was just tired, but the truth is I’ve been struggling for weeks."
    ),
    t(
      "I had a big fight with my best friend. We said things we didn’t mean, and now we’re not talking. I keep replaying it in my head wishing I handled it better."
    ),
    t(
      "I failed an exam I studied so hard for. My family thinks I don’t care, but I cried the whole night because I feel like I’m disappointing everyone."
    ),
    t(
      "I’ve been pretending I’m okay around my friends, but I’m not. Every time I go home, the silence hits me like a wall."
    ),
  ];
};
