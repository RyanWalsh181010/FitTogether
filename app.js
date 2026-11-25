// ============================================================
// app.js — what your site DOES.
// Plain JavaScript, no libraries, no installs.
// It uses STARTUP and LISTINGS from data.js (loaded first).
// ============================================================

(function () {
  "use strict";

  const storage = {
    get: function (key, fallback) {
      try {
        const saved = localStorage.getItem(key);
        return saved === null ? fallback : JSON.parse(saved);
      } catch (error) {
        return fallback; // storage blocked or broken: just carry on
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        // storage blocked (e.g. private window): ignore
      }
    }
  };

  let savedIds = storage.get("savedIds", []);
  let joinedIds = storage.get("joinedIds", [1]);
  let joinedChallengeIds = storage.get("joinedChallengeIds", ["three-workouts", "walking-steps"]);
  let workouts = storage.get("workouts", [true, true, false, true, false, false, false]);
  let totalWorkouts = storage.get("totalWorkouts", 24);
  let recentActivity = storage.get("recentActivity", RECENT_ACTIVITY);
  let activityRange = "weekly";

  document.title = STARTUP.name;
  document.getElementById("brand-name").textContent = STARTUP.name;
  document.getElementById("tagline").textContent = STARTUP.tagline;
  document.getElementById("pitch").textContent = STARTUP.pitch;

  function showView() {
    const requested = (window.location.hash || "#home").slice(1);
    const views = document.querySelectorAll("[data-view]");
    const exists = Array.prototype.some.call(views, function (view) {
      return view.id === requested;
    });
    const current = exists ? requested : "home";

    views.forEach(function (view) {
      view.hidden = view.id !== current;
    });

    document.querySelectorAll("nav a").forEach(function (link) {
      if (link.getAttribute("href") === "#" + current) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    window.scrollTo(0, 0);
    if (window.innerWidth <= 760) {
      document.getElementById("main-nav").classList.remove("open");
      document.getElementById("menu-button").setAttribute("aria-expanded", "false");
    }
  }

  window.addEventListener("hashchange", showView);
  document.getElementById("menu-button").addEventListener("click", function () {
    const nav = document.getElementById("main-nav");
    const isOpen = nav.classList.toggle("open");
    this.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  const grid = document.getElementById("listing-grid");
  const searchBox = document.getElementById("search-box");
  const emptyMessage = document.getElementById("empty-message");
  const savedCount = document.getElementById("saved-count");
  const goalFilter = document.getElementById("goal-filter");
  const experienceFilter = document.getElementById("experience-filter");
  const availabilityFilter = document.getElementById("availability-filter");
  const areaFilter = document.getElementById("area-filter");
  const matchCount = document.getElementById("match-count");

  function makeCard(item) {
    const card = document.createElement("article");
    card.className = "card";

    const profile = document.createElement("div");
    profile.className = "profile-row";
    const avatar = document.createElement("span");
    avatar.className = "avatar " + item.color;
    avatar.textContent = item.initials;
    const identity = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = item.name;
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = item.focus;
    identity.append(title, tag);
    profile.append(avatar, identity);

    const bio = document.createElement("p");
    bio.className = "profile-bio";
    bio.textContent = item.bio;

    const details = document.createElement("dl");
    details.className = "profile-details";
    [["Experience", item.category], ["Availability", item.schedule], ["Meetup spot", item.location]].forEach(function (pair) {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      dt.textContent = pair[0];
      const dd = document.createElement("dd");
      dd.textContent = pair[1];
      row.append(dt, dd);
      details.append(row);
    });

    const isSaved = savedIds.indexOf(item.id) !== -1;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button secondary";
    button.textContent = isSaved ? "Partner saved ✓" : "Save partner";
    button.setAttribute("aria-pressed", isSaved ? "true" : "false");
    button.addEventListener("click", function () {
      toggleSaved(item.id);
    });

    card.append(profile, bio, details, button);
    return card;
  }

  function toggleSaved(id) {
    if (savedIds.indexOf(id) === -1) {
      savedIds.push(id);
    } else {
      savedIds = savedIds.filter(function (savedId) { return savedId !== id; });
    }
    storage.set("savedIds", savedIds);
    renderListings();
  }

  function renderListings() {
    const query = searchBox.value.trim().toLowerCase();
    const goal = goalFilter.value;
    const experience = experienceFilter.value;
    const availability = availabilityFilter.value;
    const area = areaFilter.value;
    const matches = LISTINGS.filter(function (item) {
      const text = (item.name + " " + item.goal + " " + item.focus + " " + item.category + " " + item.location + " " + item.area + " " + item.bio).toLowerCase();
      return (goal === "all" || item.goal === goal) &&
        (experience === "all" || item.category === experience) &&
        (availability === "all" || item.availability === availability) &&
        (area === "all" || item.area === area) &&
        text.indexOf(query) !== -1;
    });

    grid.replaceChildren.apply(grid, matches.map(makeCard));
    emptyMessage.hidden = matches.length > 0;
    matchCount.textContent = matches.length + " " + (matches.length === 1 ? "partner" : "partners") + " match your filters.";
    savedCount.textContent = savedIds.length === 0
      ? "Tap Save on anything you like."
      : "You have " + savedIds.length + " saved partner(s) on this device.";
  }

  searchBox.addEventListener("input", renderListings);
  goalFilter.addEventListener("change", renderListings);
  experienceFilter.addEventListener("change", renderListings);
  availabilityFilter.addEventListener("change", renderListings);
  areaFilter.addEventListener("change", renderListings);

  const communitySearch = document.getElementById("community-search");
  const communityFilter = document.getElementById("community-filter");
  const communityFeedback = document.getElementById("community-feedback");
  const communityResultCount = document.getElementById("community-result-count");
  const communityEmpty = document.getElementById("community-empty");
  const communityArtwork = {
    beginner: '<svg viewBox="0 0 360 180" aria-hidden="true"><circle cx="284" cy="38" r="52" fill="#c6edae"/><circle cx="180" cy="54" r="21" fill="#284b3c"/><path d="M142 148c4-37 17-57 38-57s34 20 38 57M180 94v51m0-34-38 18m38-18 38 18" fill="none" stroke="#284b3c" stroke-linecap="round" stroke-width="12"/><path d="M126 148h108" stroke="#72cc37" stroke-linecap="round" stroke-width="10"/></svg>',
    strength: '<svg viewBox="0 0 360 180" aria-hidden="true"><circle cx="72" cy="46" r="34" fill="#c6edae"/><path d="M85 92h190" stroke="#284b3c" stroke-linecap="round" stroke-width="12"/><path d="M108 68v48m-18-40v32m162-40v48m18-40v32" stroke="#284b3c" stroke-linecap="round" stroke-width="12"/><path d="M145 92h70" stroke="#72cc37" stroke-linecap="round" stroke-width="18"/></svg>',
    running: '<svg viewBox="0 0 360 180" aria-hidden="true"><circle cx="284" cy="42" r="48" fill="#c6edae"/><circle cx="183" cy="42" r="18" fill="#284b3c"/><path d="m177 65-25 34 37 15 26-28m-63 13-38 12-24-9m99 15-12 37m12-37 38 27 23-5" fill="none" stroke="#284b3c" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"/><path d="M72 150h220" stroke="#72cc37" stroke-linecap="round" stroke-width="9"/></svg>',
    yoga: '<svg viewBox="0 0 360 180" aria-hidden="true"><circle cx="286" cy="40" r="48" fill="#c6edae"/><circle cx="180" cy="43" r="18" fill="#284b3c"/><path d="m180 66-3 40m0-27-43-25m43 25 43-25m-43 52-38 21m38-21 39 21m-77 0h116" fill="none" stroke="#284b3c" stroke-linecap="round" stroke-linejoin="round" stroke-width="11"/><path d="M108 149h144" stroke="#72cc37" stroke-linecap="round" stroke-width="9"/></svg>',
    students: '<svg viewBox="0 0 360 180" aria-hidden="true"><circle cx="282" cy="42" r="48" fill="#c6edae"/><circle cx="130" cy="64" r="17" fill="#284b3c"/><circle cx="184" cy="49" r="19" fill="#284b3c"/><circle cx="238" cy="64" r="17" fill="#284b3c"/><path d="M98 142c3-31 13-47 32-47s29 16 32 47m-2-26c4-34 12-51 24-51s20 17 24 51m-2 26c3-31 13-47 32-47s29 16 32 47" fill="none" stroke="#284b3c" stroke-linecap="round" stroke-width="11"/><path d="M89 149h182" stroke="#72cc37" stroke-linecap="round" stroke-width="9"/></svg>',
    home: '<svg viewBox="0 0 360 180" aria-hidden="true"><circle cx="285" cy="40" r="46" fill="#c6edae"/><path d="m99 97 81-59 81 59v52H99z" fill="#fff" stroke="#284b3c" stroke-linejoin="round" stroke-width="9"/><circle cx="180" cy="83" r="12" fill="#72cc37"/><path d="M158 128c2-20 9-30 22-30s20 10 22 30m-22-29v31m-28 0h56" fill="none" stroke="#284b3c" stroke-linecap="round" stroke-width="9"/></svg>'
  };

  function renderCommunities() {
    const grid = document.getElementById("community-grid");
    const query = communitySearch.value.trim().toLowerCase();
    const category = communityFilter.value;
    const matches = COMMUNITIES.filter(function (community) {
      const searchable = (community.name + " " + community.category + " " + community.detail).toLowerCase();
      return (category === "all" || community.category === category) && searchable.indexOf(query) !== -1;
    });
    grid.replaceChildren.apply(grid, matches.map(function (community) {
      const card = document.createElement("article");
      card.className = "card community-card";
      const visual = document.createElement("div");
      visual.className = "community-visual art-" + community.art;
      visual.innerHTML = communityArtwork[community.art];
      const body = document.createElement("div");
      body.className = "community-body";
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = community.category;
      const title = document.createElement("h2");
      title.textContent = community.name;
      const detail = document.createElement("p");
      detail.textContent = community.detail;
      const members = document.createElement("p");
      members.className = "community-members";
      const joined = joinedIds.indexOf(community.id) !== -1;
      const memberCount = community.members + (joined ? 1 : 0);
      members.textContent = memberCount + " members";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button " + (joined ? "secondary" : "");
      button.textContent = joined ? "Joined ✓" : "Join community";
      button.disabled = joined;
      button.addEventListener("click", function () {
        joinedIds = joinedIds.concat(community.id);
        storage.set("joinedIds", joinedIds);
        renderCommunities();
        communityFeedback.textContent = "You joined " + community.name + "! Its member count is now " + (community.members + 1) + ".";
        recordActivity("Joined " + community.name, "Fitness community", "community");
        renderProgress();
      });
      body.append(tag, title, detail, members, button);
      card.append(visual, body);
      return card;
    }));
    communityResultCount.textContent = "Showing " + matches.length + " of " + COMMUNITIES.length + " communities.";
    communityEmpty.hidden = matches.length > 0;
  }

  communitySearch.addEventListener("input", renderCommunities);
  communityFilter.addEventListener("change", renderCommunities);

  function renderChallenges() {
    const challengeFeedback = document.getElementById("challenge-feedback");
    function makeChallengeCard(challenge) {
      const card = document.createElement("article");
      card.className = "card challenge-card";

      const top = document.createElement("div");
      top.className = "challenge-card-top";
      const cadence = document.createElement("span");
      cadence.className = "tag";
      cadence.textContent = challenge.cadence === "weekly" ? "WEEKLY" : "MONTHLY";
      const points = document.createElement("span");
      points.className = "challenge-points";
      points.textContent = "+" + challenge.points + " points";
      top.append(cadence, points);

      const title = document.createElement("h3");
      title.textContent = challenge.title;
      const detail = document.createElement("p");
      detail.className = "challenge-description";
      detail.textContent = challenge.detail;

      const percentage = Math.min(100, Math.round(challenge.progress / challenge.total * 100));
      const progressCopy = document.createElement("div");
      progressCopy.className = "challenge-progress-copy";
      const progressText = document.createElement("span");
      progressText.textContent = challenge.progress.toLocaleString() + " of " + challenge.total.toLocaleString() + " " + challenge.unit;
      const percentageText = document.createElement("strong");
      percentageText.textContent = percentage + "%";
      progressCopy.append(progressText, percentageText);

      const progressBar = document.createElement("div");
      progressBar.className = "challenge-progress-bar";
      progressBar.setAttribute("role", "progressbar");
      progressBar.setAttribute("aria-label", challenge.title + " progress");
      progressBar.setAttribute("aria-valuemin", "0");
      progressBar.setAttribute("aria-valuemax", String(challenge.total));
      progressBar.setAttribute("aria-valuenow", String(Math.min(challenge.progress, challenge.total)));
      const progressFill = document.createElement("span");
      progressFill.style.width = percentage + "%";
      progressBar.append(progressFill);

      const badge = document.createElement("p");
      badge.className = "challenge-badge-reward";
      badge.textContent = "Achievement badge: " + challenge.badge;

      const joined = joinedChallengeIds.indexOf(challenge.id) !== -1;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button" + (joined ? " secondary" : "");
      button.textContent = joined ? "Joined ✓" : "Join Challenge";
      button.disabled = joined;
      button.addEventListener("click", function () {
        joinedChallengeIds = joinedChallengeIds.concat(challenge.id);
        storage.set("joinedChallengeIds", joinedChallengeIds);
        renderChallenges();
        challengeFeedback.textContent = "You joined “" + challenge.title + "”! Your progress will be saved in this browser.";
        recordActivity("Joined " + challenge.title, challenge.cadence + " challenge", "challenge");
        renderProgress();
      });

      card.append(top, title, detail, progressCopy, progressBar, badge, button);
      return card;
    }

    document.getElementById("weekly-challenges").replaceChildren.apply(
      document.getElementById("weekly-challenges"),
      CHALLENGES.filter(function (challenge) { return challenge.cadence === "weekly"; }).map(makeChallengeCard)
    );
    document.getElementById("monthly-challenges").replaceChildren.apply(
      document.getElementById("monthly-challenges"),
      CHALLENGES.filter(function (challenge) { return challenge.cadence === "monthly"; }).map(makeChallengeCard)
    );

    const leaderboard = document.getElementById("leaderboard");
    leaderboard.replaceChildren();
    [
      ["1", "Campus Strength", "1,840"],
      ["2", "Morning Runners", "1,620"],
      ["3", "Beginner Fitness", "1,390"],
      ["4", "Yoga and Wellness", "1,150"]
    ].forEach(function (row) {
      const item = document.createElement("div");
      item.className = "leader-row";
      const rank = document.createElement("span");
      rank.className = "rank";
      rank.textContent = row[0];
      const team = document.createElement("strong");
      team.textContent = row[1];
      const score = document.createElement("span");
      score.textContent = row[2];
      item.append(rank, team, score);
      leaderboard.append(item);
    });
  }

  function recordActivity(title, detail, type) {
    recentActivity.unshift({ title: title, detail: detail, time: "Just now", type: type });
    recentActivity = recentActivity.slice(0, 6);
    storage.set("recentActivity", recentActivity);
  }

  function renderActivityChart() {
    const chart = document.getElementById("activity-chart");
    const title = document.getElementById("activity-chart-title");
    const summary = document.getElementById("chart-summary");
    const weeklyView = document.getElementById("weekly-view");
    const monthlyView = document.getElementById("monthly-view");
    const isWeekly = activityRange === "weekly";
    const entries = isWeekly
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(function (label, index) {
        return { label: label, workouts: workouts[index] ? 1 : 0 };
      })
      : MONTHLY_ACTIVITY;
    const total = entries.reduce(function (sum, entry) { return sum + entry.workouts; }, 0);
    const max = isWeekly ? 1 : Math.max.apply(null, entries.map(function (entry) { return entry.workouts; }));
    chart.replaceChildren();
    chart.setAttribute("aria-label", isWeekly
      ? total + " workouts logged across " + entries.filter(function (entry) { return entry.workouts > 0; }).length + " days this week"
      : total + " workouts logged across four weeks this month");
    entries.forEach(function (entry) {
      const column = document.createElement("div");
      column.className = "chart-column";
      const value = document.createElement("span");
      value.className = "chart-value";
      value.textContent = String(entry.workouts);
      const track = document.createElement("div");
      track.className = "chart-bar-track";
      const fill = document.createElement("span");
      fill.className = "chart-bar-fill";
      fill.style.height = entry.workouts === 0 ? "0%" : Math.max(12, entry.workouts / max * 100) + "%";
      track.append(fill);
      const label = document.createElement("span");
      label.className = "chart-label";
      label.textContent = entry.label;
      column.append(value, track, label);
      chart.append(column);
    });

    title.textContent = isWeekly ? "This week" : "This month";
    document.getElementById("week-completion").textContent = isWeekly
      ? total + " this week"
      : total + " this month";
    summary.textContent = isWeekly
      ? total + " workouts logged across " + entries.filter(function (entry) { return entry.workouts > 0; }).length + " active days"
      : total + " workouts logged across four weeks";
    weeklyView.classList.toggle("active", isWeekly);
    weeklyView.setAttribute("aria-pressed", isWeekly ? "true" : "false");
    monthlyView.classList.toggle("active", !isWeekly);
    monthlyView.setAttribute("aria-pressed", !isWeekly ? "true" : "false");
  }

  function renderDashboardChallenges() {
    const container = document.getElementById("current-challenges");
    const activeChallenges = CHALLENGES.filter(function (challenge) {
      return joinedChallengeIds.indexOf(challenge.id) !== -1;
    });
    container.replaceChildren();
    if (activeChallenges.length === 0) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "You haven’t joined a challenge yet.";
      const link = document.createElement("a");
      link.href = "#challenges";
      link.textContent = "Explore challenges";
      container.append(empty, link);
      return;
    }

    activeChallenges.forEach(function (challenge) {
      const row = document.createElement("div");
      row.className = "dashboard-challenge";
      const heading = document.createElement("div");
      heading.className = "dashboard-challenge-heading";
      const name = document.createElement("strong");
      name.textContent = challenge.title;
      const count = document.createElement("span");
      count.textContent = challenge.progress.toLocaleString() + " / " + challenge.total.toLocaleString();
      heading.append(name, count);
      const track = document.createElement("div");
      track.className = "progress-bar";
      track.setAttribute("role", "progressbar");
      track.setAttribute("aria-label", challenge.title + " progress");
      track.setAttribute("aria-valuemin", "0");
      track.setAttribute("aria-valuemax", String(challenge.total));
      track.setAttribute("aria-valuenow", String(Math.min(challenge.progress, challenge.total)));
      const fill = document.createElement("span");
      fill.style.width = Math.min(100, challenge.progress / challenge.total * 100) + "%";
      track.append(fill);
      row.append(heading, track);
      container.append(row);
    });
  }

  function renderRecentActivity() {
    const list = document.getElementById("recent-activity");
    const symbols = { workout: "↗", goal: "◎", achievement: "★", community: "◉", challenge: "✓" };
    list.replaceChildren();
    recentActivity.forEach(function (entry) {
      const row = document.createElement("article");
      row.className = "recent-activity-item";
      const icon = document.createElement("span");
      icon.className = "activity-icon " + entry.type;
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = symbols[entry.type] || "•";
      const copy = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = entry.title;
      const detail = document.createElement("p");
      detail.textContent = entry.detail;
      copy.append(title, detail);
      const time = document.createElement("span");
      time.className = "activity-time";
      time.textContent = entry.time;
      row.append(icon, copy, time);
      list.append(row);
    });
  }

  function renderProgress() {
    const completed = workouts.filter(Boolean).length;
    document.getElementById("total-workouts").textContent = String(totalWorkouts);
    document.getElementById("joined-group-count").textContent = String(joinedIds.length);
    document.getElementById("week-score").textContent = String(completed * 120);
    document.getElementById("week-completion").textContent = completed + " of 4 workouts";
    document.getElementById("log-workout").disabled = workouts.every(Boolean);
    document.getElementById("log-workout").textContent = workouts.every(Boolean) ? "Week logged" : "Log a workout";
    document.getElementById("activity-message").textContent = completed >= 4
      ? "You reached your weekly goal. Celebrate your consistency!"
      : "Log an activity for the next available day. Rest and flexibility are part of your routine.";
    renderActivityChart();
    renderDashboardChallenges();
    renderRecentActivity();

    const goalProgress = document.getElementById("goal-progress");
    const goals = [
      { title: "Weekly workouts", current: Math.min(completed, 4), target: 4, unit: "workouts" },
      { title: "Active days", current: Math.min(completed, 5), target: 5, unit: "days" },
      { title: "Communities joined", current: Math.min(joinedIds.length, 2), target: 2, unit: "groups" }
    ];
    goalProgress.replaceChildren();
    goals.forEach(function (goal) {
      const row = document.createElement("div");
      row.className = "goal-row";
      const summary = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = goal.title;
      const count = document.createElement("span");
      count.textContent = goal.current + " / " + goal.target + " " + goal.unit;
      summary.append(title, count);
      const progress = document.createElement("div");
      progress.className = "progress-bar";
      progress.setAttribute("role", "progressbar");
      progress.setAttribute("aria-label", goal.title);
      progress.setAttribute("aria-valuemin", "0");
      progress.setAttribute("aria-valuemax", String(goal.target));
      progress.setAttribute("aria-valuenow", String(goal.current));
      const fill = document.createElement("span");
      fill.style.width = (goal.current / goal.target * 100) + "%";
      progress.append(fill);
      row.append(summary, progress);
      goalProgress.append(row);
    });

    const achievements = [
      { title: "First Steps", detail: "Log your first activity.", symbol: "1", earned: completed > 0 },
      { title: "Finding Your Rhythm", detail: "Log three activities this week.", symbol: "✓", earned: completed >= 3 },
      { title: "Community Member", detail: "Join a fitness community.", symbol: "★", earned: joinedIds.length > 0 }
    ];
    const achievementGrid = document.getElementById("achievement-grid");
    achievementGrid.replaceChildren();
    achievements.forEach(function (achievement) {
      const card = document.createElement("article");
      card.className = "card achievement-tile" + (achievement.earned ? " earned" : " locked");
      const icon = document.createElement("span");
      icon.className = "achievement-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = achievement.symbol;
      const content = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = achievement.title;
      const detail = document.createElement("p");
      detail.textContent = achievement.detail;
      const status = document.createElement("span");
      status.className = "achievement-status";
      status.textContent = achievement.earned ? "Earned" : "In progress";
      content.append(title, detail, status);
      card.append(icon, content);
      achievementGrid.append(card);
    });
  }

  document.getElementById("weekly-view").addEventListener("click", function () {
    activityRange = "weekly";
    renderActivityChart();
  });
  document.getElementById("monthly-view").addEventListener("click", function () {
    activityRange = "monthly";
    renderActivityChart();
  });

  function setupNetwork() {
    const slider = document.getElementById("member-slider");
    function update() {
      const count = Number(slider.value);
      document.getElementById("member-count").textContent = count + " members";
      const compatiblePartners = Math.max(1, Math.round(count * 0.18));
      const communities = Math.max(1, Math.round(count / 25));
      const organizers = Math.max(1, Math.round(count / 40));
      document.getElementById("partner-options").textContent = String(compatiblePartners);
      document.getElementById("community-options").textContent = String(communities);
      document.getElementById("organizer-count").textContent = String(organizers);
      document.getElementById("activity-options").textContent = String(organizers * 2);
      slider.style.setProperty("--value", ((count - 10) / 990 * 100) + "%");
    }
    slider.addEventListener("input", update);
    update();
  }

  renderListings();
  renderCommunities();
  renderChallenges();
  renderProgress();
  setupNetwork();
  document.getElementById("log-workout").addEventListener("click", function () {
    const nextEmpty = workouts.indexOf(false);
    if (nextEmpty !== -1) {
      workouts[nextEmpty] = true;
      totalWorkouts += 1;
      storage.set("workouts", workouts);
      storage.set("totalWorkouts", totalWorkouts);
      recordActivity("Logged a workout", "Weekly activity updated", "workout");
      renderProgress();
    }
  });
  showView();
})();
