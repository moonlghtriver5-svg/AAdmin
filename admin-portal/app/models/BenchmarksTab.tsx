'use client';

import { useState } from 'react';

interface BenchmarkScore {
  name: string;
  score: string;
  description: string;
}

interface ModelBenchmark {
  id: string;
  name: string;
  version: string;
  source: string;
  lastUpdated: string;
  benchmarks: BenchmarkScore[];
  notes?: string[];
}

const MODEL_BENCHMARKS: ModelBenchmark[] = [
  {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    version: 'GPT-4.1',
    source: 'OpenAI Official (April 2025)',
    lastUpdated: 'April 2025',
    benchmarks: [
      { name: 'MMLU', score: '90.2%', description: 'Massive Multitask Language Understanding' },
      { name: 'HumanEval', score: '92.0%', description: 'Coding proficiency benchmark' },
      { name: 'GSM8K', score: '96.0%', description: 'Grade school math reasoning' },
      { name: 'SWE-bench Verified', score: '54.6%', description: 'Real-world software engineering tasks' },
      { name: 'Abstract Algebra', score: '+7%', description: 'Improvement over GPT-4o' },
      { name: 'Formal Logic', score: '+6%', description: 'Improvement over GPT-4o' },
    ],
    notes: [
      'GPT-4.1 nano variant scores 80.1% on MMLU',
      'Major gains in coding and reasoning tasks',
      'Significant improvements in mathematical domains'
    ]
  },
  {
    id: 'claude-sonnet-4',
    name: 'Claude Sonnet 4',
    version: 'Claude Sonnet 4',
    source: 'Anthropic Official - Claude 4 Announcement (2024-2025)',
    lastUpdated: 'December 2024',
    benchmarks: [
      { name: 'MMMLU', score: '85.4%', description: 'Multilingual MMLU (without extended thinking)' },
      { name: 'MMMU', score: '72.6%', description: 'Visual reasoning (without extended thinking)' },
      { name: 'GPQA Diamond', score: '70.0%', description: 'PhD-level science (without extended thinking)' },
      { name: 'AIME', score: '33.1%', description: 'Math competition (without extended thinking)' },
      { name: 'SWE-bench (standard)', score: '72.7%', description: 'Software engineering' },
      { name: 'SWE-bench (high compute)', score: '80.2%', description: 'Software engineering with more compute' },
      { name: 'Terminal-bench', score: '35.5%', description: 'Terminal command understanding' },
    ],
    notes: [
      'State-of-the-art on software engineering with high compute reaching 80.2%',
      'Extended thinking mode available for complex reasoning tasks',
      'Scores shown are without extended thinking mode'
    ]
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    version: 'Gemini 2.5 Pro',
    source: 'Google DeepMind Official (March 2025)',
    lastUpdated: 'March 2025',
    benchmarks: [
      { name: 'MMLU', score: '89.5%', description: 'Massive Multitask Language Understanding' },
      { name: 'Global MMLU (Lite)', score: '89.8%', description: 'Multilingual understanding' },
      { name: 'HumanEval', score: '84.1%', description: 'Coding proficiency' },
      { name: 'AIME 2025', score: '86.7%', description: 'Math competition (pass@1)' },
      { name: 'AIME 2024', score: '92.0%', description: 'Math competition (pass@1)' },
      { name: 'GPQA Diamond', score: '84.0%', description: 'PhD-level science questions' },
      { name: 'LiveCodeBench v5', score: '70.4%', description: 'Code generation (pass@1)' },
      { name: 'SWE-Bench Verified', score: '63.8%', description: 'Software engineering with agent' },
      { name: "Humanity's Last Exam", score: '18.8%', description: 'Human frontier of knowledge' },
    ],
    notes: [
      'Top performance on multilingual understanding',
      'Exceptional advanced mathematics capabilities',
      'Strong reasoning on frontier knowledge tasks'
    ]
  },
  {
    id: 'qwen-2.5-vl-72b',
    name: 'Qwen2.5-VL-72B-Instruct',
    version: 'Qwen2.5-VL-72B-Instruct',
    source: 'Qwen Team/Alibaba Official - Hugging Face Model Card (2024-2025)',
    lastUpdated: 'December 2024',
    benchmarks: [
      { name: 'MMMU val', score: '70.2', description: 'College-level multimodal understanding' },
      { name: 'MMMU Pro', score: '51.1', description: 'Advanced multimodal problems' },
      { name: 'MathVista MINI', score: '74.8', description: 'Visual mathematics reasoning' },
      { name: 'MathVision FULL', score: '38.1', description: 'Full mathematics vision benchmark' },
      { name: 'DocVQA VAL', score: '96.4', description: 'Document visual question answering' },
      { name: 'ChartQA TEST', score: '89.5', description: 'Chart understanding and reasoning' },
      { name: 'OCRBench', score: '885', description: 'Optical character recognition' },
      { name: 'OCRBench-V2 (en/zh)', score: '47.8 / 46.1', description: 'Advanced OCR in English/Chinese' },
      { name: 'CC-OCR', score: '79.8', description: 'Complex content OCR' },
      { name: 'VideoMME (w/o sub)', score: '73.3', description: 'Video understanding without subtitles' },
      { name: 'VideoMME (w/ sub)', score: '79.1', description: 'Video understanding with subtitles' },
      { name: 'MVBench', score: '70.4', description: 'Multi-view benchmark' },
      { name: 'ScreenSpot', score: '87.1', description: 'Screen understanding for agents' },
    ],
    notes: [
      'Exceptional document understanding (96.4% DocVQA)',
      'Strong chart comprehension (89.5% ChartQA)',
      'Advanced OCR capabilities across languages',
      'Video understanding and agentic screen interaction',
      'Processes images at any resolution'
    ]
  },
  {
    id: 'qwen-3-8b',
    name: 'Qwen3-8B',
    version: 'Qwen3-8B',
    source: 'Qwen Team Technical Report (May 2025)',
    lastUpdated: 'May 2025',
    benchmarks: [
      { name: 'MMLU', score: '74.7%', description: 'Massive Multitask Language Understanding' },
      { name: 'HumanEval', score: 'Competitive', description: 'Coding (0-shot via EvalPlus)' },
      { name: 'GSM8K', score: 'Competitive', description: 'Math reasoning (4-shot, CoT)' },
    ],
    notes: [
      'Outperforms Qwen2.5-14B on 50%+ of benchmarks',
      'Exceptional performance-to-size ratio',
      'Strong on STEM and coding tasks',
      'Pre-trained on ~36 trillion tokens across 119 languages'
    ]
  },
  {
    id: 'qwen-3-32b',
    name: 'Qwen3-32B',
    version: 'Qwen3-32B',
    source: 'Qwen Team Technical Report (May 2025)',
    lastUpdated: 'May 2025',
    benchmarks: [
      { name: 'MMLU-Pro', score: '65.54', description: 'Advanced multitask understanding' },
      { name: 'SuperGPQA', score: '39.78', description: 'Graduate-level science questions' },
      { name: 'GPQA', score: '65.8', description: 'PhD-level science reasoning' },
      { name: 'AIME 2024', score: '73.8%', description: 'Math competition (pass@1)' },
      { name: 'AIME 2025', score: '65.6%', description: 'Math competition (pass@1)' },
    ],
    notes: [
      'Performs as well as Qwen2.5-72B-Base (larger model)',
      'Outperforms in STEM, coding, and reasoning tasks',
      'Supports thinking mode for complex problems',
      'Blended score of 59 on Artificial Analysis Intelligence Index'
    ]
  },
  {
    id: 'deepseek-r1-distill-qwen-14b',
    name: 'DeepSeek-R1-Distill-Qwen-14B',
    version: 'DeepSeek-R1-Distill-Qwen-14B',
    source: 'DeepSeek Official - Hugging Face Model Card (2025)',
    lastUpdated: 'January 2025',
    benchmarks: [
      { name: 'AIME 2024 (pass@1)', score: '69.7%', description: 'Math competition' },
      { name: 'AIME 2024 (cons@64)', score: '80.0%', description: 'Math competition with consensus' },
      { name: 'MATH-500 (pass@1)', score: '93.9%', description: 'Mathematical problem solving' },
      { name: 'GPQA Diamond (pass@1)', score: '59.1%', description: 'PhD-level science questions' },
      { name: 'LiveCodeBench (pass@1)', score: '53.1%', description: 'Code generation' },
      { name: 'Codeforces Rating', score: '1481', description: 'Competitive programming' },
    ],
    notes: [
      'Distilled from DeepSeek-R1 with 800k curated samples',
      'Based on Qwen2.5-14B',
      'Competitive performance across reasoning and coding'
    ]
  },
  {
    id: 'deepseek-r1-distill-qwen-32b',
    name: 'DeepSeek-R1-Distill-Qwen-32B',
    version: 'DeepSeek-R1-Distill-Qwen-32B',
    source: 'DeepSeek Official - Hugging Face Model Card (2025)',
    lastUpdated: 'January 2025',
    benchmarks: [
      { name: 'AIME 2024 (pass@1)', score: '72.6%', description: 'Math competition' },
      { name: 'AIME 2024 (cons@64)', score: '83.3%', description: 'Math competition with consensus' },
      { name: 'MATH-500 (pass@1)', score: '94.3%', description: 'Mathematical problem solving' },
      { name: 'GPQA Diamond (pass@1)', score: '62.1%', description: 'PhD-level science questions' },
      { name: 'LiveCodeBench (pass@1)', score: '57.2%', description: 'Code generation' },
      { name: 'Codeforces Rating', score: '1691', description: 'Competitive programming' },
    ],
    notes: [
      'Distilled from DeepSeek-R1',
      'Based on Qwen2.5-32B',
      'Outperforms smaller models and approaches larger model performance',
      'Excellent mathematical reasoning'
    ]
  },
  {
    id: 'qwen-3-30b-a3b',
    name: 'Qwen3-30B-A3B (MoE)',
    version: 'Qwen3-30B-A3B',
    source: 'Qwen Team Technical Report (May 2025)',
    lastUpdated: 'May 2025',
    benchmarks: [
      { name: 'AIME 2024', score: '80.4%', description: 'Math competition' },
      { name: 'AIME 2025', score: '81.5%', description: 'Math competition' },
      { name: 'Codeforces', score: '1974', description: 'Competitive programming' },
      { name: 'LiveCodeBench v5', score: '70.7', description: 'Code generation' },
      { name: 'GPQA', score: '65.8', description: 'PhD-level science questions' },
      { name: 'ArenaHard', score: '91.0', description: 'Challenging instruction following' },
      { name: 'MultiIF', score: '72.2', description: 'Multi-task instruction following' },
    ],
    notes: [
      'MoE model with 30.5B total parameters, 3.3B activated per token',
      '128 experts with 8 activated',
      'Outcompetes QwQ-32B (10x activated parameters) with only 3.3B active',
      'Strong across reasoning, coding, and general knowledge'
    ]
  },
  {
    id: 'qwen-3-235b-a22b',
    name: 'Qwen3-235B-A22B (MoE)',
    version: 'Qwen3-235B-A22B',
    source: 'Qwen Team Technical Report (May 2025)',
    lastUpdated: 'May 2025',
    benchmarks: [
      { name: 'MMLU', score: '76.6', description: 'Massive Multitask Language Understanding' },
      { name: 'MMLU-Pro', score: '83.0', description: 'Advanced MMLU (Instruct-2507 version)' },
      { name: 'AIME 2024', score: '85.7%', description: 'Math competition' },
      { name: 'AIME 2025 (Thinking-2507)', score: '92.3%', description: 'Math competition with extended thinking' },
      { name: 'LiveCodeBench v5', score: '70.7', description: 'Code generation' },
      { name: 'Codeforces', score: '2056', description: 'Competitive programming' },
      { name: 'BFCL v3', score: '70.8', description: 'Berkeley function calling' },
      { name: 'Arena-Hard v2 (Thinking-2507)', score: '79.7', description: 'Challenging instruction following' },
    ],
    notes: [
      'Flagship MoE model with 235B total parameters, 22B activated per token',
      'State-of-the-art open-source performance',
      'Multiple variants: Instruct-2507 and Thinking-2507',
      'Continuous improvements throughout 2025'
    ]
  },
  {
    id: 'qwen-3-next-80b-a3b',
    name: 'Qwen3-Next-80B-A3B-Instruct (MoE)',
    version: 'Qwen3-Next-80B-A3B-Instruct',
    source: 'Qwen Team - Hugging Face Model Card (2025)',
    lastUpdated: 'November 2025',
    benchmarks: [
      { name: 'MMLU-Pro', score: '80.6', description: 'Advanced multitask understanding' },
      { name: 'MMLU-Redux', score: '90.9', description: 'Refined MMLU benchmark' },
      { name: 'GPQA', score: '72.9', description: 'PhD-level science questions' },
      { name: 'SuperGPQA', score: '58.8', description: 'Graduate-level science questions' },
      { name: 'AIME 2025', score: '69.5%', description: 'Math competition' },
      { name: 'HMMT 2025', score: '54.1', description: 'Harvard-MIT Math Tournament' },
      { name: 'LiveBench 20241125', score: '75.8', description: 'Live general benchmark' },
      { name: 'LiveCodeBench v6', score: '56.6', description: 'Code generation' },
      { name: 'MultiPL-E', score: '87.8', description: 'Multilingual code evaluation' },
      { name: 'IFEval', score: '87.6', description: 'Instruction following' },
      { name: 'Arena-Hard v2', score: '82.7', description: 'Challenging instruction following' },
      { name: 'BFCL-v3', score: '70.3', description: 'Berkeley function calling' },
      { name: 'MultiIF', score: '75.8', description: 'Multi-task instruction following' },
    ],
    notes: [
      'Advanced MoE with 80B total parameters, 3B activated per token',
      '512 experts with 10 activated plus 1 shared expert',
      'Hybrid Attention: Gated DeltaNet + Gated Attention',
      'Ultra-long context modeling capabilities',
      'Strong across knowledge, reasoning, coding, and multilingual tasks'
    ]
  },
  {
    id: 'qwen-3-vl-30b-a3b',
    name: 'Qwen3-VL-30B-A3B-Instruct (Vision MoE)',
    version: 'Qwen3-VL-30B-A3B-Instruct',
    source: 'Qwen Team - Hugging Face Model Card (2025)',
    lastUpdated: 'September 2025',
    benchmarks: [
      { name: 'Context Length', score: '256K native', description: 'Expandable to 1M tokens' },
      { name: 'OCR Languages', score: '32', description: 'Supported languages for OCR' },
    ],
    notes: [
      'Vision-Language MoE with 31.1B total parameters',
      'Interleaved-MRoPE: Full-frequency positional embeddings',
      'DeepStack: Multi-level feature fusion',
      'Text-Timestamp Alignment for video temporal modeling',
      'Visual Agent functionality and advanced spatial perception',
      'Detailed benchmarks not publicly available as of October 2025'
    ]
  },
  {
    id: 'qwen-3-coder-30b-a3b',
    name: 'Qwen3-Coder-30B-A3B-Instruct (Coding MoE)',
    version: 'Qwen3-Coder-30B-A3B-Instruct',
    source: 'Qwen Team - Hugging Face Model Card (2025)',
    lastUpdated: 'September 2025',
    benchmarks: [
      { name: 'Context Length', score: '262,144', description: 'Native context length for code' },
    ],
    notes: [
      'Coding MoE with 30.5B total parameters, 3.3B activated per token',
      '128 experts with 8 activated',
      'Significant performance among open models on Agentic Coding',
      'Long-context capabilities for complex codebases',
      'Optimized for agentic coding tasks',
      'Detailed benchmarks not published separately from 480B flagship variant'
    ]
  },
];

const BENCHMARK_DEFINITIONS = [
  {
    name: 'MMLU',
    full: 'Massive Multitask Language Understanding',
    description: 'Evaluates models across 57 subjects including mathematics, history, computer science, and law. Measures general knowledge and reasoning.'
  },
  {
    name: 'HumanEval',
    full: 'HumanEval',
    description: 'Evaluates code generation ability. Models are given programming problems and must generate correct solutions.'
  },
  {
    name: 'GSM8K',
    full: 'Grade School Math 8K',
    description: 'Tests mathematical reasoning using grade-school math word problems.'
  },
  {
    name: 'SWE-bench',
    full: 'SWE-bench',
    description: 'Real-world software engineering tasks from actual GitHub issues. Tests ability to understand and modify existing codebases.'
  },
  {
    name: 'AIME',
    full: 'American Invitational Mathematics Examination',
    description: 'High-difficulty math competition problems. Tests advanced mathematical reasoning.'
  },
  {
    name: 'MMMU',
    full: 'Massive Multi-discipline Multimodal Understanding',
    description: 'College-level problems requiring vision and reasoning across disciplines like science, engineering, business, and humanities.'
  },
  {
    name: 'GPQA',
    full: 'Graduate-Level Google-Proof Q&A',
    description: 'PhD-level science questions designed to be challenging even for experts with internet access.'
  },
];

export default function BenchmarksTab() {
  const [selectedModel, setSelectedModel] = useState<string>(MODEL_BENCHMARKS[0].id);

  const currentBenchmark = MODEL_BENCHMARKS.find(m => m.id === selectedModel) || MODEL_BENCHMARKS[0];

  return (
    <div className="space-y-6">
      {/* Model selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Model
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
        >
          {MODEL_BENCHMARKS.map(model => (
            <option key={model.id} value={model.id}>{model.name}</option>
          ))}
        </select>
      </div>

      {/* Model info card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{currentBenchmark.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{currentBenchmark.version}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Source</p>
            <p className="text-sm font-medium text-gray-900">{currentBenchmark.source}</p>
            <p className="text-xs text-gray-500 mt-1">Updated: {currentBenchmark.lastUpdated}</p>
          </div>
        </div>

        {/* Benchmark scores table */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Benchmark Scores</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Benchmark</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {currentBenchmark.benchmarks.map((bench, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{bench.name}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {bench.score}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{bench.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        {currentBenchmark.notes && currentBenchmark.notes.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Notes</h4>
            <ul className="list-disc list-inside space-y-1">
              {currentBenchmark.notes.map((note, idx) => (
                <li key={idx} className="text-sm text-blue-800">{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Benchmark definitions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Benchmark Definitions</h3>
        <div className="space-y-4">
          {BENCHMARK_DEFINITIONS.map((def, idx) => (
            <div key={idx} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
              <h4 className="font-semibold text-gray-900">{def.name} <span className="text-sm font-normal text-gray-600">({def.full})</span></h4>
              <p className="text-sm text-gray-600 mt-1">{def.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-600">
          <strong>Sources:</strong> Official model cards, technical reports, and announcements from OpenAI, Anthropic, Google DeepMind, Qwen Team, and DeepSeek.
          All benchmark scores are from official sources published in 2024-2025.
        </p>
      </div>
    </div>
  );
}
