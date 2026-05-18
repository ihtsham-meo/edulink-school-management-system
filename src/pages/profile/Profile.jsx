import { useState } from "react";
import {
  Camera,
  Save,
  Lock,
  User,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";

function Profile() {
  const { user, role } = useAuth();

  const [activeTab, setTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "Super Admin",
    email: user?.email || "admin@edulink.com",
    phone: "03001234567",
    address: "Lahore, Pakistan",
    role: role || "admin",
  });

  const [passwords, setPasswords] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  const [passError, setPassError] = useState("");
  const [passSaved, setPassSaved] = useState(false);

  const handleSaveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = () => {
    setPassError("");
    if (!passwords.old || !passwords.new || !passwords.confirm) {
      setPassError("All fields are required.");
      return;
    }
    if (passwords.new.length < 6) {
      setPassError("New password must be at least 6 characters.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPassError("New password and confirm password do not match.");
      return;
    }
    setPassSaved(true);
    setPasswords({ old: "", new: "", confirm: "" });
    setTimeout(() => setPassSaved(false), 2000);
  };

  const roleLabel = {
    admin: "Administrator",
    teacher: "Teacher",
    student: "Student",
  };

  const roleBg = {
    admin: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
    teacher: "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400",
    student:
      "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Profile"
        subtitle="View and manage your account information"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Avatar card */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6 flex flex-col items-center gap-4 h-fit">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-white text-3xl font-semibold">
              {profile.name.charAt(0)}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-accent rounded-full flex items-center justify-center border-2 border-light-card dark:border-dark-card">
              <Camera size={13} color="white" />
            </button>
          </div>

          {/* Name + role */}
          <div className="text-center">
            <p className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary">
              {profile.name}
            </p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-0.5">
              {profile.email}
            </p>
            <span
              className={`inline-block text-xs px-3 py-1 rounded-full font-medium mt-2 ${roleBg[role] || roleBg.admin}`}
            >
              {roleLabel[role] || "Admin"}
            </span>
          </div>

          {/* Info list */}
          <div className="w-full flex flex-col gap-3 pt-4 border-t border-light-border dark:border-dark-border">
            {[
              { icon: Phone, label: profile.phone },
              { icon: MapPin, label: profile.address },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm text-light-text-secondary dark:text-dark-text-secondary"
              >
                <item.icon
                  size={15}
                  className="text-light-text-tertiary dark:text-dark-text-tertiary shrink-0"
                />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Tabs */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Tab buttons */}
          <div className="flex gap-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-1.5">
            {[
              { id: "profile", label: "Edit Profile", icon: User },
              { id: "password", label: "Change Password", icon: Lock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                  activeTab === tab.id
                    ? "bg-accent text-white"
                    : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Edit Profile tab */}
          {activeTab === "profile" && (
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6">
              <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-5">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
                    />
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
                    />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
                    />
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
                    />
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                {/* Role — read only */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    Role
                  </label>
                  <input
                    type="text"
                    value={roleLabel[role] || "Admin"}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-lg bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border text-light-text-tertiary dark:text-dark-text-tertiary text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                className={`mt-6 flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium rounded-lg transition-colors ${
                  saved ? "bg-green-500" : "bg-accent hover:bg-accent-hover"
                }`}
              >
                <Save size={15} />
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          )}

          {/* Change Password tab */}
          {activeTab === "password" && (
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6">
              <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-5">
                Change Password
              </h3>

              {passError && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                  {passError}
                </div>
              )}

              <div className="flex flex-col gap-4">
                {[
                  {
                    label: "Current Password",
                    key: "old",
                    show: showOld,
                    toggle: setShowOld,
                  },
                  {
                    label: "New Password",
                    key: "new",
                    show: showNew,
                    toggle: setShowNew,
                  },
                  {
                    label: "Confirm Password",
                    key: "confirm",
                    show: showConfirm,
                    toggle: setShowConfirm,
                  },
                ].map((field) => (
                  <div key={field.key} className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      {field.label}
                    </label>
                    <div className="relative">
                      <Lock
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
                      />
                      <input
                        type={field.show ? "text" : "password"}
                        value={passwords[field.key]}
                        onChange={(e) =>
                          setPasswords((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => field.toggle((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
                      >
                        {field.show ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleChangePassword}
                className={`mt-6 flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium rounded-lg transition-colors ${
                  passSaved ? "bg-green-500" : "bg-accent hover:bg-accent-hover"
                }`}
              >
                <Lock size={15} />
                {passSaved ? "Password Changed!" : "Change Password"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
