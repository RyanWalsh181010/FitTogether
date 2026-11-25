// ============================================================
// data.js — ALL the fake data for your prototype lives here.
//
// There is no database. Everything below is made up, and that is
// on purpose: never put real people's names, emails, phone numbers
// or addresses in this file.
//
// LISTINGS contains fictional workout-partner profiles.
// COMMUNITIES contains fictional fitness-group cards.
// ============================================================

const STARTUP = {
  name: "FitTogether",
  tagline: "Your Fitness Journey Is Better Together.",
  pitch: "FitTogether connects you with workout partners who share your goals, schedule, and motivation—so you can make fitness a part of life, together."
};

const LISTINGS = [
  { id: 1, name: "Sarah J.", goal: "Strength", focus: "Strength training", category: "Beginner", availability: "Evenings", schedule: "Mon / Wed evenings", area: "Campus", location: "Campus gym", bio: "Building confidence with weights and looking for a consistent gym buddy.", initials: "SJ", color: "coral" },
  { id: 2, name: "Marcus C.", goal: "Running", focus: "Distance running", category: "Intermediate", availability: "Mornings", schedule: "Tue / Thu mornings", area: "Riverside", location: "Riverside trail", bio: "Training for a first 10K and happy to keep a relaxed pace.", initials: "MC", color: "blue" },
  { id: 3, name: "Jamie L.", goal: "Strength", focus: "Strength training", category: "Intermediate", availability: "Evenings", schedule: "Mon / Fri evenings", area: "Downtown", location: "Downtown gym", bio: "Working on steady strength progress, one session at a time.", initials: "JL", color: "gold" },
  { id: 4, name: "Riley K.", goal: "Wellness", focus: "Movement & mobility", category: "Beginner", availability: "Lunch breaks", schedule: "Weekday lunches", area: "Community", location: "Community studio", bio: "Mixing gentle movement and mobility into a busy week.", initials: "RK", color: "green" },
  { id: 5, name: "Alex N.", goal: "Running", focus: "Beginner running", category: "Beginner", availability: "Weekends", schedule: "Weekend mornings", area: "Campus", location: "University track", bio: "Just getting started with running and looking for friendly company.", initials: "AN", color: "purple" },
  { id: 6, name: "Taylor P.", goal: "Strength", focus: "Strength training", category: "Advanced", availability: "Evenings", schedule: "Tue / Thu evenings", area: "Westside", location: "Westside gym", bio: "Experienced lifter who enjoys sharing a focused training session.", initials: "TP", color: "blue" },
  { id: 7, name: "Morgan D.", goal: "Wellness", focus: "Group fitness", category: "Intermediate", availability: "Evenings", schedule: "Wednesday evenings", area: "Community", location: "Central studio", bio: "Looking for a welcoming group class and a little accountability.", initials: "MD", color: "coral" },
  { id: 8, name: "Casey W.", goal: "Running", focus: "Trail running", category: "Intermediate", availability: "Weekends", schedule: "Mon / Sat mornings", area: "Harbour", location: "Harbour route", bio: "Exploring local routes and building a regular running habit.", initials: "CW", color: "green" }
];

const COMMUNITIES = [
  { id: 1, name: "Beginner Fitness", category: "Beginner Fitness", members: 248, detail: "A friendly first step for building confidence, learning the basics, and finding a pace that feels right.", art: "beginner" },
  { id: 2, name: "Weightlifting Community", category: "Strength", members: 184, detail: "Share training tips, celebrate steady progress, and find a spotter for your next session.", art: "strength" },
  { id: 3, name: "Running Club", category: "Running", members: 326, detail: "From first jogs to longer routes, find running buddies who keep every mile encouraging.", art: "running" },
  { id: 4, name: "Yoga and Wellness", category: "Yoga & Wellness", members: 152, detail: "Make room for mindful movement, stretching, and a little more balance in your week.", art: "yoga" },
  { id: 5, name: "Student Fitness Group", category: "Student Life", members: 211, detail: "Campus-friendly workouts, study-break movement, and classmates who help you stay on track.", art: "students" },
  { id: 6, name: "Home Workout Community", category: "Home Workouts", members: 97, detail: "Trade simple routines and motivation for active days at home, with no gym required.", art: "home" }
];

const CHALLENGES = [
  { id: "three-workouts", cadence: "weekly", title: "Three workouts this week", detail: "Fit in three workouts that feel good for you. Any activity and duration count.", progress: 2, total: 3, unit: "workouts", points: 150, badge: "Consistency" },
  { id: "walking-steps", cadence: "weekly", title: "Walk 50,000 steps", detail: "Build movement into your week, one walk and one step at a time.", progress: 32400, total: 50000, unit: "steps", points: 120, badge: "Step by Step" },
  { id: "group-workouts", cadence: "monthly", title: "Five group workouts", detail: "Join five group sessions this month and enjoy moving with your community.", progress: 2, total: 5, unit: "sessions", points: 250, badge: "Community Builder" }
];

const MONTHLY_ACTIVITY = [
  { label: "Week 1", workouts: 4 },
  { label: "Week 2", workouts: 3 },
  { label: "Week 3", workouts: 5 },
  { label: "Week 4", workouts: 4 }
];

const RECENT_ACTIVITY = [
  { title: "Logged a strength workout", detail: "Campus gym", time: "Today", type: "workout" },
  { title: "Joined Beginner Fitness", detail: "Fitness community", time: "Yesterday", type: "community" },
  { title: "Set a weekly activity goal", detail: "Four workouts this week", time: "Nov 22", type: "goal" }
];
