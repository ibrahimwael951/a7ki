"use client";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { DailyMessages } from "@/types/DailyMessages";
import { useGT } from "gt-next";

export const description = "A simple area chart";

const chartConfig = {
  messages: {
    label: "Messages",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ContactMessagesAreaChart({
  messages,
  title,
  description,
}: {
  description: string;
  title: string;
  messages: DailyMessages[];
}) {
  const chartData = messages;
  const t = useGT();

  return (
    <Card className="dark:bg-primary">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(5)}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            <Area
              dataKey="messages"
              type="monotone"
              fill="var(--color-messages)"
              fillOpacity={0.4}
              stroke="var(--color-messages)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium">
              {t("Daily volume")} <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground">
              {t("Based on actual submission dates")}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
