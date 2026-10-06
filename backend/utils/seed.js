// Seeds the very first admin account and a few sample categories/articles.
// Run once with: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Article = require('../models/Article');

const run = async () => {
  await connectDB();

  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@inkora.com').toLowerCase();
  let admin = await User.findOne({ email: adminEmail });

  if (!admin) {
    admin = await User.create({
      name: process.env.SEED_ADMIN_NAME || 'Inkora Admin',
      email: adminEmail,
      password: process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!',
      role: 'admin',
    });
    console.log(`[Inkora] Admin account created: ${adminEmail}`);
  } else {
    console.log('[Inkora] Admin account already exists, skipping.');
  }

  const categoryNames = ['Culture', 'Technology', 'Essays', 'Life', 'Fiction'];
  const categories = {};
  for (const name of categoryNames) {
    let cat = await Category.findOne({ name });
    if (!cat) cat = await Category.create({ name, description: `${name} articles on Inkora` });
    categories[name] = cat;
  }
  console.log('[Inkora] Categories ready.');

  const sample = [
    // ---- Essays ----
    {
      title: 'The Quiet Art of Writing Every Day',
      shortDescription:
        'On discipline, ritual, and why the blank page gets easier the more often you meet it.',
      content:
        'There is a particular kind of courage in sitting down to write when you have nothing to say. Most people wait for inspiration, but inspiration is a poor and irregular guest. The writers who last are the ones who show up anyway, who treat the page like a room they visit every morning whether or not anyone is home.\n\nThis is not about forcing brilliance. It is about building a relationship with your own attention, one sentence at a time, until the practice itself becomes the reward.',
      category: 'Essays',
      authorName: 'Maya Lindqvist',
      tags: ['writing', 'discipline', 'creativity'],
      daysAgo: 0,
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200',
    },
    {
      title: 'On Being Wrong in Public',
      shortDescription: 'What changing your mind costs, and why it is worth paying anyway.',
      content:
        'Somewhere along the way, admitting a mistake became a performance of weakness rather than a demonstration of thought. We reward certainty, even brittle certainty, over the slower and more honest work of reconsidering.\n\nThe people I trust most are the ones who can say, plainly, "I used to think X, and now I think Y" — not as an apology, but as evidence that they are still paying attention.',
      category: 'Essays',
      authorName: 'Maya Lindqvist',
      tags: ['essays', 'thinking', 'honesty'],
      daysAgo: 9,
      coverImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200',
    },
    {
      title: 'The Case for Boredom',
      shortDescription: 'A short defense of doing nothing, on purpose, more often.',
      content:
        'We have engineered boredom almost entirely out of daily life, and in doing so we may have removed the exact condition that produces original thought. Boredom is not empty time; it is unstructured time, and unstructured time is where the mind wanders somewhere useful.\n\nThe next time a spare ten minutes appears, try resisting the urge to fill it. See what surfaces when nothing is competing for your attention.',
      category: 'Essays',
      authorName: 'Owen Castellan',
      tags: ['attention', 'boredom', 'creativity'],
      daysAgo: 14,
      coverImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200',
    },

    // ---- Culture ----
    {
      title: 'What Cities Forget When They Grow Too Fast',
      shortDescription: 'A wander through the neighborhoods that get erased in the name of progress.',
      content:
        'Every city carries ghosts of the streets it used to be. Walk far enough through any rapidly growing metropolis and you will find seams — a corner shop untouched since the 1980s beside a glass tower finished last spring.\n\nProgress rarely asks permission. It simply arrives, and the old fabric of a place is left to argue for itself in fragments: a doorway, a signpost, a bench nobody thought to remove.',
      category: 'Culture',
      authorName: 'Devraj Fernandes',
      tags: ['cities', 'culture', 'change'],
      daysAgo: 2,
      coverImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200',
    },
    {
      title: 'The Second Life of Secondhand Things',
      shortDescription: 'Why thrifted objects carry a kind of meaning new ones can never have.',
      content:
        'A secondhand chair has already survived one household. It has been sat in, argued over, maybe slept in during a long illness, before it ever reaches you. That history does not show up on a price tag, but it changes how the object feels in a room.\n\nBuying new is a bet on the future. Buying old is an inheritance of someone else\'s past — and increasingly, people are choosing the inheritance.',
      category: 'Culture',
      authorName: 'Ines Okafor',
      tags: ['culture', 'objects', 'consumption'],
      daysAgo: 7,
      coverImage: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=1200',
    },
    {
      title: 'Why We Still Gather Around Long Tables',
      shortDescription: 'A short history of the communal table, and what it still does for us.',
      content:
        'Long before restaurants had names, communities had tables — places where food was less important than proximity, where an argument and a reconciliation could happen over the same meal.\n\nThe long table survives because it forces a kind of attention nothing else does: you cannot scroll past the person seated across from you.',
      category: 'Culture',
      authorName: 'Devraj Fernandes',
      tags: ['culture', 'food', 'community'],
      daysAgo: 11,
      coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
    },

    // ---- Technology ----
    {
      title: 'Small Machines, Large Consequences',
      shortDescription: 'How the smallest pieces of software quietly run the modern world.',
      content:
        'Nobody notices the tiny script that reconciles a bank ledger at 2am, or the compression algorithm that lets a photo load before you finish reaching for your phone. Software influence is inversely proportional to its visibility.\n\nUnderstanding this is the first step to building responsibly: the smallest components often carry the largest blast radius when they fail.',
      category: 'Technology',
      authorName: 'Priya Chandrasekaran',
      tags: ['software', 'systems', 'engineering'],
      daysAgo: 5,
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
    },
    {
      title: 'The Myth of the Paperless Office',
      shortDescription: 'Forty years of promises, and why paper never actually left the building.',
      content:
        'Every decade produces a fresh announcement that paper is finally finished. And every decade, printers keep selling, filing cabinets keep filling, and someone keeps a signed original "just in case."\n\nThe paperless office was never really about paper. It was about trust — and it turns out a PDF has not yet earned as much of it as an ink signature.',
      category: 'Technology',
      authorName: 'Priya Chandrasekaran',
      tags: ['technology', 'offices', 'history'],
      daysAgo: 12,
      coverImage: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1200',
    },
    {
      title: 'Designing for the Moment Before the Click',
      shortDescription: 'The unglamorous UX work that happens before anyone presses a button.',
      content:
        'Most design critique focuses on what happens after an interaction — the animation, the confirmation, the result. Far less attention goes to the half-second of hesitation right before someone commits to an action.\n\nThat hesitation is where trust is won or lost. A well-designed product spends as much care on the moment of doubt as it does on the moment of success.',
      category: 'Technology',
      authorName: 'Sana Okonjo',
      tags: ['design', 'ux', 'product'],
      daysAgo: 16,
      coverImage: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200',
    },

    // ---- Life ----
    {
      title: 'The Discipline of Slow Mornings',
      shortDescription: 'What changed when the first hour of the day stopped belonging to a screen.',
      content:
        'For years, the first thing I did each morning was reach for my phone. The last thing I did most nights was the same. Somewhere in between, I lost the habit of simply waking up and noticing the room I was in.\n\nA slow morning is not about productivity. It is about giving the day a chance to start on its own terms before the world starts making demands of it.',
      category: 'Life',
      authorName: 'Renata Kowalski',
      tags: ['habits', 'mornings', 'wellbeing'],
      daysAgo: 3,
      coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200',
    },
    {
      title: 'Learning to Rest Without Earning It',
      shortDescription: 'Unpacking the quiet belief that rest has to be deserved.',
      content:
        'Somewhere along the way I picked up the idea that rest was a reward, something you unlocked after enough hours of output. Under that belief, an ordinary Tuesday nap felt like theft.\n\nUnlearning that has been slower than I expected. But rest that has to be earned first is not really rest — it is just a different kind of work, disguised as relief.',
      category: 'Life',
      authorName: 'Renata Kowalski',
      tags: ['rest', 'wellbeing', 'habits'],
      daysAgo: 8,
      coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
    },
    {
      title: 'Keeping Friendships That Live in Different Time Zones',
      shortDescription: 'On the small rituals that keep long-distance friendships from quietly fading.',
      content:
        'A friendship that spans time zones has to survive without the easy default of "let\'s grab coffee." It runs instead on voice notes recorded at odd hours, on messages that wait patiently for a reply, on the occasional call that starts with someone apologizing for the time.\n\nWhat keeps it alive is not frequency. It is the small, repeated choice to keep showing up, even asynchronously.',
      category: 'Life',
      authorName: 'Owen Castellan',
      tags: ['friendship', 'life', 'connection'],
      daysAgo: 13,
      coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200',
    },

    // ---- Fiction ----
    {
      title: 'Letters to a Younger Self, Unsent',
      shortDescription: 'A short fiction piece about the advice we never quite manage to give.',
      content:
        'She kept the letters in a drawer she rarely opened, each one addressed to a girl who no longer existed except in memory. "Dear Ren," they all began, though Ren had not gone by that name in fifteen years.\n\nSome letters we write are not meant to be sent. They are meant to be written, folded, and kept — proof that we tried to say the thing, even if only to ourselves.',
      category: 'Fiction',
      authorName: 'Inkora Editorial',
      tags: ['fiction', 'short-story'],
      daysAgo: 1,
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200',
    },
    {
      title: 'The Lighthouse Keeper Who Stopped Believing in Ships',
      shortDescription: 'A short story about faith, routine, and the last light on a forgotten coast.',
      content:
        'Elias had not seen a ship pass in eleven months, yet every evening he still climbed the hundred and twelve steps to light the lamp. The harbor master had told him, gently, that the route had been rerouted years ago. Elias climbed anyway.\n\nSome nights he wondered if the light was still for ships at all, or if it had quietly become something else — a promise he was keeping to no one but himself.',
      category: 'Fiction',
      authorName: 'Thomas Vieira',
      tags: ['fiction', 'short-story', 'solitude'],
      daysAgo: 6,
      coverImage: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200',
    },
    {
      title: 'The Last Notebook',
      shortDescription: 'A short story about what a stranger finds in a notebook left on a train.',
      content:
        'The notebook had been left on the 6:40 to Riverside, its cover soft with handling. Mira almost left it there, but something about the handwriting on the first page made her slip it into her bag instead: "If you are reading this, I did not come back for it. Please finish what I started."\n\nShe read until the train reached her stop, and then two stops past it, and then she did not get off at all.',
      category: 'Fiction',
      authorName: 'Inkora Editorial',
      tags: ['fiction', 'short-story', 'mystery'],
      daysAgo: 10,
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200',
    },
  ];

  let insertedCount = 0;
  for (const item of sample) {
    const exists = await Article.findOne({ title: item.title });
    if (exists) continue;

    await Article.create({
      title: item.title,
      shortDescription: item.shortDescription,
      content: item.content,
      coverImage: item.coverImage,
      category: categories[item.category]._id,
      authorName: item.authorName,
      tags: item.tags,
      status: 'published',
      publishedAt: new Date(Date.now() - 86400000 * item.daysAgo),
      createdBy: admin._id,
    });
    insertedCount += 1;
  }

  if (insertedCount > 0) {
    console.log(`[Inkora] Seeded ${insertedCount} new sample article(s).`);
  } else {
    console.log('[Inkora] All sample articles already exist, skipping.');
  }

  await mongoose.disconnect();
  console.log('[Inkora] Seed complete.');
};

run().catch((err) => {
  console.error('[Inkora] Seed failed:', err);
  process.exit(1);
});
