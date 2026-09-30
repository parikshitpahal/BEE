import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Knowledge base for realistic campus career advice
const careerResponses = [
  {
    keywords: ['resume', 'cv', 'ats', 'bullet point'],
    reply: `Here are 4 high-impact recommendations to elevate your technical resume:
1. **XYZ Formula**: Frame bullet points as "Accomplished [X] as measured by [Y], by doing [Z]" (e.g., 'Reduced API latency by 42% by introducing Redis caching layers').
2. **Quantify Results**: Highlight metrics like throughput, active users, code coverage, or build-time reductions.
3. **Keyword Density**: Ensure keywords match target job descriptions (e.g., 'Docker', 'REST API', 'PostgreSQL', 'Microservices').
4. **Single-Page Simplicity**: Keep resume cleanly aligned with zero double-columns if applying through standard ATS portals.`,
  },
  {
    keywords: ['interview', 'rounds', 'dsa', 'system design', 'behavioral'],
    reply: `Campus Technical Interview Strategy:
- **Round 1 (Online Assessment)**: Practice 2 Medium LeetCode problems daily focusing on HashMaps, Two-Pointers, BFS/DFS, and Dynamic Programming.
- **Round 2 (Technical Discussion)**: Never jump into code immediately. Ask clarifying questions on edge cases, state your time/space complexity upfront, and write clean variable names.
- **Round 3 (Managerial & Core CS)**: Revise DBMS (Indexing, Normalization, ACID), OS (Threads vs Processes, Deadlocks, Paging), and Computer Networks (TCP 3-way handshake, DNS).`,
  },
  {
    keywords: ['referral', 'alumni', 'message', 'reach out', 'cold message'],
    reply: `Proven Alumni Outreach Template:
"Hi [Alumni Name], hope you're having a great week! I'm a final-year CS student at [College]. I recently came across the [Role Title] opening at [Company] (Req ID: #XXXX). Having built production-grade fullstack apps using Node.js & React, I'd deeply appreciate your referral or any advice on the team's engineering bar. My resume is attached for quick review. Thank you for your time!"`,
  },
];

// @desc AI Career Assistant conversation endpoint
// @route POST /api/ai/chat
router.post('/chat', protect, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const lower = message.toLowerCase();
    let reply = null;

    for (const item of careerResponses) {
      if (item.keywords.some((kw) => lower.includes(kw))) {
        reply = item.reply;
        break;
      }
    }

    if (!reply) {
      reply = `Thanks for asking! For a student targeting campus placements in 2026:
- Focus on building 2 standout full-stack or systems projects rather than 10 tutorial clones.
- Maintain a consistent GitHub contribution graph and publish short architectural write-ups on LinkedIn.
- Target a minimum of 150+ solved LeetCode problems spanning Trees, Graphs, and DP.
- Leverage the HireConnect Alumni tab to connect with seniors already working at your dream companies for mock interviews and internal referrals!`;
    }

    res.json({
      success: true,
      data: {
        reply,
        timestamp: new Date(),
        suggestions: [
          'Review my resume bullet points',
          'How do I prepare for SDE-1 System Design?',
          'What questions to ask the interviewer at the end?',
          'How to draft an effective alumni referral note?',
        ],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
