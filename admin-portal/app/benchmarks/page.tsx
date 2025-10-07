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
    version: 'Claude Sonnet 4 / 4.5',
    source: 'Anthropic Official (2024-2025)',
    lastUpdated: 'September 2025',
    benchmarks: [
      { name: 'MMLU', score: '86.5%', description: 'Massive Multitask Language Understanding' },
      { name: 'HumanEval', score: '92.0%', description: 'Coding proficiency' },
      { name: 'SWE-bench Verified', score: '77.2%', description: 'Software engineering (Sonnet 4.5)' },
      { name: 'AIME', score: '70.5%', description: 'Advanced math competition' },
      { name: 'OSWorld', score: '61.4%', description: 'Agentic task performance (Sonnet 4.5)' },
      { name: 'MMMU', score: '74.4%', description: 'Visual reasoning' },
      { name: 'TAU-bench', score: '81.4% / 59.6%', description: 'Retail / Airline agentic tool use' },
    ],
    notes: [
      'State-of-the-art on software engineering benchmarks',
      'Strong agentic and tool use capabilities',
      'Sonnet 4.5 improved OSWorld from 42.2% to 61.4%'
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
    name: 'Qwen 2.5 VL 72B',
    version: 'Qwen 2.5 VL 72B Instruct',
    source: 'Qwen Team/Alibaba Official (2024-2025)',
    lastUpdated: 'December 2024',
    benchmarks: [
      { name: 'MMMU', score: '70.2%', description: 'College-level visual problems' },
      { name: 'MathVista', score: '74.8%', description: 'Visual mathematics reasoning' },
      { name: 'MMBench-EN', score: '88.6%', description: 'Visual question answering' },
      { name: 'OCRBench', score: 'SOTA', description: 'Optical character recognition' },
      { name: 'DocVQA', score: 'SOTA', description: 'Document visual question answering' },
      { name: 'InfoVQA', score: 'SOTA', description: 'Infographic understanding' },
      { name: 'TextVQA', score: 'SOTA', description: 'Text in images understanding' },
    ],
    notes: [
      'Specialized vision-language model',
      'State-of-the-art on document and chart understanding',
      'Processes images at any resolution',
      'Strong multimodal reasoning capabilities'
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

export default function BenchmarksPage() {
  const [selectedModel, setSelectedModel] = useState<string>(MODEL_BENCHMARKS[0].id);

  const currentBenchmark = MODEL_BENCHMARKS.find(m => m.id === selectedModel) || MODEL_BENCHMARKS[0];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Model Benchmarks</h2>
        <p className="text-gray-600 mt-2">
          Official benchmark scores from recent evaluations and technical reports
        </p>
      </div>

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
          <strong>Sources:</strong> Official model cards, technical reports, and announcements from OpenAI, Anthropic, Google DeepMind, and Qwen Team.
          All benchmark scores are from official sources published in 2024-2025.
        </p>
      </div>
    </div>
  );
}
