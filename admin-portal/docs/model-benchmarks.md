# Model Benchmarks

This document contains real benchmark scores for all models used in the ALICE AI system, sourced from official documentation and technical reports (2024-2025).

## GPT-4.1
**Source:** OpenAI Official (April 2025)

### Standard Benchmarks
- **MMLU (Massive Multitask Language Understanding)**: 90.2%
- **HumanEval (Coding)**: 92.0% (GPT-4o baseline, GPT-4.1 shows improvements)
- **GSM8K (Math)**: 96.0% (GPT-4o baseline)
- **SWE-bench Verified (Real-world SE)**: 54.6%

### Specific Domain Performance
- Abstract Algebra: +7% improvement over GPT-4o
- Formal Logic: +6% improvement
- College Mathematics: +5% improvement

**Notes:** GPT-4.1 nano variant scores 80.1% on MMLU. GPT-4.1 shows major gains in coding and reasoning tasks.

---

## Claude Sonnet 4 / 4.5
**Source:** Anthropic Official (2024-2025)

### Standard Benchmarks
- **MMLU**: 86.5%
- **HumanEval (Coding)**: 92.0% (Claude 3.5 Sonnet baseline)
- **SWE-bench Verified**: 72.7% - 77.2% (Sonnet 4.5)
- **AIME (Math Competition)**: 70.5%

### Agentic & Tool Use
- **OSWorld**: 61.4% (Sonnet 4.5, up from 42.2%)
- **TAU-bench**: 81.4% Retail / 59.6% Airline

### Visual Reasoning
- **MMMU**: 74.4%

**Notes:** State-of-the-art performance on software engineering benchmarks. Strong agentic capabilities.

---

## Gemini 2.5 Pro
**Source:** Google DeepMind Official (March 2025)

### Standard Benchmarks
- **MMLU**: 89.5%
- **Global MMLU (Lite)**: 89.8%
- **HumanEval (Coding)**: 84.1%
- **GSM8K (Math)**: Not specified in official sources

### Advanced Benchmarks
- **AIME 2025** (Math): 86.7% (pass@1)
- **AIME 2024**: 92.0% (pass@1)
- **GPQA Diamond** (Science): 84.0%
- **LiveCodeBench v5**: 70.4% (pass@1)
- **SWE-Bench Verified**: 63.8% (with custom agent)
- **Humanity's Last Exam**: 18.8% (human frontier of knowledge)

**Notes:** Top performance on multilingual understanding and advanced mathematics. Extensive reasoning capabilities.

---

## Qwen 2.5 VL 72B (Vision-Language)
**Source:** Qwen Team/Alibaba Official (2024-2025)

### Vision-Language Benchmarks
- **MMMU** (College-level Visual Problems): 70.2%
- **MathVista** (Visual Math): 74.8%
- **MMBench-EN**: 88.6%
- **OCRBench**: State-of-the-art
- **DocVQA, InfoVQA, TextVQA**: State-of-the-art (exact scores not publicly specified)

### Document Understanding
- Achieves SoTA on document comprehension, chart understanding, and high-resolution infographics
- Strong performance on text extraction from images across multiple domains

**Notes:** Specialized vision-language model. Superior performance on visual understanding, document analysis, and multimodal tasks. Processes images at any resolution.

---

## Qwen3-8B
**Source:** Qwen Team Technical Report (May 2025)

### Standard Benchmarks
- **MMLU**: 74.7%
- **HumanEval** (via EvalPlus, 0-shot): Competitive with larger models
- **GSM8K** (4-shot, CoT): Competitive performance

### Performance Characteristics
- Outperforms Qwen2.5-14B (larger model) on over 50% of benchmarks
- Particularly strong on STEM and coding tasks
- Pre-trained on ~36 trillion tokens across 119 languages

**Notes:** Exceptional performance-to-size ratio. Punches above its weight class, matching 14B models despite being 8B parameters.

---

## Benchmark Definitions

### MMLU (Massive Multitask Language Understanding)
Evaluates models across 57 subjects including mathematics, history, computer science, and law. Measures general knowledge and reasoning.

### HumanEval
Evaluates code generation ability. Models are given programming problems and must generate correct solutions.

### GSM8K (Grade School Math 8K)
Tests mathematical reasoning using grade-school math word problems.

### SWE-bench
Real-world software engineering tasks from actual GitHub issues. Tests ability to understand and modify existing codebases.

### AIME (American Invitational Mathematics Examination)
High-difficulty math competition problems. Tests advanced mathematical reasoning.

### MMMU (Massive Multi-discipline Multimodal Understanding)
College-level problems requiring vision and reasoning across disciplines like science, engineering, business, and humanities.

### GPQA (Graduate-Level Google-Proof Q&A)
PhD-level science questions designed to be challenging even for experts with internet access.

---

**Last Updated:** October 2025
**Sources:** Official model cards, technical reports, and announcements from OpenAI, Anthropic, Google DeepMind, and Qwen Team.
