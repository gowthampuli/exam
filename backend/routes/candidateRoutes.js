// backend/routes/candidateRoutes.js
const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// Question sets (15 questions per set)
const questionSets = {
  set1: [
    {
      question: "Arrange the words into make a meaningful sentence: 1. I 2. help 3. not 4. you 5. did",
      options: ["24351", "15324", "45231", "43152"],
      correctAnswer: "15324"
    },
    {
      question: "Rahul put his timepiece on the table in such a way that at 6 P.M. hour hand points to North. In which direction the minute hand will point at 9.15 P.M?",
      options: ["East", "West", "North", "South"],
      correctAnswer: "West"
    },
    {
      question: 'Pointing to a photograph Lata says, "He is the son of the only son of my grandfather." How is the man in the photograph related to Lata?',
      options: ["Brother", "Cousin", "Uncle", "None"],
      correctAnswer: "Brother"
    },
    {
      question: "Which word does NOT belong with the others?",
      options: ["Tape", "Twine", "Cord", "Yarn"],
      correctAnswer: "Tape"
    },
    {
      question: "11, 13, 17, 19, 23, 29, 31, 37, 41, (....)",
      options: ["43", "47", "53", "51"],
      correctAnswer: "43"
    },
    {
      question: "Correct the sentence: You need not come unless you want to",
      options: [ "You don't need to come unless you want to", "You come only when you want to", "You come unless you don't want to", "You needn't come until you don't want to" ],
      correctAnswer: "You don't need to come unless you want to"
    },
    {
      question: "Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?",
      options: ["7", "10", "12", "13"],
      correctAnswer: "10"
    },
    {
      question: "In the following the questions choose the word which best expresses the meaning of the given word. - ALERT",
      options: ["Energetic", "Observant", "Intelligent", "Watchful"],
      correctAnswer: "Watchful"
    },
    {
      question: "She baffled all our attempts to find her. Find the Synonym?",
      options: ["Defeated", "Thwarted", "Foiled", "Circumvented"],
      correctAnswer: "Foiled"
    },
    {
      question: "The study of ancient societies",
      options: ["Anthropology", "Archaeology", "History", "Ethnology"],
      correctAnswer: "Archaeology"
    },
    {
      question: "A person of good understanding knowledge and reasoning power",
      options: ["Expert", "Snob", "Literate", "Intellectual"],
      correctAnswer: "Intellectual"
    },
    {
      question: "You ______ the cleaning. I would have done it tonight?",
      options: ["Needn't have done", "Couldn't have done", "Can't have done", "Wouldn't have done"],
      correctAnswer: "Needn't have done"
    },
    {
      question: "THRUST: SPEAR (Select the pair which has the same relationship).",
      options: ["Mangle: Iron", "Scabbard: Sword", "Bow: Arrow", "Fence: Epee"],
      correctAnswer: "Fence: Epee"
    },
    {
      question: "The sum of ages of 5 children born at the intervals of 3 years each is 50 years. What is the age of the youngest child?",
      options: ["4 years", "8 years", "10 years", "5 years"],
      correctAnswer: "4 years"
    },
    {
      question: "One evening before sunset Rekha and Hema were talking to each other face to face. If Hema's shadow was exactly to the right of Hema, which direction was Rekha facing?",
      options: ["East", "West", "North", "South"],
      correctAnswer: "South"
    }
  ],
  set2: [
    {
      question: "I read an advertisement that said\nP: posh, air-conditioned\nQ: gentleman of taste\nR: are available for\nS: fully furnished rooms\n\nThe Proper sequence should be:",
      options: ["PQRS", "PSRQ", "PSQR", "SRPQ"],
      correctAnswer: "PSRQ"
    },
    {
      question: "3, 5, 11, 14, 17, 21 Odd men out?",
      options: ["21", "17", "14", "3"],
      correctAnswer: "14"
    },
    {
      question: "Which word does NOT belong with the others?",
      options: ["Parsley", "Basil", "Dill", "Mayonnaise"],
      correctAnswer: "Mayonnaise"
    },
    {
      question: "ELFA, GLHA, ILJA, _____, MLNA",
      options: ["OLPA", "KLMA", "LLMA", "KLLA"],
      correctAnswer: "KLLA"
    },
    {
      question: "Which word does NOT belong with the others?",
      options: ["Dodge", "Flee", "Duck", "Avoid"],
      correctAnswer: "Flee"
    },
    {
      question: "Which word does NOT belong with the others?",
      options: ["Leopard", "Cougar", "Elephant", "Lion"],
      correctAnswer: "Cougar"
    },
    {
      question: "Antonyms of COMMISSIONED",
      options: ["Started", "Closed", "Finished", "Terminated"],
      correctAnswer: "Terminated"
    },
    {
      question: "Verbal Analogies of GRAIN:SALT",
      options: ["Shard:Pottery", "Shred:Wood", "Blades:Grass", "Chip:Glass"],
      correctAnswer: "Chip:Glass"
    },
    {
      question: "In a family, there are husband-wife, two sons and two daughters. All the ladies were invited to a dinner. Both sons went out to play. Husband did not return from the office. Who was at home?",
      options: ["Only wife was at home", "Nobody was at home", "Only sons were at home", "All ladies were at home"],
      correctAnswer: "Nobody was at home"
    },
    {
      question: "If in a certain language, MADRAS is coded as NBESBT, how is BOMBAY coded in that code?",
      options: ["CPNCBX", "CPNCBZ", "CPOCBZ", "CQOCBZ"],
      correctAnswer: "CPNCBZ"
    },
    {
      question: "Extend (Opposite word)",
      options: ["Condense", "Expand", "Congestion", "Convert"],
      correctAnswer: "Condense"
    },
    {
      question: "If South-East becomes North, North-East becomes West and so on. What will West become?",
      options: ["North-East", "North-West", "South-East", "South-West"],
      correctAnswer: "South-East"
    },
    {
      question: "Antonyms of EXODUS",
      options: ["Influx", "Home-coming", "Return", "Restoration"],
      correctAnswer: "Restoration"
    },
    {
      question: "Look at this series: 14, 28, 20, 40, 32, 64, ... What number should come next?",
      options: ["52", "56", "96", "60"],
      correctAnswer: "56"
    },
    {
      question: "2, 6, 12, 20, 30, 42, 56, ___",
      options: ["100", "72", "80", "70"],
      correctAnswer: "72"
    }
  ]
};

// Registration route: Check candidate by email or PAN
router.post('/register', async (req, res) => {
  const { name, email, phone, pan } = req.body;
  try {
    // Check if candidate exists by email or PAN
    let candidate = await Candidate.findOne({ $or: [{ email }, { pan }] });
    if (candidate) {
      // Block reattempt if test already completed
      if (candidate.completed) {
        return res.status(400).json({ message: "Candidate has already taken the test." });
      }
      return res.status(200).json({ message: "Candidate already registered", candidate });
    }
    // Randomly assign a test set
    const testSet = Math.random() < 0.5 ? 'set1' : 'set2';
    candidate = new Candidate({ name, email, phone, pan, testSet });
    await candidate.save();
    res.status(201).json({ message: "Candidate registered", candidate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch questions for candidate based on their test set
router.get('/questions/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    // Prevent fetching questions if test is already completed
    if (candidate.completed) {
      return res.status(400).json({ message: "Test already attempted" });
    }
    res.status(200).json({ questions: questionSets[candidate.testSet] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit test answers, calculate score, update status, and mark as completed
router.post('/submit', async (req, res) => {
  const { email, answers } = req.body;
  try {
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    const questions = questionSets[candidate.testSet];
    let score = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) score++;
    });
    candidate.testScore = score;
    // Use cutoff mark of 7
    candidate.status = score >= 7 ? 'selected' : 'rejected';
    candidate.completed = true;
    await candidate.save();
    res.status(200).json({ message: "Test submitted", score, status: candidate.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all candidate data (with optional search by PAN, name, or phone)
router.get('/', async (req, res) => {
  const { search } = req.query;
  try {
    let query = {};
    if (search) {
      query = {
        $or: [
          { pan: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const candidates = await Candidate.find(query).sort({ createdAt: -1 });
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bulk delete all candidate records
router.delete('/', async (req, res) => {
  try {
    await Candidate.deleteMany({});
    res.status(200).json({ message: "All candidates deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an individual candidate by ID
router.delete('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json({ message: "Candidate deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
