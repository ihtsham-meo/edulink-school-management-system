import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  BookOpen,
  Users,
  AlertCircle,
  CheckCircle,
  Eye,
  RotateCcw,
  BookMarked,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { mockBooks, mockBookIssues } from "../../data/mockData";

const issueStatusStyles = {
  issued: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
  overdue: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
  returned: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
};

const availabilityStyle = (book) => {
  if (book.availableCopies === 0)
    return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400";
  if (book.availableCopies === 1)
    return "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400";
  return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400";
};

const categories = [
  "All",
  "Science",
  "English",
  "Islamic",
  "Computer",
  "Urdu",
  "Social",
];
const tabs = ["Books", "Issued Books", "Overdue"];

function LibraryManagement() {
  const [activeTab, setTab] = useState("Books");
  const [search, setSearch] = useState("");
  const [selectedCat, setCat] = useState("All");
  const [issues, setIssues] = useState(mockBookIssues);

  // ── Books filtered ──
  const filteredBooks = useMemo(() => {
    return mockBooks.filter((b) => {
      const matchSearch =
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === "All" || b.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [search, selectedCat]);

  // ── Issues filtered ──
  const filteredIssues = useMemo(() => {
    return issues.filter((i) => {
      const matchSearch =
        i.studentName.toLowerCase().includes(search.toLowerCase()) ||
        i.bookTitle.toLowerCase().includes(search.toLowerCase());
      const matchTab =
        activeTab === "Issued Books"
          ? i.status !== "returned"
          : i.status === "overdue";
      return matchSearch && matchTab;
    });
  }, [search, issues, activeTab]);

  const summary = useMemo(
    () => ({
      totalBooks: mockBooks.length,
      totalCopies: mockBooks.reduce((sum, b) => sum + b.totalCopies, 0),
      issued: issues.filter((i) => i.status === "issued").length,
      overdue: issues.filter((i) => i.status === "overdue").length,
    }),
    [issues],
  );

  const handleReturn = (id) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: "returned",
              returnedDate: new Date().toISOString().split("T")[0],
              fine: 0,
            }
          : i,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Library Management"
        subtitle="Manage books, issues, returns and fines"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={16} />
            Add Book
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Books",
            value: summary.totalBooks,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
            icon: BookOpen,
          },
          {
            label: "Total Copies",
            value: summary.totalCopies,
            bg: "bg-purple-50 dark:bg-purple-950",
            text: "text-purple-600 dark:text-purple-400",
            icon: BookMarked,
          },
          {
            label: "Currently Issued",
            value: summary.issued,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
            icon: Users,
          },
          {
            label: "Overdue",
            value: summary.overdue,
            bg: "bg-red-50 dark:bg-red-950",
            text: "text-red-600 dark:text-red-400",
            icon: AlertCircle,
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`${card.bg} rounded-xl p-4 flex items-center gap-3`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${card.bg}`}
            >
              <card.icon size={18} className={card.text} />
            </div>
            <div>
              <p className={`text-2xl font-semibold ${card.text}`}>
                {card.value}
              </p>
              <p className={`text-xs ${card.text} opacity-75`}>{card.label}</p>
            </div>
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
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-accent text-white"
                : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search + Category filter */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
            />
            <input
              type="text"
              placeholder={
                activeTab === "Books"
                  ? "Search by title or author..."
                  : "Search by student or book..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
          {activeTab === "Books" && (
            <div className="flex gap-2 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    selectedCat === c
                      ? "bg-accent text-white border-accent"
                      : "bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:border-accent"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Books Tab */}
      {activeTab === "Books" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 px-4 py-3 border-b border-light-border dark:border-dark-border">
            {[
              "Title",
              "Author",
              "ISBN",
              "Category",
              "Copies",
              "Available",
              "Actions",
            ].map((h) => (
              <span
                key={h}
                className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
              >
                {h}
              </span>
            ))}
          </div>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                className="grid grid-cols-7 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                    <BookOpen size={13} className="text-accent" />
                  </div>
                  <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                    {book.title}
                  </span>
                </div>
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
                  {book.author}
                </span>
                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  {book.isbn}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-accent/10 text-accent font-medium w-fit">
                  {book.category}
                </span>
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {book.totalCopies}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-md font-medium w-fit ${availabilityStyle(book)}`}
                >
                  {book.availableCopies === 0
                    ? "Out of stock"
                    : `${book.availableCopies} left`}
                </span>
                <div className="flex gap-1">
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors">
                    <Eye size={13} />
                  </button>
                  <button className="flex items-center gap-1 px-2 py-1 text-xs bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-white transition-colors">
                    Issue
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState icon={BookOpen} message="No books found" />
          )}
        </div>
      )}

      {/* Issued / Overdue Tab */}
      {(activeTab === "Issued Books" || activeTab === "Overdue") && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-6 px-4 py-3 border-b border-light-border dark:border-dark-border">
            {[
              "Student",
              "Book",
              "Issued Date",
              "Due Date",
              "Fine",
              "Actions",
            ].map((h) => (
              <span
                key={h}
                className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
              >
                {h}
              </span>
            ))}
          </div>
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="grid grid-cols-6 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium shrink-0">
                    {issue.studentName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                    {issue.studentName}
                  </span>
                </div>
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
                  {issue.bookTitle}
                </span>
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {issue.issuedDate}
                </span>
                <span
                  className={`text-xs font-medium ${issue.status === "overdue" ? "text-red-600 dark:text-red-400" : "text-light-text-secondary dark:text-dark-text-secondary"}`}
                >
                  {issue.dueDate}
                </span>
                <span
                  className={`text-sm font-semibold ${issue.fine > 0 ? "text-red-600 dark:text-red-400" : "text-light-text-tertiary dark:text-dark-text-tertiary"}`}
                >
                  {issue.fine > 0 ? `Rs ${issue.fine}` : "—"}
                </span>
                <div className="flex gap-1">
                  <StatusPill
                    status={issue.status}
                    styles={issueStatusStyles}
                  />
                  {issue.status !== "returned" && (
                    <button
                      onClick={() => handleReturn(issue.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-colors ml-1"
                    >
                      <RotateCcw size={11} />
                      Return
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={CheckCircle}
              message={
                activeTab === "Overdue" ? "No overdue books" : "No issued books"
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
        <Icon
          size={22}
          className="text-light-text-tertiary dark:text-dark-text-tertiary"
        />
      </div>
      <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
        {message}
      </p>
    </div>
  );
}

export default LibraryManagement;
