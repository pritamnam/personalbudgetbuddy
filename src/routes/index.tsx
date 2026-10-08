import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarCheck, CircleDollarSign, PiggyBank, Quote, ReceiptText, Settings, ShoppingBasket, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import savingsImage from "@/assets/savings-habit.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Advisory — SpendSmart Money-Saving Tips" },
      {
        name: "description",
        content:
          "Build better money habits with practical saving tips and encouraging advice from SpendSmart.",
      },
      { property: "og:title", content: "Advisory — SpendSmart Money-Saving Tips" },
      {
        property: "og:description",
        content:
          "Small steps, lasting progress: practical money-saving advice for everyday life.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdvisoryPage,
});

const TIPS = [
  { title: "Give every expense a name", text: "Track the little purchases as well as the big ones. A weekly review can reveal one habit worth changing.", icon: ReceiptText, to: "/expenses", action: "Review expenses" },
  { title: "Plan before you spend", text: "Set a realistic limit for each category. Leave room for essentials and a little enjoyment, not just restrictions.", icon: WalletCards, to: "/budgets", action: "Plan your budget" },
  { title: "Save a little, regularly", text: "Choose an amount you can comfortably set aside each payday. Consistency matters more than starting big.", icon: PiggyBank, to: "/goals", action: "Set a savings goal" },
  { title: "Pause the impulse purchase", text: "Put non-essential purchases on a wish list and wait a day. Compare prices and decide whether you still need them.", icon: ShoppingBasket, to: "/expenses", action: "Check your spending" },
  { title: "Make room for surprises", text: "Build a separate emergency fund at your own pace. Even a small cushion can make an unexpected bill easier to handle.", icon: CircleDollarSign, to: "/goals", action: "Build your cushion" },
  { title: "Check what renews", text: "Review subscriptions and note upcoming bills. Cancel what you no longer use before the next renewal.", icon: CalendarCheck, to: "/reminders", action: "Plan a reminder" },
] as const;

function AdvisoryPage() {
  return <div className="space-y-12">
    <section className="border-b border-border pb-8 sm:pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4"><p className="text-xs font-semibold uppercase tracking-widest text-primary">SpendSmart / Advisory</p><Button variant="outline" asChild><Link to="/settings"><Settings />Settings</Link></Button></div>
      <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">Money-saving advice</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">A little intention today. More freedom tomorrow. Build money habits that work for your everyday life.</p>
    </section>
    <section aria-labelledby="tips-heading">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><h2 id="tips-heading" className="text-2xl font-semibold">Small habits. Real progress.</h2><span className="text-sm text-muted-foreground">Start with one change this week</span></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{TIPS.map(({ title, text, icon: Icon, to, action }, index) => <article key={title} className="flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/40">
        <div className="mb-5 flex items-center justify-between"><span className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary"><Icon className="size-5" /></span><span className="text-xs font-medium text-muted-foreground">0{index + 1}</span></div>
        <h3 className="font-sans text-lg font-semibold">{title}</h3><p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{text}</p>
        <Button asChild variant="link" className="mt-5 justify-start px-0"><Link to={to}>{action}<ArrowUpRight /></Link></Button>
      </article>)}</div>
    </section>
    <section aria-labelledby="encouragement-heading" className="grid gap-8 border-y border-border py-8 md:grid-cols-2 md:items-center">
      <img src={savingsImage} alt="Coins in a savings jar beside a growing plant and notebook" width={1200} height={800} loading="lazy" className="aspect-[3/2] w-full rounded-lg object-cover" />
      <div><Quote className="mb-4 size-7 text-primary" /><h2 id="encouragement-heading" className="text-2xl font-semibold">Every small step counts.</h2><blockquote className="mt-5 text-xl leading-relaxed">“You don’t have to change your whole financial life today. Just make one choice your future self will thank you for.”</blockquote><p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">A SpendSmart reminder</p></div>
    </section>
    <section aria-label="More encouragement" className="grid gap-4 sm:grid-cols-2">
      {["Progress is not the size of your first deposit. It’s the habit of showing up again.", "A budget is not a limit on your life. It’s a plan for what matters to you."].map((quote) => <blockquote key={quote} className="rounded-lg border border-border bg-secondary p-6 text-secondary-foreground"><Quote className="mb-3 size-5 text-primary" /><p className="text-lg leading-relaxed">“{quote}”</p><footer className="mt-4 text-xs text-muted-foreground">SpendSmart encouragement</footer></blockquote>)}
    </section>
    <p className="text-xs text-muted-foreground">General guidance for everyday money habits, not personalized financial advice.</p>
  </div>;
}
