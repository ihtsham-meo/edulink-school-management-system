import { useState, useMemo } from "react";
import {
  Send,
  MessageCircle,
  Mail,
  Bell,
  Search,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { mockMessages } from "../../data/mockData";

const channelConfig = {
  whatsapp: {
    icon: MessageCircle,
    bg: "bg-green-50 dark:bg-green-950",
    text: "text-green-600 dark:text-green-400",
    label: "WhatsApp",
  },
  email: {
    icon: Mail,
    bg: "bg-blue-50 dark:bg-blue-950",
    text: "text-blue-600 dark:text-blue-400",
    label: "Email",
  },
  push: {
    icon: Bell,
    bg: "bg-purple-50 dark:bg-purple-950",
    text: "text-purple-600 dark:text-purple-400",
    label: "Push",
  },
};

const messageStatusStyles = {
  sent: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  failed: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};

const tabs = ["Send Message", "Message History"];

function Communications() {
  const [activeTab, setTab] = useState("Send Message");
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [sent, setSent] = useState(false);

  const [form, setForm] = useState({
    channels: { whatsapp: true, email: false, push: false },
    recipient: "all_parents",
    title: "",
    message: "",
  });

  const filtered = useMemo(() => {
    return messages.filter(
      (m) =>
        m.to.toLowerCase().includes(search.toLowerCase()) ||
        m.message.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, messages]);

  const summary = useMemo(
    () => ({
      total: messages.length,
      whatsapp: messages.filter((m) => m.channel === "whatsapp").length,
      email: messages.filter((m) => m.channel === "email").length,
      push: messages.filter((m) => m.channel === "push").length,
    }),
    [messages],
  );

  const handleSend = () => {
    if (!form.message.trim()) return;
    const selectedChannels = Object.entries(form.channels)
      .filter(([_, v]) => v)
      .map(([k]) => k);
    if (selectedChannels.length === 0) return;

    selectedChannels.forEach((channel) => {
      setMessages((prev) => [
        {
          id: prev.length + 1,
          channel,
          to: form.recipient,
          message: form.message,
          status: "sent",
          sentAt: new Date().toLocaleString(),
          sentBy: "Admin",
        },
        ...prev,
      ]);
    });

    setSent(true);
    setTimeout(() => setSent(false), 2000);
    setForm((prev) => ({ ...prev, message: "", title: "" }));
  };

  const recipients = [
    { value: "all_parents", label: "All Parents" },
    { value: "all_staff", label: "All Staff" },
    { value: "all_students", label: "All Students" },
    { value: "class_10a", label: "Class 10-A Parents" },
    { value: "class_9b", label: "Class 9-B Parents" },
    { value: "class_11a", label: "Class 11-A Parents" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Communications"
        subtitle="Send messages via WhatsApp, Email and Push notifications"
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Sent",
            value: summary.total,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "WhatsApp",
            value: summary.whatsapp,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Email",
            value: summary.email,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Push",
            value: summary.push,
            bg: "bg-purple-50 dark:bg-purple-950",
            text: "text-purple-600 dark:text-purple-400",
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
            onClick={() => setTab(tab)}
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

      {/* Send Message Tab */}
      {activeTab === "Send Message" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-5">
            Compose Message
          </h3>
          <div className="flex flex-col gap-5">
            {/* Channel selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                Send via
              </label>
              <div className="flex gap-3">
                {Object.entries(channelConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={key}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          channels: {
                            ...prev.channels,
                            [key]: !prev.channels[key],
                          },
                        }))
                      }
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        form.channels[key]
                          ? `${config.bg} ${config.text} border-current`
                          : "bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary"
                      }`}
                    >
                      <Icon size={15} />
                      {config.label}
                      {form.channels[key] && <CheckCircle size={13} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recipient */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                Send to
              </label>
              <select
                value={form.recipient}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, recipient: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
              >
                {recipients.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title (for push/email) */}
            {(form.channels.push || form.channels.email) && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Message title"
                  className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                />
              </div>
            )}

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Type your message here..."
                rows={5}
                className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors resize-none"
              />
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary text-right">
                {form.message.length} characters
              </p>
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-medium transition-colors ${
                sent ? "bg-green-500" : "bg-accent hover:bg-accent-hover"
              }`}
            >
              <Send size={16} />
              {sent ? "Message Sent!" : "Send Message"}
            </button>
          </div>
        </div>
      )}

      {/* Message History Tab */}
      {activeTab === "Message History" && (
        <>
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
              />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filtered.map((msg) => {
              const config = channelConfig[msg.channel];
              const Icon = config.icon;
              return (
                <div
                  key={msg.id}
                  className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl px-5 py-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 ${config.bg} rounded-lg flex items-center justify-center shrink-0`}
                    >
                      <Icon size={16} className={config.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-md font-medium ${config.bg} ${config.text}`}
                          >
                            {config.label}
                          </span>
                          <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary font-medium">
                            → {msg.to}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-md font-medium ${messageStatusStyles[msg.status]}`}
                          >
                            {msg.status === "sent" ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle size={10} /> Sent
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <XCircle size={10} /> Failed
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                            {msg.sentAt}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Communications;
