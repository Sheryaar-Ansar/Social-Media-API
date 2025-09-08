const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

const User = require("../models/userModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

dotenv.config();

const MONGO_URI_LOCAL = process.env.MONGO_URI_LOCAL || "mongodb://localhost:27017/social-media-api";

// Sample data arrays
const usernames = [
  "john", "jane", "mark", "lucy", "peter", "sarah", "david", "emma", "alex", "sofia",
  "mike", "anna", "chris", "lisa", "tom", "maria", "jack", "kate", "ryan", "olivia",
  "daniel", "grace", "luke", "maya", "noah", "zoe", "ethan", "chloe", "jacob", "ava",
  "admin", "moderator"
];

const bios = [
  "Coffee lover ☕ | Tech enthusiast 💻",
  "Adventure seeker 🏔️ | Photography addict 📸",
  "Fitness junkie 💪 | Healthy living advocate 🥗",
  "Bookworm 📚 | Writing is my passion ✍️",
  "Music producer 🎵 | Always creating beats 🎧",
  "Travel blogger ✈️ | Exploring the world 🌍",
  "Foodie 🍕 | Cooking experiments daily 👨‍🍳",
  "Artist 🎨 | Painting my thoughts 🖼️",
  "Gamer 🎮 | Streaming live on weekends 📺",
  "Yoga instructor 🧘‍♀️ | Mind-body wellness coach 🕯️",
  "Pet lover 🐕 | Rescue animal advocate 🐾",
  "Entrepreneur 💼 | Building the next big thing 🚀",
  "Student 🎓 | Learning something new everyday 📖",
  "Chef 👨‍🍳 | Culinary arts master 🍽️",
  "Runner 🏃‍♂️ | Marathon enthusiast 🏁",
  "Designer 💻 | Creating beautiful interfaces ✨",
  "Teacher 👩‍🏫 | Inspiring young minds 🌟",
  "Developer 👨‍💻 | Code is poetry 🎭",
  "Photographer 📷 | Capturing life's moments 🌅",
  "Writer ✍️ | Storytelling is my craft 📝"
];

const postTexts = [
  "Just finished my morning workout! 💪 Feeling energized for the day ahead! #MorningMotivation",
  "Coffee and code - the perfect combination ☕💻 #DevLife",
  "Beautiful sunset from my balcony tonight 🌅 Nature never fails to amaze me",
  "Reading this amazing book and can't put it down 📚 Any recommendations for my next read?",
  "Trying out a new recipe today! Wish me luck 👨‍🍳 #CookingAdventures",
  "Weekend hiking trip was absolutely incredible! 🏔️ #NatureLover",
  "Just launched my new project! 🚀 Excited to see where this goes #Startup",
  "Movie night with friends 🎬🍿 What's your favorite movie genre?",
  "Learning something new every day keeps life interesting 📖 #LifelongLearning",
  "Grateful for all the amazing people in my life 🙏 #Blessed",
  "Working from this cozy café today ☕ #DigitalNomad",
  "Finally completed my 10K run! 🏃‍♂️ Personal best time too! #Running",
  "Art exhibition opening tonight 🎨 Supporting local artists in our community",
  "Homemade pizza turned out better than expected! 🍕 #HomeCooking",
  "Meditation session this morning brought so much clarity 🧘‍♀️ #Mindfulness",
  "Tech conference was mind-blowing! 🤯 So many innovative ideas #TechTrends",
  "Volunteering at the animal shelter today 🐕 These pups need loving homes!",
  "New song just dropped on my playlist 🎵 What are you listening to lately?",
  "Beach day with the squad! 🏖️ Perfect weather for some vitamin D",
  "Late night coding session 🌙💻 Sometimes the best ideas come after midnight",
  "Fresh flowers for the apartment 🌸 Small things that bring joy",
  "Gym session complete! 💪 Consistency is key to reaching goals",
  "Exploring a new neighborhood today 🚶‍♀️ Found the cutest little bookstore!",
  "Sunday brunch with family 🥞 These moments are precious",
  "Photography walk in the city 📸 Light and shadows everywhere",
  "Finished organizing my entire workspace 📋 Productivity level: MAX",
  "Trying to learn Spanish 🇪🇸 ¡Hola amigos! Any tips for beginners?",
  "Game night was legendary! 🎮 Who else loves board games?",
  "Fresh vegetables from the farmers market 🥬 Supporting local growers",
  "Concert last night was absolutely incredible! 🎤 Live music hits different"
];

const commentTexts = [
  "This is awesome! 🔥",
  "Love this! ❤️",
  "So inspiring! 💫",
  "Great post! 👏",
  "Amazing! 🤩",
  "Keep it up! 💪",
  "Absolutely beautiful! 😍",
  "This made my day! ☀️",
  "So cool! ✨",
  "Incredible work! 🙌",
  "I can relate to this! 🤝",
  "Thanks for sharing! 🙏",
  "This is gold! 🏆",
  "Exactly what I needed to see! 💯",
  "You're the best! 🌟",
  "Love the energy! ⚡",
  "This is so true! 💭",
  "Perfect timing! ⏰",
  "Made me smile! 😊",
  "Bookmarking this! 📌",
  "Such a vibe! 🎵",
  "Goals right here! 🎯",
  "You nailed it! 🔨",
  "Feeling motivated! 🚀",
  "Absolutely agree! ✅",
  "This is everything! 🌈",
  "So proud of you! 🎉",
  "Living your best life! 🌸",
  "This hits different! 💥",
  "Pure excellence! 👑"
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI_LOCAL);
    console.log("Connected to MongoDB");

    // Clear old data
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({})
    ]);
    console.log("Cleared old data");

    // Hash password once
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create users
    console.log("Creating users...");
    const users = [];
    
    for (let i = 0; i < usernames.length; i++) {
      const username = usernames[i];
      const role = (username === "admin" || username === "moderator") ? "admin" : "user";
      const bio = i < bios.length ? bios[i] : `Hi! I'm ${username} 👋`;
      
      const user = await User.create({
        username,
        email: `${username}@example.com`,
        password: hashedPassword,
        role,
        bio
      });
      
      users.push(user);
    }

    console.log(`Created ${users.length} users`);

    // Create realistic follow relationships
    console.log("Setting up follow relationships...");
    const regularUsers = users.filter(u => u.role === "user");
    
    for (let i = 0; i < regularUsers.length; i++) {
      const user = regularUsers[i];
      const followCount = Math.floor(Math.random() * 8) + 3; // 3-10 follows per user
      
      // Get random users to follow (excluding self)
      const otherUsers = regularUsers.filter(u => u._id.toString() !== user._id.toString());
      const toFollow = otherUsers.sort(() => 0.5 - Math.random()).slice(0, followCount);
      
      for (const followUser of toFollow) {
        // Add to following
        if (!user.following.includes(followUser._id)) {
          user.following.push(followUser._id);
          user.followingCount += 1;
        }
        
        // Add to followers
        if (!followUser.followers.includes(user._id)) {
          followUser.followers.push(user._id);
          followUser.followersCount += 1;
        }
      }
    }

    // Save all users with updated follow counts
    await Promise.all(users.map(u => u.save()));
    console.log("Follow relationships established");

    // Create posts
    console.log("Creating posts...");
    const posts = [];
    
    // Each user creates 2-5 posts
    for (const user of users) {
      const postCount = Math.floor(Math.random() * 4) + 2; // 2-5 posts per user
      
      for (let i = 0; i < postCount; i++) {
        const randomText = postTexts[Math.floor(Math.random() * postTexts.length)];
        
        const post = await Post.create({
          authorName: user._id,
          text: randomText
        });
        
        posts.push(post);
      }
    }

    console.log(`Created ${posts.length} posts`);

    // Add likes to posts
    console.log("Adding likes to posts...");
    for (const post of posts) {
      const likeCount = Math.floor(Math.random() * 15) + 1; // 1-15 likes per post
      const usersToLike = users
        .filter(u => u._id.toString() !== post.authorName.toString()) // Can't like own post
        .sort(() => 0.5 - Math.random())
        .slice(0, likeCount);
      
      post.likes = usersToLike.map(u => u._id);
      await post.save();
    }

    console.log("Likes added to posts");

    // Create comments
    console.log("Creating comments...");
    const comments = [];
    
    for (const post of posts) {
      const commentCount = Math.floor(Math.random() * 8) + 1; // 1-8 comments per post
      
      for (let i = 0; i < commentCount; i++) {
        // Random user comments (excluding post author sometimes for variety)
        const availableUsers = Math.random() > 0.3 
          ? users.filter(u => u._id.toString() !== post.authorName.toString())
          : users;
        
        const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
        const randomCommentText = commentTexts[Math.floor(Math.random() * commentTexts.length)];
        
        const comment = await Comment.create({
          post: post._id,
          authorName: randomUser._id,
          text: randomCommentText
        });
        
        post.comments.push(comment._id);
        comments.push(comment);
      }
      
      await post.save();
    }

    console.log(`Created ${comments.length} comments`);

    // Create some special admin posts
    const adminUsers = users.filter(u => u.role === "admin");
    if (adminUsers.length > 0) {
      const adminPosts = [
        "🚨 Welcome to our community! Please be respectful and follow our community guidelines.",
        "📢 System maintenance scheduled for this weekend. Expect brief downtime.",
        "🎉 We've reached 1000 users! Thank you all for being part of this amazing community!",
        "💡 New feature update: Dark mode is now available in settings!",
        "⚠️ Reminder: Please report any inappropriate content. We're here to keep this space safe for everyone."
      ];
      
      for (let i = 0; i < adminPosts.length; i++) {
        const admin = adminUsers[i % adminUsers.length];
        const post = await Post.create({
          authorName: admin._id,
          text: adminPosts[i]
        });
        
        // Admin posts get lots of likes
        post.likes = users.slice(0, Math.floor(users.length * 0.7)).map(u => u._id);
        await post.save();
      }
    }

    // Final statistics
    const finalUsers = await User.countDocuments();
    const finalPosts = await Post.countDocuments();
    const finalComments = await Comment.countDocuments();
    const totalLikes = await Post.aggregate([
      { $project: { likesCount: { $size: "$likes" } } },
      { $group: { _id: null, total: { $sum: "$likesCount" } } }
    ]);

    console.log("\n🎉 SEEDING COMPLETE! 🎉");
    console.log("=" * 50);
    console.log(`📊 Database Statistics:`);
    console.log(`   👥 Users: ${finalUsers}`);
    console.log(`   📝 Posts: ${finalPosts}`);
    console.log(`   💬 Comments: ${finalComments}`);
    console.log(`   ❤️  Total Likes: ${totalLikes[0]?.total || 0}`);
    console.log("\n🔑 Login Credentials (all passwords: password123):");
    console.log("   Regular Users:");
    regularUsers.slice(0, 5).forEach(user => {
      console.log(`     📧 ${user.email}`);
    });
    console.log("   Admin Users:");
    adminUsers.forEach(user => {
      console.log(`     🔐 ${user.email} (${user.role})`);
    });
    console.log("\n✅ Your API is ready for testing!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
};

seed();