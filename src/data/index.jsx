import { FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaKaggle } from "react-icons/fa";
import { SiTensorflow, SiPytorch, SiPython, SiCplusplus, SiPostgresql, SiReact, SiAwslambda, SiDocker, SiDvc, SiScikitlearn, SiHuggingface, SiLangchain } from "react-icons/si";

export const heroData = {
    name: "Hemanth",
    title: "Data Scientist & AI Engineer",
    subtitle: "Transforming data into actionable insights using deep learning and AI.",
    description: "Mechanical Engineering student at IIT (BHU) with a passion for building AI-driven solutions.",
};

export const aboutData = {
    title: "About Me",
    image: import.meta.env.BASE_URL + "images/dp.jpg",
    shortIntro: "Hi, I'm Hemanth, a Data Scientist with expertise in AI/ML, skilled in building and deploying models.",
    longDescription: [
        "I am Hemanth Vankudoth, a passionate and driven Mechanical Engineering student at IIT (BHU), Varanasi, with a keen interest in Artificial Intelligence and Machine Learning.",
        "With a strong foundation in programming languages like Python, C++, SQL, and Golang, I have developed various projects focusing on AI-driven solutions, including travel agent bots, drowsiness detection systems, and chatbots for multiple applications.",
        "I specialize in leveraging deep learning, natural language processing, and machine learning algorithms to create innovative solutions. My projects demonstrate a hands-on approach to solving real-world problems."
    ],
    resumeLink: "https://drive.google.com/file/d/1A7iIsE8jV6_bbWntBlrQ5CpoDfZV6Ow2/view?usp=sharing",
    kaggleLink: "https://www.kaggle.com/hemanthvankudoth" // Placeholder, user mentioned button to redirect to Kaggle
};

export const techStack = [
    { name: "Python", icon: SiPython },
    { name: "C++", icon: SiCplusplus },
    { name: "TensorFlow", icon: SiTensorflow },
    { name: "PyTorch", icon: SiPytorch },
    { name: "Scikit-Learn", icon: SiScikitlearn },
    { name: "Hugging Face", icon: SiHuggingface },
    { name: "LangChain", icon: SiLangchain },
    { name: "DVC", icon: SiDvc },
    { name: "PostgreSQL", icon: SiPostgresql },
    { name: "React", icon: SiReact },
    { name: "AWS", icon: SiAwslambda },
    { name: "Docker", icon: SiDocker }
];

export const projectsData = [
    {
        title: "Risk Agent",
        image: import.meta.env.BASE_URL + "images/risk_Agent.png",
        link: "https://github.com/VHemanth45/risk_agent",
        description: "An AI agent designed for risk analysis and assessment."
    },
    {
        title: "Spotify Hybrid Recommender",
        image: import.meta.env.BASE_URL + "images/Rename.png",
        link: "https://github.com/VHemanth45/Spotify-Hybrid-Recommender-System",
        description: "Hybrid recommender system combining content-based filtering and collaborative filtering for personalized song recommendations."
    },
    {
        title: "Coding Challenge Generator",
        image: import.meta.env.BASE_URL + "images/ccg.png",
        link: "https://github.com/VHemanth45/Coding_Challenge_Generator",
        description: "A tool to automatically generate coding challenges and problem statements."
    },
    {
        title: "Real-Estate X",
        image: import.meta.env.BASE_URL + "images/RealEstateX.jpg",
        link: "https://github.com/VHemanth45/RealEstateX",
        description: "Property search platform for Gurgaon with recommender system using TFIDF/Cosine Similarity, price prediction, and analytics."
    },
    {
        title: "AI-Travel Agent",
        image: import.meta.env.BASE_URL + "images/AIAgents.webp",
        link: "https://github.com/VHemanth45/AI_Agents",
        description: "Expert Travel Agent and City Selection Agent using Llama3. RAG-based AI Agent for contextually relevant answers."
    },
    {
        title: "Drowsiness Detection",
        image: import.meta.env.BASE_URL + "images/drowsiness.jpg",
        link: "https://github.com/VHemanth45/Drowsiness-Alarm",
        description: "Real-time drowsiness detection using fine-tuned YOLOv5. Annotated images with labelImg and integrated alarm system."
    },
    {
        title: "LLM Chatbots",
        image: import.meta.env.BASE_URL + "images/chatbots.jpg",
        link: "https://github.com/VHemanth45/codechatbot",
        description: "Code-Chatbot using Codellama, Image Describer using Gemini API, and Agri-chatbot. Built with Gradio interfaces."
    },
    {
        title: "Credit Card Fraud Detection",
        image: import.meta.env.BASE_URL + "images/ccfd-scaled.jpeg",
        link: "https://github.com/VHemanth45/Credit-risk",
        description: "Credit risk model to assess borrowers' creditworthiness using internal product and bureau datasets."
    }
];

export const blogsData = [
    {
        title: "Demystifying MLOps",
        image: import.meta.env.BASE_URL + "images/MLOps.png",
        link: "https://medium.com/@vankudoth.hemanth.mec22/demystifying-mlops-a-comprehensive-introduction-8cc9a2c4ee11",
        excerpt: "Unraveling the complexities surrounding MLOps — Machine Learning Operations."
    },
    {
        title: "Understanding LSTM Networks",
        image: import.meta.env.BASE_URL + "images/LSTM.png",
        link: "https://medium.com/@vankudoth.hemanth.mec22/understanding-lstm-networks-a-beginners-guide-to-sequence-modeling-167c237b3c1f",
        excerpt: "A beginner's guide to sequence modeling and solving RNN problems."
    },
    {
        title: "Unveiling GRUs",
        image: import.meta.env.BASE_URL + "images/Screenshot 2024-09-22 183954.png",
        link: "https://medium.com/@vankudoth.hemanth.mec22/unveiling-grus-simplifying-deep-learning-for-sequential-data-53778208a579",
        excerpt: "Simplifying Deep Learning for Sequential Data with Gated Recurrent Units."
    },
    {
        title: "Bidirectional LSTM RNNs",
        image: import.meta.env.BASE_URL + "images/Bidirec.jpg",
        link: "https://medium.com/@vankudoth.hemanth.mec22/bidirectional-lstm-rnns-learning-from-the-past-and-the-future-d8fec4b93c32",
        excerpt: "Learning from the Past and the Future using Bidirectional LSTMs."
    }
];

export const kaggleNotebooks = [
    {
        title: "CatBoost Regression Explained: Step-by-Step Guide",
        link: "https://www.kaggle.com/code/hemanthvankudoth/catboost-regression-explained-step-by-step-guide", // Placeholder
        description: "A step-by-step guide to understanding CatBoost Regression."
    },
    {
        title: "Optuna Guide!",
        link: "https://www.kaggle.com/code/hemanthvankudoth/optuna-guide", // Placeholder
        description: "A step-by-step guide to understanding Optuna."
    },
    {
        title: "SHAP Explained: Practical Guide to Explainable AI!",
        link: "https://www.kaggle.com/code/hemanthvankudoth/shap-explained-practical-guide-to-explainable-ai", // Placeholder
        description: "A practical guide to understanding SHAP."
    },
    // Add more placeholders or real ones if I knew them, user just asked for a section "to view My Kaggle Notebooks", maybe I can ask or just put placeholders.
];


export const socialLinks = [
    { icon: FaTwitter, link: "https://x.com/VHemanthNaik", label: "X" },
    { icon: FaInstagram, link: "https://www.instagram.com/v_hemanth_45/", label: "Instagram" },
    { icon: FaLinkedin, link: "https://www.linkedin.com/in/hemanth-v-a09526249", label: "LinkedIn" },
    { icon: FaGithub, link: "https://github.com/VHemanth45", label: "GitHub" },
    { icon: FaKaggle, link: "https://www.kaggle.com/hemanthvankudoth", label: "Kaggle" }
];
