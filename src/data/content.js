// Everything the site says lives here. Edit this file to update the portfolio.
// Numbers are quoted from each project's own README or committed outputs — keep it that way.
import { tOf } from '../lib/curve';

const BASE = import.meta.env.BASE_URL;
const GH = 'https://github.com/VHemanth45';

// Page sections, in scroll order. Each one is an "epoch" of the training run.
export const EPOCHS = [
    { id: 'work', label: 'Experiments', nav: 'Work' },
    { id: 'about', label: 'Model card', nav: 'About' },
    { id: 'log', label: 'Training log', nav: 'Log' },
    { id: 'writing', label: 'References', nav: 'Writing' },
    { id: 'stack', label: 'requirements.txt', nav: 'Stack' },
    { id: 'contact', label: 'Inference', nav: 'Contact' },
];

export const profile = {
    name: 'Hemanth Vankudoth',
    fullName: 'Hemanth Vankudoth',
    handle: 'vhemanth45',
    role: 'AI / ML Engineer',
    school: "IIT (BHU) Varanasi · '26",
    status: 'Currently a data scientist at PlayVision',
    intro:
        'I build ML systems that hold up outside the notebook: OCR for historical print, adversarial fraud detection, retrieval and ranking, and LLM agents. Baselines first, honest evals, and something you can actually run at the end.',
    email: 'vhemanthnaik45@gmail.com',
    photo: {
        src: `${BASE}img/hemanth.webp`,
        alt: 'Hemanth in a black jacket and sunglasses, standing in snow with a mountain range behind him',
        width: 760,
        height: 1013,
    },
    photoCaption: 'Touching grass. Well, snow.',
    links: {
        github: GH,
        linkedin: 'https://www.linkedin.com/in/hemanth-v-a09526249',
        kaggle: 'https://www.kaggle.com/hemanthvankudoth',
        medium: 'https://medium.com/@vankudoth.hemanth.mec22',
        x: 'https://x.com/VHemanthNaik',
        huggingface: 'https://huggingface.co/Hemanth451',
    },
    writingBlurb:
        'Explainers on sequence models and MLOps on Medium, and hands-on Kaggle notebooks on the tools I reach for with tabular data: gradient boosting, hyperparameter search and explainability.',
    contactBlurb:
        'I’m a data scientist at PlayVision, and always up for a hard problem — a model that has to survive production, an agent that has to stop guessing, or a dataset nobody has made sense of yet. If that sounds like something you’re working on, say hi.',
};

// Handwritten notes on the hero plot, in the chart's 600×440 coordinate space:
// x/y/w place the note, `from` is where its arrow starts, `bend` curves the arrow.
export const journeyNotes = [
    { id: 'init', t: 0, curve: 'train', when: 'Jul 2022', text: 'Init: mechanical engineering, IIT (BHU)', x: 100, y: 0, w: 300, from: [96, 26], bend: -0.35 },
    { id: 'overfit', t: 0.36, curve: 'val', when: '2024', text: 'Overfit to tutorials. Briefly.', x: 272, y: 52, w: 170, from: [268, 80], bend: 0.35 },
    { id: 'writing', t: tOf(2024.72), curve: 'train', when: 'Sep 2024', text: 'Wrote about GRUs, LSTMs & MLOps', x: 116, y: 236, w: 170, from: [262, 232], bend: -0.3 },
    { id: 'job', t: 1, curve: 'train', when: 'Now', text: 'Data scientist at PlayVision', x: 404, y: 136, w: 176, from: [530, 182], bend: -0.25 },
    { id: 'ocr', t: tOf(2026.42), curve: 'train', when: 'Jun 2026', text: 'OCR pipeline: CER 0.355 → 0.072', x: 290, y: 286, w: 180, from: [452, 286], bend: -0.35 },
];

// Where the model runs in production: jobs and internships, newest first.
export const deployments = [
    { org: 'PlayVision', role: 'Data Scientist', when: '2026 — now', status: 'serving' },
    { org: 'BaseRock AI', role: 'Intern', sub: 'Agentic QA & testing', when: '2025', status: 'completed', href: 'https://www.baserock.ai' },
];

// Featured projects, written up as experiments. figure.type: herdr | bars | image | pipeline | echo.
// `herd` is what the agents say when the cursor brings them over a project (optional).
export const experiments = [
    {
        anchor: 'herdr',
        repo: 'VHemanth45/herdr_agents_tracker',
        title: 'Herdr Agents Tracker',
        domain: 'Agent tooling · open source',
        year: '2026',
        summary:
            'A plugin for Herdr, the runtime coding agents live on, that answers what every heavy Claude Code and Codex user wants to know: will I hit my limit before it resets — and which agent is burning through it?',
        spec: [
            ['Problem', 'Usage trackers say “52% used”. That doesn’t tell you whether you’ll make it to the reset, or which of five running agents is eating the window.'],
            ['Approach', 'It asks Claude Code and Codex for their own numbers — no credentials, no prompts, no telemetry — and forecasts from the last hour of work, so a sudden burst shows up at once: “52% (100% in 1h40m)”. Every agent gets a context meter and its share of the limit; alerts fire at 80% and 95%, and again when the limit resets.'],
            ['Engineering', 'Python’s standard library only — zero dependencies. 129 tests in CI on macOS and Ubuntu × Python 3.11–3.14, and a CLI with JSON output and exit codes for scripts.'],
        ],
        stack: ['Python (stdlib only)', 'Herdr plugin', 'Claude Code', 'Codex', 'GitHub Actions'],
        figure: {
            type: 'herdr',
            src: `${BASE}img/herdr.webp`,
            alt: 'Herdr terminal window showing Claude and Codex usage limits with progress bars, token activity and a daily activity heatmap',
            width: 1440,
            height: 850,
        },
        caption: 'Live: the two agents on this page, tracked the way the plugin tracks yours. “Screenshot” is the real thing.',
        links: [
            { label: 'Source', href: `${GH}/herdr_agents_tracker` },
            { label: 'Install', href: `${GH}/herdr_agents_tracker#install` },
        ],
        note: '★ 4 on GitHub · MIT licensed',
        herd: { claude: 'Hey — that’s us!', codex: 'That’s my usage bar.' },
    },
    {
        repo: 'VHemanth45/OCR',
        title: 'RenAIssance OCR',
        domain: 'Document AI',
        year: '2026',
        summary:
            'OCR for historical printed documents — old typefaces, uneven ink and archaic spelling, exactly where off-the-shelf OCR falls apart.',
        spec: [
            ['Problem', 'The Tesseract baseline gets about one character in three wrong (CER 0.355).'],
            ['Approach', 'A fine-tuned YOLOv8n finds the main text block, lines are segmented and aligned to ground truth, then recognisers are compared one rung at a time: Tesseract, fine-tuned TrOCR, a Kraken CRNN — with Gemini 2.5 Flash as a post-correction pass.'],
            ['Result', 'CER 0.355 → 0.072 and WER 0.771 → 0.236 on 296 validation lines: 80% fewer character errors than the baseline.'],
        ],
        stack: ['PyTorch', 'YOLOv8', 'TrOCR', 'Kraken', 'Tesseract', 'Gemini 2.5 Flash'],
        figure: {
            type: 'bars',
            max: 0.8,
            ticks: [0, 0.2, 0.4, 0.6, 0.8],
            groups: [
                { label: 'Tesseract', sub: 'Baseline' },
                { label: 'TrOCR', sub: 'Fine-tuned' },
                { label: 'Kraken', sub: 'CRNN' },
                { label: 'CRNN + LLM', sub: 'Post-correct' },
            ],
            series: [
                { name: 'CER', color: '#1f77b4', values: [0.3553, 0.175, 0.0928, 0.0724] },
                { name: 'WER', color: '#ff7f0e', values: [0.7713, 0.4657, 0.3335, 0.2363] },
            ],
            note: '−80% CER vs. the baseline',
        },
        caption: 'Error rates by pipeline stage, 296 validation lines. Lower is better.',
        links: [{ label: 'Source', href: `${GH}/OCR` }],
        herd: { codex: 'Checking the CER math…' },
    },
    {
        repo: 'VHemanth45/risk_agent',
        title: 'ScamShield',
        domain: 'Multimodal agents',
        year: '2026',
        summary:
            'A multimodal scam detector behind a FastAPI service: send screenshots, voice notes and chat logs, get back a risk score, the evidence behind it, and what to do next.',
        spec: [
            ['Problem', 'Pig-butchering chats, fake exchange dashboards and tech-support calls arrive as images and audio — a text-only filter misses most of them.'],
            ['Approach', 'Screenshots are embedded with CLIP and matched against a labelled “scam genome” in Qdrant, and read with EasyOCR; voice notes go through Whisper. All the evidence is embedded with bge-base and retrieved top-5, alongside a per-user memory, before an LLM returns a strict-JSON verdict.'],
            ['Data', '~800 labelled dialogues, 1,280 rows of a public scam-conversation set, and 119 labelled screenshots across 12 scam and legit categories.'],
        ],
        stack: ['FastAPI', 'Qdrant', 'CLIP', 'bge-base', 'EasyOCR', 'Whisper', 'Gemini / Llama 3.3'],
        figure: {
            type: 'image',
            src: `${BASE}img/risk-agent.webp`,
            alt: 'ScamShield command-line client showing a LOW risk verdict (1%) for a chat log, a table of retrieved evidence with similarity scores, and recommended actions',
            width: 1600,
            height: 836,
        },
        caption: 'A real run: a harmless chat log scores 1% risk, with the retrieved evidence to back it up.',
        links: [{ label: 'Source', href: `${GH}/risk_agent` }],
        note: 'Built with @anjaliii255',
    },
    {
        repo: 'VHemanth45/BestHire',
        title: 'BestHire',
        domain: 'Retrieval & ranking',
        year: '2026',
        summary:
            'A candidate-ranking engine for the Redrob hackathon: it reads a job description, ranks the applicant pool, and catches the fake “honeypot” profiles planted in it.',
        spec: [
            ['Approach', 'Hard gates and honeypot checks first; then section-weighted job-description embeddings (bge-small), a cross-encoder rerank of the top 200, and structured signals — each min-max normalised and blended 35 / 45 / 20.'],
            ['Engineering', 'Fully deterministic — pinned reference date, ID tie-breaks — and ranks offline in under 5 seconds on a CPU.'],
            ['Demo', '200 sample candidates in, 193 through the hard gates, zero honeypots in the top 100.'],
        ],
        stack: ['sentence-transformers', 'bge-small', 'bge-reranker', 'Gradio', 'Hugging Face Spaces'],
        figure: {
            type: 'image',
            src: `${BASE}img/besthire.webp`,
            alt: 'BestHire running on Hugging Face Spaces, with sliders for cross-encoder, semantic and structured weights and buttons to rank a sample or an uploaded file',
            width: 1600,
            height: 656,
        },
        caption: 'Live on Hugging Face Spaces. The three sliders are the three stages.',
        links: [
            { label: 'Live demo', href: 'https://huggingface.co/spaces/Hemanth451/BestHire_Team_Errors' },
            { label: 'Source', href: `${GH}/BestHire` },
        ],
        note: 'Team Errors, with @anjaliii255',
    },
];

// Smaller things that shipped: shown under the experiments.
export const shipped = [
    {
        title: 'Echo',
        kind: 'macOS app',
        year: '2026',
        summary:
            'Select text anywhere, press ⌃⌥E, and Echo rewrites it in your own voice — learned from 3–10 of your writing samples — without changing the facts. Runs on a local Llama 3 via Ollama, or Claude with your own key.',
        facts: ['v1.1.1', 'Swift · no third-party deps', 'AES-GCM profiles, key in Keychain', 'Universal binary via CI'],
        figure: {
            type: 'echo',
            before: 'Hi team, I wanted to let you know that we will be moving the review to next week because we need some more time to get the details right.',
            after: 'Hi team — we’re moving the review to next week so we can get the details right.',
        },
        caption: 'Same facts, fewer words, your tone.',
        links: [
            { label: 'Download', href: `${GH}/Echo/releases/latest` },
            { label: 'Source', href: `${GH}/Echo` },
        ],
    },
];

const TAB10 = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

// Every project, as rows in an experiment tracker.
export const RUN_FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'ml', label: 'ML & eval' },
    { id: 'llm', label: 'LLM & agents' },
    { id: 'apps', label: 'Apps & tools' },
    { id: 'early', label: 'Early epochs' },
];

export const runs = [
    { name: 'herdr_agents_tracker', what: 'AI-subscription limits, burn-rate forecasts and per-agent usage inside Herdr.', method: '★ 4 · zero deps · 129 tests · CI matrix', year: '2026', tags: ['apps'], href: `${GH}/herdr_agents_tracker` },
    { name: 'epoch', what: 'Adaptive fraud-simulation lab for the Mastercard Innovation Challenge (team).', method: 'LightGBM + SHAP · 7 seeds · evasion 0.836 → 0.054', year: '2026', tags: ['ml'], href: 'https://github.com/anjaliii255/Epoch' },
    { name: 'city-memory', what: 'Offline Android map that lights up the places you’ve explored — 31,657 of them in Mumbai.', method: 'Kotlin · Compose · Room · OSM + Overture pipeline · 246 tests', year: '2026', tags: ['apps'], href: `${GH}/Mumbai` },
    { name: 'echo', what: 'macOS menu-bar app that rewrites selected text in your own voice.', method: 'Swift · Ollama / Claude · AES-GCM', year: '2026', tags: ['apps', 'llm'], href: `${GH}/Echo` },
    { name: 'payment_collection_agent', what: 'Conversational agent that verifies identity and takes a payment — without ever double-charging.', method: 'Deterministic first, LLM fallback · 78 tests', year: '2026', tags: ['llm'], href: `${GH}/payment_collection_agent` },
    { name: 'sherlock', what: 'Works out which participant in a live meeting is the candidate — or says it isn’t sure.', method: 'Bayesian signal fusion · Brier 0.037 on 7 synthetic cases', year: '2026', tags: ['ml'], href: `${GH}/Sherlock` },
    { name: 'voice', what: 'Browser voice agent: voice activity → speech-to-text → LLM → speech.', method: 'Pipecat · Silero VAD · faster-whisper · Gemma 3', year: '2026', tags: ['llm'], href: `${GH}/voice` },
    { name: 'besthire', what: 'Ranks candidates against a job description and catches planted fakes.', method: 'bge retrieval → cross-encoder rerank · live on HF', year: '2026', tags: ['ml'], href: `${GH}/BestHire` },
    { name: 'renaissance-ocr', what: 'OCR for historical printed documents.', method: 'YOLOv8 → CRNN → LLM correction · CER 0.072', year: '2026', tags: ['ml'], href: `${GH}/OCR` },
    { name: 'flipkart-demand', what: 'Traffic-demand prediction across geohashed locations.', method: 'LightGBM · geohash target encoding · MLflow · OOF R² 0.949', year: '2026', tags: ['ml'], href: `${GH}/Flipkart` },
    { name: 'scamshield', what: 'Multimodal scam detection over screenshots, voice notes and chats (team).', method: 'CLIP + bge · Qdrant · Whisper · JSON verdict', year: '2026', tags: ['llm'], href: `${GH}/risk_agent` },
    { name: 'spotify-hybrid-recsys', what: 'Hybrid song recommender over 50k tracks and 600 MB of listening history.', method: 'Content + item-item CF · Dask · DVC on S3 · CI', year: '2025', tags: ['ml'], href: `${GH}/Spotify-Hybrid-Recommender-System` },
    { name: 'my_own_webserver', what: 'A WSGI server written from scratch; runs Flask, Django and Pyramid apps.', method: 'Sockets · the WSGI spec', year: '2025', tags: ['apps'], href: `${GH}/My_Own_Webserver` },
    { name: 'drowsiness-alarm', what: 'Webcam drowsiness alarm on a YOLOv5s fine-tuned with 40 hand-labelled frames.', method: 'YOLOv5 · LabelImg · Tkinter', year: '2024', tags: ['early'], href: `${GH}/Drowsiness-Alarm` },
    { name: 'ai-travel-agents', what: 'Three CrewAI agents that pick a city and plan a 7-day trip.', method: 'CrewAI · local Llama 3 via Ollama', year: '2024', tags: ['early'], href: `${GH}/AI_Agents` },
    { name: 'llm-chatbots', what: 'A Code Llama coding assistant, a Gemini image describer and an agri chatbot.', method: 'Ollama · Gradio · Streamlit', year: '2024', tags: ['early'], href: `${GH}/codechatbot` },
    { name: 'credit-risk', what: 'Loan-approval priority (P1–P4) over 42k merged records — a course case study.', method: 'Chi² · VIF · ANOVA · tuned XGBoost', year: '2024', tags: ['early'], href: `${GH}/Credit-risk` },
].map((r, i) => ({ ...r, color: TAB10[i % TAB10.length] }));

export const references = [
    {
        title: 'Bidirectional LSTM RNNs: Learning from the Past and the Future',
        venue: 'Medium',
        date: 'Sep 2024',
        topic: 'Sequence models',
        gist: 'Reading a sequence both ways — and why “Amazon” the river and “Amazon” the website need context from later in the sentence.',
        href: 'https://medium.com/@vankudoth.hemanth.mec22/bidirectional-lstm-rnns-learning-from-the-past-and-the-future-d8fec4b93c32',
    },
    {
        title: 'Unveiling GRUs: Simplifying Deep Learning for Sequential Data',
        venue: 'Medium',
        date: 'Sep 2024',
        topic: 'Sequence models',
        gist: 'The GRU’s reset and update gates, and why it’s the lighter-weight alternative to the LSTM.',
        href: 'https://medium.com/@vankudoth.hemanth.mec22/unveiling-grus-simplifying-deep-learning-for-sequential-data-53778208a579',
    },
    {
        title: 'Demystifying MLOps: A Comprehensive Introduction',
        venue: 'Medium',
        date: 'Feb 2024',
        topic: 'MLOps',
        gist: 'Why most ML projects never reach production, and the lifecycle that gets them there.',
        href: 'https://medium.com/@vankudoth.hemanth.mec22/demystifying-mlops-a-comprehensive-introduction-8cc9a2c4ee11',
    },
    {
        title: 'SHAP Explained: Practical Guide to Explainable AI',
        venue: 'Kaggle',
        topic: 'Explainability',
        gist: 'Reading a model’s predictions feature by feature with Shapley values.',
        href: 'https://www.kaggle.com/code/hemanthvankudoth/shap-explained-practical-guide-to-explainable-ai',
    },
    {
        title: 'Optuna Guide!',
        venue: 'Kaggle',
        topic: 'Hyperparameter search',
        gist: 'Hyperparameter search that learns where to look next.',
        href: 'https://www.kaggle.com/code/hemanthvankudoth/optuna-guide',
    },
    {
        title: 'CatBoost Regression Explained: Step-by-Step Guide',
        venue: 'Kaggle',
        topic: 'Gradient boosting',
        gist: 'Gradient boosting that handles categorical features natively, step by step.',
        href: 'https://www.kaggle.com/code/hemanthvankudoth/catboost-regression-explained-step-by-step-guide',
    },
];

const originalRuns = runs.filter((r) => !r.tags.includes('early')).length;

export const modelCard = {
    id: 'hemanth-vankudoth',
    tags: ['pytorch', 'transformers', 'sentence-transformers', 'lightgbm', 'shap', 'qdrant', 'fastapi', 'ollama', 'dvc', 'swift', 'kotlin', 'status: in-production'],
    bio: [
        'I’m Hemanth — a mechanical engineer by degree (IIT BHU, class of 2026), an ML engineer by choice, and currently a data scientist at PlayVision. Mechanical engineering taught me to think in systems: inputs, constraints, failure modes. Machine learning turned out to be the same game with better tools.',
        'Lately that’s meant OCR that takes character error on historical print from 0.36 to 0.07, retrieval and reranking for hiring, a fraud lab where the detector has to keep up with a red team, agents that only reach for an LLM when the deterministic path runs out — and tooling for the coding agents I work alongside every day.',
        'The part I care about most is evaluation: start from a baseline, hold data out, run more than one seed, and write down what didn’t work. Then ship it as something people can use — an API, a Hugging Face Space, a macOS app.',
    ],
    rows: [
        ['Base model', 'B.Tech, Mechanical Engineering — IIT (BHU) Varanasi, class of 2026'],
        ['Fine-tuned on', 'Document AI & OCR · fraud & risk ML · retrieval & ranking · LLM agents · tabular ML · voice'],
        ['Training data', `${originalRuns} projects since 2025 · ${references.filter((r) => r.venue === 'Medium').length} articles · ${references.filter((r) => r.venue === 'Kaggle').length} Kaggle notebooks · PRs to openml-python`],
        ['Evaluated at', 'Mastercard Innovation Challenge, GFF 2026 (team Epoch) · Redrob hackathon (BestHire) · 3rd place, Statisstella data analytics competition'],
        ['Eval protocol', 'Baselines first · held-out data · more than one seed · negative results reported'],
        ['Also trained on', 'Under Secretary-General (Creative Affairs), IIT-BHU MUN — built the UI for the MUN website'],
        ['Intended use', 'Turning vague problems and messy data into systems people actually use'],
        ['Out of scope', 'Shipping a model nobody evaluated'],
        ['Known limitations', 'Will explain LSTM gates to anyone who stands still long enough'],
    ],
    usage: [
        '>>> from transformers import AutoEngineer',
        '>>> hemanth = AutoEngineer.from_pretrained("vhemanth45/hemanth")',
        '>>> hemanth("We have data. We need decisions.")',
        "'On it. Shipping a baseline first.'",
    ],
};

export const trainingLog = [
    { when: '2022.07', tag: 'init', text: 'Joined IIT (BHU) Varanasi — B.Tech, Mechanical Engineering.' },
    { when: '2023.09', tag: 'lead', text: 'Under Secretary-General (Creative Affairs), IIT-BHU MUN.', detail: 'Built the UI for the MUN website.' },
    { when: '2024.02', tag: 'write', text: 'First article: “Demystifying MLOps”.' },
    { when: '2024.03', tag: 'ship', text: 'First LLM apps on Code Llama and Gemini; a YOLOv5 drowsiness alarm; CrewAI travel agents.', detail: 'The tutorial era — see the bump in Fig. 1.' },
    { when: '2024.09', tag: 'write', text: 'A Medium series on GRUs, LSTMs and bidirectional RNNs.' },
    { when: '2025', tag: 'intern', text: 'Internship at BaseRock AI — agentic QA & testing.' },
    { when: '2025.06', tag: 'ship', text: 'Wrote a WSGI web server from scratch that runs Flask, Django and Pyramid apps.' },
    { when: '2025.09', tag: 'ship', text: 'Spotify hybrid recommender, with data versioned in DVC on S3 and tests in CI.' },
    { when: '2026.01', tag: 'ship', text: 'ScamShield — multimodal scam detection, built with a teammate.' },
    { when: '2026.02', tag: 'oss', text: 'openml-python #1690: moved server-dependent flow tests to offline mocks.', detail: '+619 / −309 across 13 files · in review' },
    { when: '2026.06', tag: 'eval', text: 'RenAIssance OCR: CER 0.355 → 0.072 on 296 validation lines.' },
    { when: '2026.07', tag: 'ship', text: 'BestHire (Redrob hackathon), Sherlock, a payment-collection agent and a voice-agent loop.' },
    { when: '2026.08', tag: 'eval', text: 'Epoch for the Mastercard Innovation Challenge: evasion 0.836 → 0.054 on all 7 seeds.' },
    { when: '2026.08', tag: 'ship', text: 'Echo v1.1.1 for macOS; City Memory for Android.' },
    { when: '2026.09', tag: 'ship', text: 'herdr_agents_tracker — ★ 4, 129 tests, zero dependencies.' },
    { when: '2026', tag: 'ckpt', text: 'Class of 2026. Checkpoint saved.' },
    { when: 'now', tag: 'deploy', text: 'Data Scientist at PlayVision.', detail: 'Serving in production.' },
];

export const requirements = {
    blurb: 'Breadth is easy to list. This is what my projects actually import, grouped the way a real repo pulls it in.',
    lines: [
        { comment: 'Python 3.11+ · also Swift, Kotlin and SQL' },
        {},
        { comment: 'Modeling' },
        { pkg: 'torch', note: 'Daily driver' },
        { pkg: 'transformers' },
        { pkg: 'sentence-transformers' },
        { pkg: 'scikit-learn' },
        { pkg: 'lightgbm', note: 'Tabular data will never die' },
        { pkg: 'xgboost' },
        { pkg: 'shap' },
        { pkg: 'optuna' },
        {},
        { comment: 'LLMs, agents & retrieval' },
        { pkg: 'ollama' },
        { pkg: 'anthropic' },
        { pkg: 'google-genai' },
        { pkg: 'groq' },
        { pkg: 'crewai' },
        { pkg: 'qdrant-client', note: 'Where the scam genome lives' },
        {},
        { comment: 'Vision, OCR & speech' },
        { pkg: 'ultralytics' },
        { pkg: 'easyocr' },
        { pkg: 'kraken' },
        { pkg: 'faster-whisper' },
        { pkg: 'pipecat-ai' },
        {},
        { comment: 'Data, serving & MLOps' },
        { pkg: 'pandas' },
        { pkg: 'dask' },
        { pkg: 'fastapi', note: 'Everything ends up behind an API' },
        { pkg: 'gradio' },
        { pkg: 'streamlit' },
        { pkg: 'dvc' },
        { pkg: 'mlflow' },
    ],
    infra: ['Docker', 'GitHub Actions', 'AWS S3', 'uv', 'Git', 'Hugging Face Spaces'],
};
