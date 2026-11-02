# Before You Read

**Maimai**

---

> *It's not the tail wagging the dog — it is the dog.*
>
> Options are not the tail wagging the dog. Options are the dog.
>
> — Cem Karsan, options volatility trader

> *It's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong.*
>
> — George Soros

---

This book is primarily about SPX 0DTE. If you trade SPY or ES futures, almost everything here transfers directly—those are the instruments market makers use to hedge SPX in the first place (Chapter 2), and the three are three cross-sections of the same picture. NDX and QQQ change the index but not the mechanism; only the wall levels have to be recomputed.

You know what Calls and Puts are. You have called the direction correctly before, yet still failed to hold on to the profit.

You probably know that feeling: the market moved exactly as expected, you bought the right Call, and then most of the profit disappeared—or you made nothing at all.

That is not simply bad luck. Some parts of the picture were still missing.

---

## What This Book Is

**Two things, written into one book:**

1. **A shift in thinking**—from “Will the market rise or fall today?” to “What kind of market is this today, and does the structure justify taking a view?”
2. **A personal trading journal**—what I watch before the open, how I read GEX, why I usually choose a Delta between 0.45 and 0.55, why I open nothing at all in the first 5 minutes, and how I scale out. These are my actual decision-making habits, not theory dressed up as practice.

I have also included reviews of seven real trading days. Use the data, structure, and execution details where they help; do not force them where they do not. Markets change, and so do I.

This is the **Buyer Edition**. It deals only with SPX options expiring the same day—0DTE—and the simplest long-premium trades: buying a single Long Call or Long Put, with no complex combinations. The main text begins with **Chapter 1**: first the story, then the map, then the trade reviews. (If you have never encountered GEX, read the **Guide** first; half an hour is enough.)

**The unflattering part belongs up front too.** A single-leg 0DTE long position trades win rate away for payoff. Time value drains by the hour, and by the minute as the close approaches; getting the direction right but the distance short still loses money, and a few wrong turns in one session can grind down a meaningful share of your capital. That is why this book spends more pages on **when not to trade** and **how to exit** than on finding entries. This is not modesty. It is how this kind of position stays alive.

---

## What This Book Is Not

The second thing that belongs up front is what this book **deliberately leaves out**—so you do not discover halfway through that what you came for is not here.

**No calls, and no P&L screenshots.** Every level in this book carries a date so that you can pull up that session yourself and check it, not so that I can prove I made money. What transfers is the order in which you read the market, not any single trade from any single day (Chapter 9).

**Nothing about the short side, and nothing about spreads.** Selling puts, verticals, iron condors, calendars—not a word. Not because they are bad; quite the opposite. The risk shape of a short option is nearly the inverse of a long one (high win rate, brutal tail), and mixing the two into one book mostly teaches people to blend two incompatible approaches to position management. This book covers single-leg long premium only.

**No parameter pack, and no signal system.** The numbers that appear here—Delta 0.45–0.55, the 15–30 minutes after the open, the 30-to-15-minute window before the close—are my own habitual values. They are written down to make the point that **this kind of threshold should be set in advance rather than improvised**, not so that you can copy them. A different account size or a different platform calls for different numbers; even the absolute GEX readings are not comparable across vendors (Chapter 2).

**No promise that a wall will hold.** One sentence recurs throughout this book: **a wall is probability, not a guarantee.** Roughly 83% of session highs failed to break the Call Wall (**Appendix, Reference [1]**)—and the remaining share is March 26, the session where the wall simply collapsed (Chapter 6). Reading structure does not raise your win rate on its own. It tells you which side of the trade you are actually on, and when to admit you are wrong.

**Not a methodology for single-stock options.** SPX produces readable walls because its flow is extremely concentrated: contracts expiring the same day account for 40–50% of SPX options Volume (**Appendix, Reference [3]**), and market-maker books are concentrated as well. A single stock's option flow is far thinner and far more scattered, so what looks like a wall on its GEX chart may be the shadow of a handful of large orders. **Borrow the reasoning; do not copy the levels.**

**It does not teach you how to pick a direction.** What it teaches is how to judge **whether today's market deserves a directional view at all**, and only then to talk about direction—what kind of session this is, whether the structure allows an opinion, and why a correct call can still lose. Seven real trading days, walked through from beginning to end.

---

*A single-leg long option can lose its entire premium, and 0DTE makes that possible within a few hours. The figures and habits in this book come from my own trading and historical market conditions, and they will evolve as the market changes. This is a record of trade reviews, not investment advice. See “Disclaimer and High-Risk Warning” in the appendix for the full notice.*
