
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import fs from 'fs';
import stringSimilarity from 'string-similarity';
import mongoose from 'mongoose';

dotenv.config();

import { connectDB } from './config/db.js';
import { logger } from './config/logger.js';
import hubRoutes from './routes/hubRoutes.js';
import fundingRoutes from './routes/fundingRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import userRoutes from './routes/userRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import seed from './scripts/seed.js';
import logRoutes from './routes/logRoutes.js';
import feedbackRoutes from './routes/feedback.js';
import newsRoutes from './routes/news.js';
import authRoutes from './routes/auth.js';
import Hub from './models/Hub.js'; 

const app = express();
const __dirname = path.resolve();

// ===== Middleware =====
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));

// ===== Static Uploads =====
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== API Routes =====
app.get('/', (_, res) => res.json({ status: 'DHMS API running' }));
app.use('/api/hubs', hubRoutes);
app.use('/api/funding', fundingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);

// ===== Error Handling =====
app.use(notFound);
app.use(errorHandler);

// ===== HTTP + Socket.IO =====
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// ===== Load Chatbot FAQ =====
let faqData = [];
try {
  faqData = JSON.parse(fs.readFileSync('./data/chatbotData.json', 'utf-8'));
  logger.info(`Loaded ${faqData.length} chatbot FAQ entries`);
} catch (err) {
  logger.error('Failed to load chatbotData.json. Make sure the file exists.', err);
}

// --- 📚 Extended FAQ Data (Merged, not redeclared) ---
const extendedFaqData = [
  {
    "keywords": ["digital hub", "digital hubs", "hubs", "digital"],
    "response": "A Digital Hub is a community center equipped with internet, computers, and digital tools to empower citizens with ICT skills, innovation, and e-services."
  },
  {
    "keywords": ["number of hubs", "how many hubs", "hubs exist"],
    "response": "Currently, Kenya has 47+ Digital Hubs, with a target of 1,450 hubs across all wards to improve digital access and literacy."
  },
  {
    "keywords": ["ajira", "ajira digital program"],
    "response": "Ajira Digital empowers young people with digital skills to earn from online work opportunities."
  },
  {
    "keywords": ["jitume", "jitume program"],
    "response": "Jitume provides youth with access to devices, digital skills, and online jobs through Digital Hubs and TVET institutions."
  },
  {
    "keywords": ["konza", "konza city", "konza technopolis"],
    "response": "Konza Technopolis is Kenya’s smart city and innovation hub, part of Vision 2030."
  },
  {
    "keywords": ["huduma", "huduma centre", "huduma center"],
    "response": "Huduma Centres are one-stop shops for multiple government services such as IDs, NHIF, NSSF, and birth certificates."
  },
  {
    "keywords": ["services offered", "hub services"],
    "response": "Hubs provide internet access, ICT training, entrepreneurship support, government e-services, and digital literacy programs."
  },
  {
    "keywords": ["ministry of ict", "who manages hubs", "ict ministry"],
    "response": "The Ministry of ICT & Digital Economy manages the hubs in collaboration with counties and partners."
  },
  {
    "keywords": ["e-citizen", "ecitizen"],
    "response": "E-Citizen is a platform to access 5,000+ government services online such as IDs, passports, and business registration."
  },
  {
    "keywords": ["funding opportunities", "hub funding", "how to get funding"],
    "response": "Hubs and innovators can access funding through government grants, county initiatives, and private sector partnerships."
  },
  {
    "keywords": ["training programs", "digital skills", "courses"],
    "response": "Digital Hubs offer courses on ICT skills, entrepreneurship, freelancing, coding, and online safety."
  },
  {
    "keywords": ["digital skills in demand", "which digital skills are most in demand today"],
    "response": "Digital skills most in demand today include AI, cybersecurity, data analytics, cloud computing, and digital marketing."
  },
  {
    "keywords": ["government support for digital skills", "what kind of digital skills does the government support"],
    "response": "The government supports digital literacy to advanced ICT training to foster a skilled digital workforce."
  },
  {
    "keywords": ["advanced ict training", "can i get advanced ict training"],
    "response": "Yes, many digital hubs offer advanced training programs in areas like AI, coding, cybersecurity, and data science."
  },
  {
    "keywords": ["curriculum", "is there a curriculum for each program"],
    "response": "Yes, training programs at digital hubs follow structured curricula for effective learning outcomes."
  },
  {
    "keywords": ["mentorship or incubation", "do you offer mentorship or incubation after training"],
    "response": "Many digital hubs offer mentorship and incubation programs for promising startups and individuals."
  },
  {
    "keywords": ["online classes", "can i take online classes through the hub"],
    "response": "Some digital hubs provide access to online learning platforms and their own online courses."
  },
  {
    "keywords": ["women-focused programs", "are there women-focused programs at the hubs"],
    "response": "Yes, many hubs have women-focused programs promoting digital skills, entrepreneurship, and leadership."
  },
  {
    "keywords": ["youth empowerment program", "is there a youth empowerment program through the hubs"],
    "response": "Youth empowerment is a core focus of digital hubs, equipping young people with essential digital skills."
  },
  {
    "keywords": ["training for people with disabilities", "do you support training for people with disabilities"],
    "response": "Hubs strive to be inclusive, providing accessible digital training and assistive technology support."
  },
  {
    "keywords": ["rural or remote communities", "are there any programs for rural or remote communities"],
    "response": "The Digital Hub initiative focuses on underserved rural and remote communities across Kenya."
  },
  {
    "keywords": ["register business", "can i register my business at the hub"],
    "response": "Hubs assist in the online business registration process using eCitizen."
  },
  {
    "keywords": ["business development support", "can i access business development support here"],
    "response": "Yes, many hubs offer mentorship, workshops, and financial literacy programs for entrepreneurs."
  },
  {
    "keywords": ["shared working spaces or innovation labs", "are there shared working spaces or innovation labs"],
    "response": "Yes, hubs feature co-working and innovation spaces for collaboration and creativity."
  },
  {
    "keywords": ["work at a digital hub", "apply to work at a digital hub"],
    "response": "Job openings at digital hubs are announced on official government and Ministry websites."
  },
  {
    "keywords": ["volunteer to teach", "volunteer at a hub"],
    "response": "Yes, hubs welcome volunteers to train and mentor participants. Contact your nearest hub."
  }
];

// ✅ Merge both FAQ datasets
faqData = [...faqData, ...extendedFaqData];



// ===== SOCKET.IO CHATBOT =====
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on('chat message', async (msg) => {
  logger.info(`User asked: ${msg}`);
  const lowerMsg = msg.toLowerCase();
  let response = null;

  try {
    // --- 1️⃣ Greetings & Common Phrases ---
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      response = 'Hi there!  How can I assist you today about Digital Hubs or ICT programs?';
    } else if (lowerMsg.includes('thank')) {
      response = "You're most welcome!  Always here to help.";
    } else if (lowerMsg.includes('bye')) {
      response = 'Goodbye!  Keep exploring digital skills and innovation.';
    }

    // --- 2️⃣ Identity / Ministry Info ---
    else if (lowerMsg.includes('who are you') || lowerMsg.includes('what are you')) {
      response = "I'm your Digital Assistant — here to help you learn about Kenya’s Digital Hubs, programs, and digital skills opportunities.";
    } else if (lowerMsg.includes('ministry')) {
      response =
        'The Ministry of ICT & Digital Economy oversees the Digital Hubs initiative, promoting innovation, digital inclusion, and ICT literacy across Kenya.';
    }

    // --- 3️⃣ Show All or Nearby Hubs ---
else if (
  lowerMsg.includes('hub location') ||
  lowerMsg.includes('list hubs') ||
  lowerMsg.includes('where are hubs') ||
  lowerMsg.includes('digital hub near me') ||
  lowerMsg.includes('show hubs') ||
  lowerMsg.includes('available hubs')
) {
  const hubs = await Hub.find().limit(10); // show up to 10 hubs
  if (hubs.length > 0) {
    response = "📍 *Here are some Digital Hubs across Kenya:*\n\n";

    hubs.forEach((h, index) => {
      const [lat, lon] = h.location?.coordinates || [0, 0];
      response += `🔹 *${index + 1}. ${h.name}* (${h.type || 'General'})\n`;
      response += `    County: ${h.county || 'Unknown'}\n`;
      response += `    Constituency: ${h.constituency || 'Unknown'}\n`;
      response += `    Trained: ${h.populationEnrolled?.toLocaleString() || 0}\n`;
      response += `    Location: (${lat.toFixed(3)}, ${lon.toFixed(3)})\n\n\n`;
    });

    response += "Tip: Ask me 'hubs in Nakuru' or 'hubs in Turkana' to see specific counties.";
  } else {
    response = " No hub data found in the database yet. Try seeding your hubs collection.";
  }
}

    // --- 4️⃣ Hubs by County ---
    else if (lowerMsg.includes('hub in') || lowerMsg.includes('hubs in')) {
      const region = lowerMsg.split('in ')[1]?.trim();
      if (region) {
        const hubs = await Hub.find({
          $or: [
            { county: new RegExp(region, 'i') },
            { constituency: new RegExp(region, 'i') },
            { ward: new RegExp(region, 'i') },
          ],
        });

        if (hubs.length > 0) {
          response =
            `Here are some hubs in *${region}*:\n\n` +
            hubs
              .map((h) => {
                const [lat, lon] = h.location?.coordinates || [0, 0];
                return `📍 ${h.name} — ${h.constituency || 'Unknown Constituency'}\n👥 Trained: ${h.populationEnrolled?.toLocaleString() || 0}\n🌍 (${lat.toFixed(3)}, ${lon.toFixed(3)})`;
              })
              .join('\n\n');
        } else {
          response = `No hubs found in ${region} yet.`;
        }
      } else {
        response = "Please specify a county or region, e.g. 'Show hubs in Nakuru'.";
      }
    }

    // --- 5️⃣ Total People Trained (All Hubs) ---
    else if (
      lowerMsg.includes('total people trained') ||
      lowerMsg.includes('how many people trained') ||
      lowerMsg.includes('number trained') ||
      lowerMsg.includes('p trained') ||
      lowerMsg.includes('people trained in kenya')
    ) {
      try {
        const allHubs = await Hub.find();
        const total = allHubs.reduce((sum, h) => sum + (h.populationEnrolled || 0), 0);
        response = ` A total of *${total.toLocaleString()}* people have been trained across all registered hubs in Kenya.`;
      } catch (err) {
        logger.error('Error fetching total trained count:', err);
        response = "Sorry, I couldn’t fetch the total trained count at the moment.";
      }
    }

    // --- 6️⃣ People Trained by Region (County, Ward, or Constituency) ---
    else if (
      lowerMsg.includes('trained in') ||
      lowerMsg.includes('people trained in') ||
      lowerMsg.includes('trainees in') ||
      lowerMsg.includes('how many trained in')
    ) {
      const region = lowerMsg.split('in ')[1]?.trim();
      if (region) {
        const hubs = await Hub.find({
          $or: [
            { county: new RegExp(region, 'i') },
            { constituency: new RegExp(region, 'i') },
            { ward: new RegExp(region, 'i') },
          ],
        });

        if (hubs.length > 0) {
          const total = hubs.reduce((sum, h) => sum + (h.populationEnrolled || 0), 0);
          response =
            ` In *${region}*, approximately *${total.toLocaleString()}* people have been trained through these hubs:\n\n` +
            hubs
              .map((h) => ` ${h.name} — ${h.populationEnrolled?.toLocaleString() || 0} trained`)
              .join('\n');
        } else {
          response = `No training data found for ${region}.`;
        }
      } else {
        response = "Please specify a region, e.g. 'How many trained in Bungoma?' or 'People trained in Nakuru West'.";
      }
    }

    // --- 7️⃣ AI & Digital Skills Context ---
    else if (lowerMsg.includes('skills') && lowerMsg.includes('ai')) {
      response = 'AI-related skills include machine learning, data analysis, and automation — all increasingly supported by digital hubs.';
    }

    // --- 8️⃣ Fuzzy Matching Fallback ---
    if (!response) {
      let bestMatch = { similarity: 0, response: null };
      for (const entry of faqData) {
        for (const keyword of entry.keywords) {
          const similarity = stringSimilarity.compareTwoStrings(lowerMsg, keyword.toLowerCase());
          if (similarity > bestMatch.similarity) {
            bestMatch = { similarity, response: entry.response };
          }
        }
      }

      if (bestMatch.response) {
        response =
          bestMatch.similarity >= 0.5
            ? bestMatch.response
            : `${bestMatch.response} (Best guess — try rephrasing for better accuracy.)`;
      } else {
        response =
          " I'm not sure about that yet. You can ask about hub locations, total trainees, digital skills, or AI-related programs.";
      }
    }
  } catch (err) {
    logger.error('Chatbot error:', err);
    response = ' Sorry, something went wrong while fetching information. Please try again later.';
  }

  socket.emit('bot reply', response);
});


  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// ===== Server Start =====
const PORT = process.env.PORT || 5000;
connectDB()
  .then(async () => {
    await seed();
    server.listen(PORT, () => {
      logger.info(`Server + Chatbot running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to start server', err);
    process.exit(1);
  });
