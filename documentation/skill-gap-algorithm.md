# Skill-Gap Analysis & Roadmap Generation Algorithm

## 1. Skill Proficiency Numeric Mapping
Each proficiency level is mapped to an ordinal numerical value:

| Proficiency Level | Numeric Score ($S$) | Description |
|-------------------|---------------------|-------------|
| **BEGINNER** | 1 | Basic theoretical understanding and elementary syntax |
| **INTERMEDIATE** | 2 | Practical ability to write features and use standard APIs |
| **ADVANCED** | 3 | Thorough understanding, architectural reasoning, and best practices |
| **EXPERT** | 4 | Deep mastery, performance tuning, and domain authority |
| *(Missing Skill)* | 0 | Student has not listed this skill in their profile |

---

## 2. Individual Skill Match Percentage

For each required skill $i$ defined for a target job role:

$$
\text{MatchPercentage}_i = \min\left(100.0, \frac{S_{\text{student}, i}}{S_{\text{required}, i}} \times 100.0\right)
$$

### Classification Rules:
- **`MISSING`**: The student does not have the skill in their profile ($S_{\text{student}, i} = 0 \implies \text{MatchPercentage}_i = 0\%$).
- **`NEEDS_IMPROVEMENT`**: The student possesses the skill, but $S_{\text{student}, i} < S_{\text{required}, i}$ ($\text{MatchPercentage}_i < 100\%$).
- **`MATCHED`**: The student meets or exceeds the required level ($S_{\text{student}, i} \ge S_{\text{required}, i} \implies \text{MatchPercentage}_i = 100\%$).

---

## 3. Weighted Placement Readiness Score

Each job-role skill has an assigned importance weight $W_i \in [1, 5]$.

The overall readiness score is computed as a weighted average across all $N$ required skills:

$$
\text{ReadinessScore} = \frac{\sum_{i=1}^{N} (\text{MatchPercentage}_i \times W_i)}{\sum_{i=1}^{N} W_i}
$$

The result is rounded to two decimal places and ranges from `0.00` to `100.00%`.

### Readiness Tiers:
- **75% - 100%**: High Placement Readiness (Interview & Placement Ready)
- **50% - 74.9%**: Moderate Readiness (Requires targeted skill refinement)
- **0% - 49.9%**: Low Readiness (Significant foundational gaps)

---

## 4. Personalized Roadmap Generation

When a roadmap is generated from an assessment:

1. **Filter Skill Gaps**: Only skills categorized as `MISSING` or `NEEDS_IMPROVEMENT` become roadmap tasks.
2. **Prioritization Score**:
   $$
   \text{PriorityScore} = (\text{status} == \text{MISSING} \,?\, 10 : 0) + W_i
   $$
   - `HIGH`: Skills marked as `MISSING` or with importance weight $W_i \ge 4$.
   - `MEDIUM`: Skills needing improvement with $W_i = 3$.
   - `LOW`: Low-weight improvements ($W_i \le 2$).
3. **Effort Estimation**:
   $$\text{EstimatedHours} = \max\left(10, (S_{\text{required}} - S_{\text{student}}) \times 15\right)$$
4. **Learning Resource Attachment**: The system automatically queries `learning_resources` for matching resources by `skill_id`.
5. **Timeline Sequencing**: Target milestone dates are assigned sequentially week-by-week based on descending priority.
