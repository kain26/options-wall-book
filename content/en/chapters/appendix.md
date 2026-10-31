# Appendix

1. Before You Trade
2. English Glossary and Metaphor Guide
3. Options Walls: One-Page Trading Checklist
4. Ten Rules on One Page
5. References
6. Disclaimer and High-Risk Warning

## 1. Before You Trade

**Every four-digit number in this book is a 2026 trading day**, written as MMDD: 0604 = June 4, 2026, meaning that day's SPX 0DTE review.

Seven days in all, in the order they appear in the text:

| Date | Full date | Chapter | In one line |
| --- | --- | --- | --- |
| 0604 | 2026-06-04 | Chapter 1 | The Call Wall stepped up level by level—do not short |
| 0213 | 2026-02-13 | Chapter 4 | The Put Wall was swept and reclaimed |
| 0217 | 2026-02-17 | Chapter 4 | Held above the Gamma Flip and pushed to the wall |
| 0227 | 2026-02-27 | Chapter 6 | A deep V inside negative Gamma |
| 0318 | 2026-03-18 | Chapter 6 | GVP leaned short; VWAP lost, then a grind down all day |
| 0326 | 2026-03-26 | Chapter 6 | The Put Wall collapsed |
| 0123 | 2026-01-23 | Chapter 8 | A round-number stop run |

**Options in one sentence**

An option is a transferable contractual right.

- **Call:** the right to buy the underlying at an agreed price
- **Put:** the right to sell the underlying at an agreed price

The buyer pays premium; the seller receives premium and assumes an obligation. This book covers only long-premium positions—Long Calls and Long Puts.

---

**Five elements of one contract**

| Element | Term | SPX 0DTE example |
| --- | --- | --- |
| Instrument | Underlying | SPX index |
| Exercise level | Strike | 6800, illustrative |
| Final date | Expiration | Same day, 0DTE |
| Option type | Type | Call / Put |
| Position | Side | Long / Short |

0DTE means expiration on the same day. Time value decays rapidly and becomes more severe near the close.

---

**Four basic positions**

| | Call | Put |
| --- | --- | --- |
| **Long** | Directional exposure to a rise | Directional exposure to a decline |
| **Short** | Benefits when price does not rise enough | Benefits when price does not fall enough |

Long-premium 0DTE commonly combines a low hit rate, a potentially high payoff, and toxic time decay. Correct direction can still fail to produce profit because of time or IV.

---

**Three components of an option price**

```text
Option Price ≈ Intrinsic Value + Time Value, including IV
```

| Component | Intuition | For a 0DTE buyer |
| --- | --- | --- |
| Intrinsic value | What immediate exercise is worth | Present only in the money |
| Time value | Uncertainty remaining before expiration | Shrinks toward the close |
| IV | Market price of expected volatility | Often expensive before an event and vulnerable to crush afterward |

---

**Four Greeks, intuitively**

| Greek | Question answered | Role in this book |
| --- | --- | --- |
| Delta | How much does the option move when SPX moves one point? | Directional exposure hedged by market makers |
| Gamma | How quickly does Delta change? | Raw input to GEX; see Chapter 2 |
| Theta | How much value disappears as time passes? | Toxic to buyers, especially after 15:30 |
| Vega | How does a change in IV affect the option? | Event days and Vanna; see Chapter 3 |

When Gamma concentration is drawn by strike, it forms a GEX map. First form the picture “market makers are compelled to hedge → hedging affects price,” then read the main text.

---

**Why SPX?**

- European-style and cash-settled: no early assignment; Pin and GEX structure are relatively clean
- Deep 0DTE liquidity: market-maker hedging footprints are easier to read

Many options you buy are transacted with market makers. After selling them, market makers hedge Delta. The book begins from that chain.

---

**Illustrative figures vs review figures**

| Type | How to recognize it | How to use it |
| --- | --- | --- |
| Review figure | The chapter names a specific trading date, such as 0604 | Compare with that day's structure to understand the mechanism; do not copy it as tomorrow's signal |
| Illustrative figure | Conceptual map, numerical example, or ASCII diagram labeled illustrative | Learn the reading and logic; levels and times may not match a live session |

---

**GEX data and software, without endorsing a product**

The main text uses OI GEX for premarket structure and Volume GEX for intraday updates. Professional options analytics tools commonly provide Gamma bars by strike, an OI/Volume switch, and Call Wall, Put Wall, and Gamma Flip labels. Interfaces and calculations differ. Identify the functions. This book does not name or endorse a specific product.

---

## 2. English Glossary and Metaphor Guide

**Core levels**

| Term | Meaning | In one sentence | What it is not |
| --- | --- | --- | --- |
| Call Wall | Largest Call-side Gamma concentration | Zone of concentrated overhead pressure | Not an iron ceiling |
| Put Wall | Largest Put-side Gamma concentration | Zone of concentrated support below | Not an iron floor |
| Gamma Flip | Zero-Gamma boundary | Switch between damping and acceleration regimes | Not ordinary support |

**Patterns and order flow**

| Term | Meaning | In one sentence |
| --- | --- | --- |
| Liquidity Sweep | Stop-clearing false break | Break a key level, trigger stops, and reclaim quickly |
| Stop Run | Hunt through a stop cluster | Pierce a few points below a round number, trigger the stops, and reclaim |

How to read it: a false break and reclaim at a Put Wall is usually called a liquidity sweep, as on February 13; a pure round-number stop cluster is called a stop run, as on January 23. **A stop run is one kind of liquidity sweep, not a second, parallel thing.**

**On depth:** both instances in this book measured **about four and a half points**—January 23 was 4.5 points below 6900 (6895.50), February 13 was 4.5 points below 6800 (6795.49). Do not treat that as a fixed value, but do not expect it to hand you a buffer of ten points either.

**Positive- and negative-Gamma regimes**

| Term | Intuition | Market-maker tendency |
| --- | --- | --- |
| Positive Gamma / GEX | Shock absorber | Buy declines and sell rallies → volatility is dampened |
| Negative Gamma / GEX | Accelerator | Sell declines and buy rallies → volatility is amplified |

**Metaphor quick reference**

| Concept | Metaphor | In one sentence |
| --- | --- | --- |
| Positive GEX | Shock absorber | Sell rallies and buy declines to stabilize price |
| Negative GEX | Accelerator | Buy rallies and sell declines to amplify movement |
| Call Wall | Ceiling | Overhead selling pressure concentrates nearby |
| Put Wall | Floor | Buying support concentrates below |
| Gamma Flip | Character switch | More stable above, more agitated below |
| Market-maker hedging | Automatic balancing machine | Avoids directional bets and balances the book |
| GEX map | Weather radar | Identify the day's character first |
| Pin | Closing magnet | Heavy OI at a strike attracts price near the close |

---

## 3. Options Walls: One-Page Trading Checklist

**Three premarket tasks**

1. Calendar → event day or OPEX?
2. GEX → Call Wall / Put Wall / Gamma Flip using premarket OI
3. Map → previous high and low + event timeline

Spot vs Gamma Flip:

- Above → more like a shock absorber: range and grind
- Below → more like an accelerator: trend; be cautious catching a falling knife

**Intraday rhythm**

```text
Premarket                → mark walls with OI
First 15–30 minutes      → see whether the center of trading moves (watch only, no size)
10:00–15:00              → Volume dominates; follow Volume walls
Final 30–15 minutes      → OI regains weight; read possible Pin
```

In one sentence: follow Volume intraday; invite OI back for the final half hour.

**GVP framework**

```text
GEX (structure) + VWAP (cost) + Price Action (trend)
Act only when aligned; remain still when they conflict.
```

**Contract selection**

- Standing range **Delta 0.45–0.55** (around ATM), nudged within 0.4–0.6 by the day's character
- Delta drifts (Charm): “I bought the 0.45” is true only at the moment of the order

**Three exit stages**

1. Profit reaches roughly 50% of the expected move → reduce half
2. Price reaches Call / Put Wall → reduce again or exit
3. Structure reverses—Flip or VWAP fails → exit the remainder

There is also a **time stop**: once the Gamma window (roughly 5–30 minutes after entry) has closed and the push is gone, leave. **Structure, time, and premium are three brakes—whichever triggers first is the one you follow.**

**Position-size check, ten seconds before entry**

1. Full-premium loss in dollars and percentage of account?
2. Stop or abandonment point?
3. Event day? → become more conservative
4. Calm or trying to recover? → if the second, do not enter

After three consecutive losses, reduce size or stop. Do not double for 72 hours after a large gain.

**False break vs genuine break**

- False break: cross → pause → quick reclaim, **and it does not come back under the level afterward**
- Genuine break: cross → no return, **or it reclaims and then cannot hold** → continuation

Judge it in two steps: **first ask whether it reclaimed, then ask whether it held.**

**Event-day principle**

Do not guess the number. Control size, wait 15–30 minutes, and respect IV pricing.

---

**Intraday Rhythm Table**

| Period | Volume GEX | OI GEX | Use |
| --- | --- | --- | --- |
| Premarket | Low | High | Mark overnight walls |
| Open to ~30 minutes | Rising | Declining | See whether the center of trading moves |
| 10:00–15:00 | Primary | Secondary | Follow Volume-based Walls |
| 15:30–15:45 | Secondary | Clearly rising | Increase the weight of OI Walls |
| 15:45–16:00 | Reference | High, Pin phase | Look for OI + Volume confluence |

**In one sentence:** follow Volume intraday; invite OI back in the final 30–15 minutes.

---

**Three Scenarios**

| Scenario | What to watch | Key action | Review |
| --- | --- | --- | --- |
| Put Wall | False vs genuine break; positive vs negative Gamma | Wait for reclaim + VWAP | February 13 reclaimed / March 26 broke |
| Gamma Flip | Did character switch, and did price hold? | Wait for breakout confirmation | February 17: 6810 → 6850 |
| Vanna deep V | Falling IV and shrinking absolute GEX | Stop chasing the short | February 27 |

**False break vs genuine break**

| Type | Characteristics | Instance |
| --- | --- | --- |
| False break | Cross → pause → quick reclaim, **and it does not return below the level** (liquidity sweep) | February 13: reclaimed on the same candle |
| Genuine break | Cross → no return; **or it reclaims and still cannot hold**, and the wall then moves down | March 26: it did reclaim, and held for twenty minutes |

**So the judgment has two steps:** first ask whether it reclaimed, then ask whether it held. Stop at the first step and March 26 gets misread as a false break—it genuinely did reclaim that day (Chapters 6 and 8).

---

**Position-Size Self-Check**

1. What is the full-premium loss in dollars and percentage of account?
2. Where is the stop or abandonment point?
3. Is today an event day? If yes, become more conservative
4. Am I calm or trying to recover? If the second, do not enter

| Stage | Tendency |
| --- | --- |
| Learning | Smaller and slower |
| Stable | Set your own ceiling and enforce it strictly |
| Losing streak | Reduce rather than increase |
| After a large win | No doubling for 72 hours |

---

**Event-Day Checklist**

- High-impact macro event?
- IV visibly higher than in recent sessions?
- Plan to open less or nothing before the event?
- Wait 15–30 minutes after release before reading GEX / VWAP again?

**Principle:** do not guess the data; control size, wait for structure, and respect IV pricing.

**“Respect IV pricing” in one line:** whatever the day's ATM straddle is quoted at, in points, is how large a move the market has already priced in. Guess the direction right without exceeding that distance and a single leg still loses (Chapter 7).

---

**Three Exit Stages**

| Stage | Trigger | Action |
| --- | --- | --- |
| 1 | Profit reaches roughly 50% of the expected move | Reduce half |
| 2 | Price reaches the Call / Put Wall, or a profit-taking signal appears | Reduce again or exit fully |
| 3 | Structural reversal—Gamma Flip breaks or VWAP fails | Exit everything remaining |

**There is also a gate on time:** once the Gamma-burst window (roughly 5–30 minutes after entry) has closed and the push is gone, leave even if no level has been touched. **Structure, time, and premium are three brakes—act on whichever triggers first** (Chapter 7).

---

## 4. Ten Rules on One Page

1. Do not guess direction; identify character first. Is today a positive-Gamma shock absorber or a negative-Gamma accelerator?
2. Know three lines: Call Wall—the ceiling; Put Wall—the floor; Gamma Flip—the character switch.
3. A market maker is not “the house.” It is a machine compelled to hedge, not a directional bettor.
4. Positive Gamma = shock absorber—sell rallies, buy declines, suppress volatility. Negative Gamma = accelerator—buy rallies, sell declines, amplify volatility.
5. Walls move, collapse, and break—never treat them as an iron floor or ceiling. After a break, first ask whether it reclaimed, then ask whether it held.
6. Vanna can create a mechanical rebound as fear cools. Charm changes Delta with time, so a flat market can still lose money for the buyer.
7. Do not become greedy near the close. Pin can attract price, Charm accelerates, and Theta consumes premium.
8. Act when GVP—GEX + VWAP + price action—aligns; do nothing when it conflicts.
9. Choose your own size. Cap full-premium loss at an amount that lets you sleep. Do not add or average down.
10. After a large gain or loss, wait: 24 hours after a large loss and 72 after a large gain. The most valuable action is often no action.

---

## 5. References

**Probability calibration: where “a wall is probability, not a guarantee” comes from**

The main text repeats “a wall is probability, not a guarantee” and “do not buy Calls at the Call Wall.” The statistical basis for both sentences is here. The following data comes from public historical statistics published by SpotGamma, using SPX trading days from 2019–2024. It calibrates probabilities; it is not a prediction and not a trading guarantee. Calculations and levels need not agree across providers.

> [1] SpotGamma. *SPX Key Levels Statistics*, 2024.
>
> [https://support.spotgamma.com/hc/en-us/articles/31209900542867](https://support.spotgamma.com/hc/en-us/articles/31209900542867)
>
> Call Wall: 83% of session highs did not break it and 88% of closes finished below; Put Wall: 89% of session lows did not break it and 93% of closes finished above.

> [2] SpotGamma. *Volatility Trigger*.
>
> [https://support.spotgamma.com/hc/en-us/articles/15297954935699](https://support.spotgamma.com/hc/en-us/articles/15297954935699)
>
> Similar to this book's Gamma Flip concept, though levels need not agree. Reported five-day realized volatility was 13% after opening above and 18% after opening below.

**Mechanism and market-size references**

> [3] SpotGamma. *GEX Explained*, *Vanna and Charm Explained*, *0DTE Explained*.
>
> [https://spotgamma.com](https://spotgamma.com)
>
> GEX, Vanna/Charm mechanisms, and an estimate that 0DTE represents 40–50% of options Volume.

> [4] MenthorQ. *Greeks and Hedging Flow Guide*.
>
> [https://menthorq.com/guide/greeks-and-hedging-flow/](https://menthorq.com/guide/greeks-and-hedging-flow/)
>
> Reference for hedging mechanisms.

---

## 6. Disclaimer and High-Risk Warning

**Nature of this book**

*Options Walls: An Intraday Guide to SPX, Buyer Edition* is the author's personal trading notebook and collection of historical trade reviews. It is not:

- Securities investment advice or asset-management service
- A trade recommendation, signal, or copy-trading service
- Investment marketing that guarantees profit

**Levels and examples**

Every SPX level, time, chart, and ASCII diagram in the text is used to explain a mechanism or review a historical session:

- None is a current or future trading signal
- None should be copied mechanically into another trading day

**Options and 0DTE risk**

- SPX 0DTE options can expire worthless; the buyer can lose the entire premium
- Under negative Gamma, event-day volatility, or closing Pin / Charm conditions, correct direction can still produce a loss
- Leverage and the SPX $100-per-point multiplier mean even a small position can create large dollar volatility

**Data and tools**

Concepts such as GEX, Call and Put Walls, and Gamma Flip depend on third-party market data and options analytics platforms. The author does not endorse, recommend, or sell a particular product or data service. Calculations and labels may differ. Readers must verify data independently and make their own decisions.

**Risk warning**

This book presents ways of thinking about options and historical examples. You bear all risks and consequences of any trade made in reliance on it. Ensure that you have appropriate knowledge and risk tolerance. Consult a licensed professional where necessary.

**This book is a personal trading notebook and historical review. It is not investment advice. Markets involve risk; make independent decisions.**

---

*I have read and understood the notice above.*
