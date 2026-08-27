# Appendix

1. Before You Trade
2. English Glossary and Metaphor Guide
3. Options Walls: One-Page Trading Checklist
4. Ten Rules on One Page
5. References
6. Disclaimer and High-Risk Warning

## 1. Before You Trade

**Four-digit dates** such as 0604 and 0123 refer to 2026 trading days. For example, 0604 means June 4, 2026, and identifies that day's SPX 0DTE review.

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
| Stop Run | Hunt through a stop cluster | Pierce 5–10 points beyond a round number, trigger stops, and reclaim |

A false break and reclaim at a Put Wall is commonly called a liquidity sweep, as on February 13. A sweep around a psychological round number is called a stop run here, as on January 23.

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
Premarket            → mark walls with OI
Open to 30 minutes   → see whether the center of trading moves
10:00–15:00          → Volume dominates; follow Volume walls
Final 30–15 minutes  → OI regains weight; read possible Pin
```

In one sentence: follow Volume intraday; invite OI back for the final half hour.

**GVP framework**

```text
GEX (structure) + VWAP (cost) + Price Action (trend)
Act only when aligned; remain still when they conflict.
```

**Three exit stages**

1. Profit reaches roughly 50% of the expected move → reduce half
2. Price reaches Call / Put Wall → reduce again or exit
3. Structure reverses—Flip or VWAP fails → exit the remainder

**Position-size check, ten seconds before entry**

1. Full-premium loss in dollars and percentage of account?
2. Stop or abandonment point?
3. Event day? → become more conservative
4. Calm or trying to recover? → if the second, do not enter

After three consecutive losses, reduce size or stop. Do not double for 72 hours after a large gain.

**False break vs genuine break**

- False break: cross → pause → quick reclaim
- Genuine break: cross → no return → continuation

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

| Type | Characteristics |
| --- | --- |
| False break | Cross → pause → quick reclaim, a liquidity sweep |
| Genuine break | Cross → no return → continuation |

---

**Position-Size Self-Check**

1. What is the full-premium loss in dollars and percentage of account?
2. Where is the stop or abandonment point?
3. Is today an event day? If yes, become more conservative
4. Am I calm or trying to recover? If the second, do not enter

| Stage | Tendency |
| --- | --- |
| Learning | Smaller and slower |
| Losing streak | Reduce rather than increase |
| After a large win | No doubling for 72 hours |

---

**Event-Day Checklist**

- High-impact macro event?
- IV visibly higher than in recent sessions?
- Plan to open less or nothing before the event?
- Wait 15–30 minutes after release before reading GEX / VWAP again?

**Principle:** do not guess the data; control size, wait for structure, and respect IV pricing.

---

**Three Exit Stages**

| Stage | Trigger | Action |
| --- | --- | --- |
| 1 | First target or meaningful time decay | Reduce part |
| 2 | Momentum exhaustion, such as sideways action at a Call Wall | Reduce again |
| 3 | Structural reversal—Gamma Flip breaks or VWAP fails | Exit the remainder |

---

## 4. Ten Rules on One Page

1. Do not guess direction; identify character first. Is today a positive-Gamma shock absorber or a negative-Gamma accelerator?
2. Know three lines: Call Wall—the ceiling; Put Wall—the floor; Gamma Flip—the character switch.
3. A market maker is not “the house.” It is a machine compelled to hedge, not a directional bettor.
4. Positive Gamma = shock absorber—sell rallies, buy declines, suppress volatility. Negative Gamma = accelerator—buy rallies, sell declines, amplify volatility.
5. Walls move, collapse, and break. Never treat them as an iron floor or ceiling.
6. Vanna can create a mechanical rebound as fear cools. Charm changes Delta with time, so a flat market can still lose money for the buyer.
7. Do not become greedy near the close. Pin can attract price, Charm accelerates, and Theta consumes premium.
8. Act when GVP—GEX + VWAP + price action—aligns; do nothing when it conflicts.
9. Choose your own size. Cap full-premium loss at an amount that lets you sleep. Do not add or average down.
10. After a large gain or loss, wait: 24 hours after a large loss and 72 after a large gain. The most valuable action is often no action.

---

## 5. References

**Statistics cited in the main text**

The following data comes from public historical statistics published by SpotGamma, using SPX trading days from 2019–2024. It calibrates probabilities; it is not a prediction or guarantee. Calculations and levels can differ by provider.

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
