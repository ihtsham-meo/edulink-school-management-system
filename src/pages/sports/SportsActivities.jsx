import { useState, useMemo } from "react";
import { Search, Plus, Trophy, Users, Target, Star } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import {
  mockSports,
  mockMatches,
  mockClubs,
  mockAchievements,
} from "../../data/mockData";

const tabs = ["Sports Teams", "Match Results", "Clubs", "Achievements"];

const resultStyles = {
  win: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  loss: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
  draw: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
};

const levelStyles = {
  School: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  District: "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400",
  Regional:
    "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
  National: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  International: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
};

const achievementTypeStyles = {
  Sports: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  Academic: "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400",
  "Co-curricular":
    "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
  Arts: "bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400",
};

function SportsActivities() {
  const [activeTab, setTab] = useState("Sports Teams");
  const [search, setSearch] = useState("");

  const filteredMatches = useMemo(() => {
    return mockMatches.filter(
      (m) =>
        m.sport.toLowerCase().includes(search.toLowerCase()) ||
        m.opponent.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const filteredAchievements = useMemo(() => {
    return mockAchievements.filter(
      (a) =>
        a.studentName.toLowerCase().includes(search.toLowerCase()) ||
        a.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const summary = useMemo(
    () => ({
      sports: mockSports.length,
      totalWins: mockSports.reduce((sum, s) => sum + s.wins, 0),
      clubs: mockClubs.length,
      achievements: mockAchievements.length,
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Sports & Co-curricular"
        subtitle="Manage teams, matches, clubs and achievements"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={16} />
            Add
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Sports Teams",
            value: summary.sports,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Total Wins",
            value: summary.totalWins,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Active Clubs",
            value: summary.clubs,
            bg: "bg-purple-50 dark:bg-purple-950",
            text: "text-purple-600 dark:text-purple-400",
          },
          {
            label: "Achievements",
            value: summary.achievements,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
          },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} rounded-xl p-4`}>
            <p className={`text-2xl font-semibold ${card.text}`}>
              {card.value}
            </p>
            <p className={`text-xs ${card.text} opacity-75 mt-1`}>
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setTab(tab);
              setSearch("");
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === tab
                ? "bg-accent text-white"
                : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      {activeTab !== "Sports Teams" && activeTab !== "Clubs" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      )}

      {/* Sports Teams Tab */}
      {activeTab === "Sports Teams" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockSports.map((sport) => (
            <div
              key={sport.id}
              className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 hover:border-accent/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Trophy size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {sport.name}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      Coach: {sport.coach}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  <Users size={13} />
                  {sport.players} players
                </div>
              </div>

              {/* Win/Loss/Draw */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    label: "Wins",
                    value: sport.wins,
                    color: "text-green-600 dark:text-green-400",
                    bg: "bg-green-50 dark:bg-green-950",
                  },
                  {
                    label: "Losses",
                    value: sport.losses,
                    color: "text-red-600 dark:text-red-400",
                    bg: "bg-red-50 dark:bg-red-950",
                  },
                  {
                    label: "Draws",
                    value: sport.draws,
                    color: "text-amber-600 dark:text-amber-400",
                    bg: "bg-amber-50 dark:bg-amber-950",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`${stat.bg} rounded-lg p-2 text-center`}
                  >
                    <p className={`text-lg font-semibold ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className={`text-xs ${stat.color} opacity-75`}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Match Results Tab */}
      {activeTab === "Match Results" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border">
            {["Sport", "Opponent", "Date", "Score", "Result"].map((h) => (
              <span
                key={h}
                className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
              >
                {h}
              </span>
            ))}
          </div>
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                  <Trophy size={13} className="text-accent" />
                </div>
                <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  {match.sport}
                </span>
              </div>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {match.opponent}
              </span>
              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                {match.date}
              </span>
              <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                {match.score}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-medium w-fit ${resultStyles[match.result]}`}
              >
                {match.result.charAt(0).toUpperCase() + match.result.slice(1)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Clubs Tab */}
      {activeTab === "Clubs" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockClubs.map((club) => (
            <div
              key={club.id}
              className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 hover:border-accent/40 transition-colors"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                  <Star size={18} className="text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                    {club.name}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    Coordinator: {club.coordinator}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-3 text-center">
                  <p className="text-lg font-semibold text-accent">
                    {club.members}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    Members
                  </p>
                </div>
                <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-3 text-center">
                  <p className="text-lg font-semibold text-accent">
                    {club.events}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    Events
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "Achievements" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border">
            {["Student", "Title", "Type", "Level", "Date"].map((h) => (
              <span
                key={h}
                className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
              >
                {h}
              </span>
            ))}
          </div>
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium shrink-0">
                  {achievement.studentName.charAt(0)}
                </div>
                <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                  {achievement.studentName}
                </span>
              </div>
              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary pr-2">
                {achievement.title}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-medium w-fit ${achievementTypeStyles[achievement.type]}`}
              >
                {achievement.type}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-medium w-fit ${levelStyles[achievement.level]}`}
              >
                {achievement.level}
              </span>
              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                {achievement.date}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SportsActivities;
