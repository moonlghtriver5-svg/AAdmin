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

## Claude Sonnet 4
**Source:** Anthropic Official - Claude 4 Announcement (2024-2025)

### Standard Benchmarks (without extended thinking)
- **MMMLU** (Multilingual MMLU): 85.4%
- **MMMU** (Visual Reasoning): 72.6%
- **GPQA Diamond** (PhD Science): 70.0%
- **AIME** (Math Competition): 33.1%

### Software Engineering
- **SWE-bench** (standard): 72.7%
- **SWE-bench** (high compute): 80.2%
- **Terminal-bench**: 35.5%

**Notes:** State-of-the-art performance on software engineering. With high compute, SWE-bench reaches 80.2%. Extended thinking mode available for complex reasoning tasks.

---

## Claude Opus 4
**Source:** Anthropic Official - Claude 4 Announcement (2024-2025)

### Standard Benchmarks (without extended thinking)
- **MMMLU** (Multilingual MMLU): 87.4%
- **MMMU** (Visual Reasoning): 73.7%
- **GPQA Diamond** (PhD Science): 74.9%
- **AIME** (Math Competition): 33.9%

### Software Engineering
- **SWE-bench** (standard): 72.5%
- **SWE-bench** (high compute): 79.4%
- **Terminal-bench**: 43.2%

**Notes:** Most capable Claude 4 model. Superior reasoning and agentic capabilities. Extended thinking mode provides even stronger performance on complex tasks.

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

## Qwen2.5-VL-72B-Instruct (Vision-Language)
**Source:** Qwen Team/Alibaba Official - Hugging Face Model Card (2024-2025)

### Image Understanding Benchmarks
- **MMMU val**: 70.2
- **MMMU Pro**: 51.1
- **MathVista MINI**: 74.8
- **MathVision FULL**: 38.1
- **DocVQA VAL**: 96.4
- **ChartQA TEST**: 89.5
- **OCRBench**: 885
- **OCRBench-V2** (en/zh): 47.8 / 46.1
- **CC-OCR**: 79.8

### Video Understanding Benchmarks
- **VideoMME** (w/o sub): 73.3
- **VideoMME** (w/ sub): 79.1
- **MVBench**: 70.4
- **LVBench**: 47.3
- **EgoSchema**: 76.2
- **PerceptionTest**: 73.2

### Agent Benchmarks
- **ScreenSpot**: 87.1
- **Android Control** (High EM): 67.36
- **Android Control** (Low EM): 93.7
- **AndroidWorld SR**: 35%

**Notes:** Specialized vision-language model with exceptional document understanding (96.4% DocVQA), chart comprehension (89.5% ChartQA), and OCR capabilities. Strong video understanding and agentic capabilities. Processes images at any resolution.

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

## Qwen3-32B
**Source:** Qwen Team Technical Report (May 2025)

### Standard Benchmarks
- **MMLU-Pro**: 65.54
- **SuperGPQA**: 39.78
- **GPQA**: 65.8
- **AIME 2024** (pass@1): 73.8%
- **AIME 2025** (pass@1): 65.6%

### Performance Characteristics
- Performs as well as Qwen2.5-72B-Base (larger model with 2x parameters)
- Outperforms in STEM, coding, and reasoning tasks
- Supports seamless switching between thinking mode and non-thinking mode
- Blended score of 59 on Artificial Analysis Intelligence Index

**Notes:** Largest dense model in Qwen3 series. Significantly outperforms Qwen2.5-32B-Base. Superior efficiency with performance matching much larger models.

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

---

## DeepSeek-R1-Distill-Qwen-14B
**Source:** DeepSeek Official - Hugging Face Model Card (2025)

### Standard Benchmarks
- **AIME 2024** (pass@1): 69.7%
- **AIME 2024** (cons@64): 80.0%
- **MATH-500** (pass@1): 93.9%
- **GPQA Diamond** (pass@1): 59.1%

### Coding Benchmarks
- **LiveCodeBench** (pass@1): 53.1%
- **Codeforces Rating**: 1481

**Notes:** Distilled from DeepSeek-R1 with 800k curated samples. Based on Qwen2.5-14B. Competitive performance across reasoning and coding benchmarks.

---

## DeepSeek-R1-Distill-Qwen-32B
**Source:** DeepSeek Official - Hugging Face Model Card (2025)

### Standard Benchmarks
- **AIME 2024** (pass@1): 72.6%
- **AIME 2024** (cons@64): 83.3%
- **MATH-500** (pass@1): 94.3%
- **GPQA Diamond** (pass@1): 62.1%

### Coding Benchmarks
- **LiveCodeBench** (pass@1): 57.2%
- **Codeforces Rating**: 1691

**Notes:** Distilled from DeepSeek-R1. Based on Qwen2.5-32B. Outperforms smaller models and approaches performance of larger models. Excellent mathematical reasoning.

---

## Qwen3-30B-A3B (MoE)
**Source:** Qwen Team Technical Report (May 2025)

### Model Architecture
- **Total Parameters**: 30.5B
- **Activated Parameters**: 3.3B per token
- **Number of Experts**: 128 (8 activated)

### Benchmark Scores
- **AIME 2024**: 80.4%
- **AIME 2025**: 81.5%
- **Codeforces**: 1974
- **LiveCodeBench v5**: 70.7
- **GPQA**: 65.8
- **ArenaHard**: 91.0
- **MultiIF**: 72.2

**Notes:** MoE model with exceptional efficiency - outcompetes QwQ-32B (10x activated parameters) while using only 3.3B active params. Strong across reasoning, coding, and general knowledge.

---

## Qwen3-235B-A22B (MoE)
**Source:** Qwen Team Technical Report (May 2025)

### Model Architecture
- **Total Parameters**: 235B
- **Activated Parameters**: 22B per token

### Benchmark Scores
- **MMLU**: 76.6
- **MMLU-Pro**: 83.0 (Instruct-2507 version)
- **AIME 2024**: 85.7%
- **AIME 2025**: 81.5% (92.3% for Thinking-2507 version)
- **LiveCodeBench v5**: 70.7
- **Codeforces**: 2056
- **BFCL v3**: 70.8
- **Arena-Hard v2**: 79.7 (Thinking-2507 version)

**Notes:** Flagship MoE model. State-of-the-art open-source performance. Multiple variants including Instruct-2507 and Thinking-2507 with continuous improvements throughout 2025.

---

## Qwen3-Next-80B-A3B-Instruct (MoE)
**Source:** Qwen Team - Hugging Face Model Card (2025)

### Model Architecture
- **Total Parameters**: 80B
- **Activated Parameters**: 3B per token
- **Number of Experts**: 512 (10 activated)
- **Shared Experts**: 1

### Knowledge Benchmarks
- **MMLU-Pro**: 80.6
- **MMLU-Redux**: 90.9
- **GPQA**: 72.9
- **SuperGPQA**: 58.8

### Reasoning Benchmarks
- **AIME 2025**: 69.5%
- **HMMT 2025**: 54.1
- **LiveBench 20241125**: 75.8

### Coding Benchmarks
- **LiveCodeBench v6**: 56.6
- **MultiPL-E**: 87.8
- **Aider-Polyglot**: 49.8

### Alignment Benchmarks
- **IFEval**: 87.6
- **Arena-Hard v2**: 82.7
- **Creative Writing v3**: 85.3
- **WritingBench**: 87.3

### Agent Benchmarks
- **BFCL-v3**: 70.3
- **TAU1-Retail**: 60.9
- **TAU2-Retail**: 57.3

### Multilingualism
- **MultiIF**: 75.8
- **MMLU-ProX**: 76.7
- **INCLUDE**: 78.9
- **PolyMATH**: 45.9

**Notes:** Advanced MoE model with Hybrid Attention architecture combining Gated DeltaNet and Gated Attention. Enables efficient context modeling for ultra-long context. 512 experts with 10 activated plus 1 shared expert provides exceptional performance across knowledge, reasoning, coding, and multilingual tasks.

---

## Qwen3-VL-30B-A3B-Instruct (Vision-Language MoE)
**Source:** Qwen Team - Hugging Face Model Card (2025)

### Model Architecture
- **Total Parameters**: 31.1B
- **Architecture**: Mixture of Experts (MoE)
- **Context Length**: 256K native (expandable to 1M)

### Key Features
- Interleaved-MRoPE: Full-frequency positional embeddings
- DeepStack: Multi-level feature fusion
- Text-Timestamp Alignment for video temporal modeling
- Visual Agent functionality
- OCR support for 32 languages
- Advanced spatial perception

**Notes:** Comprehensive vision-language model with enhanced multimodal reasoning, advanced spatial perception, and strong video understanding. Benchmark scores not publicly available on official model card as of October 2025.

---

## Qwen3-Coder-30B-A3B-Instruct (Coding MoE)
**Source:** Qwen Team - Hugging Face Model Card (2025)

### Model Architecture
- **Total Parameters**: 30.5B
- **Activated Parameters**: 3.3B per token
- **Number of Experts**: 128 (8 activated)
- **Context Length**: 262,144 tokens native

### Performance Characteristics
- Significant performance among open models on Agentic Coding
- Long-context capabilities for complex codebases
- Streamlined model maintaining impressive coding performance

**Notes:** Specialized coding model based on Qwen3-30B-A3B MoE architecture. Optimized for agentic coding tasks with long-context support. Detailed benchmark scores not published separately from flagship 480B variant as of October 2025.

---

**Last Updated:** October 2025
**Sources:** Official model cards, technical reports, and announcements from OpenAI, Anthropic, Google DeepMind, Qwen Team, and DeepSeek.
