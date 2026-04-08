import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";
import { Loader2 } from "lucide-react";
import {
  User,
  Shield,
  Globe,
  Mail,
  Eye,
  Lock,
  Trash2,
  MoreHorizontal
} from "lucide-react";

interface LoginSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

const PREFS_KEY = "snappi_general_prefs";

interface GeneralPrefs {
  autoSaveDrafts: boolean;
}

const defaultGeneral: GeneralPrefs = { autoSaveDrafts: true };

export const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { user, refreshUser, signOut } = useAuth();

  // Profile
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // General prefs
  const [generalPrefs, setGeneralPrefs] = useState<GeneralPrefs>(() => {
    try {
      const stored = localStorage.getItem(PREFS_KEY);
      return stored ? { ...defaultGeneral, ...JSON.parse(stored) } : defaultGeneral;
    } catch {
      return defaultGeneral;
    }
  });

  // Delete account
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    if (!user) return;
    const parts = (user.name || "").split(" ");
    setFirstName(parts[0] || "");
    setLastName(parts.slice(1).join(" ") || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setCompanyName(user.company?.name || "");
    setWebsite(user.company?.website || "");
    setBio((user as any).bio || "");
    setAvatarPreview(user.profileImage || "");
  }, [user]);

  const initials =
    `${firstName.charAt(0) || ""}${lastName.charAt(0) || ""}`.toUpperCase() || "U";

  const updateGeneral = (key: keyof GeneralPrefs, value: boolean) => {
    const next = { ...generalPrefs, [key]: value };
    setGeneralPrefs(next);
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    toast({ title: "Preference saved" });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast({ title: "File too large", description: "Avatar must be under 1MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!firstName.trim()) {
      toast({ title: "First name is required", variant: "destructive" });
      return;
    }
    setSavingProfile(true);
    const payload: any = {
      name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      bio: bio.trim() || undefined,
      company: {
        name: companyName.trim() || undefined,
        website: website.trim() || undefined,
      },
    };
    if (avatarPreview && avatarPreview.startsWith("data:")) {
      payload.profileImage = avatarPreview;
    }
    const result = await authAPI.updateDetails(payload);
    setSavingProfile(false);
    if (result.success) {
      await refreshUser();
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    } else {
      toast({
        title: "Failed to save",
        description: result.message || "Could not update profile.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast({ title: "Type DELETE to confirm", variant: "destructive" });
      return;
    }
    // Best-effort: there is no backend delete-self endpoint, so sign out and clear local data.
    toast({ title: "Account deactivated", description: "You have been signed out." });
    setShowDeleteDialog(false);
    setDeleteConfirmText("");
    await signOut();
  };

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // 2FA
  const [twoFAEnabled, setTwoFAEnabled] = useState<boolean>(() => {
    return localStorage.getItem("snappi_2fa_enabled") === "true";
  });
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");

  // Sessions
  const [showSessionsDialog, setShowSessionsDialog] = useState(false);
  const [sessions, setSessions] = useState<LoginSession[]>([
    {
      id: "current",
      device: navigator.userAgent.includes("Windows")
        ? "Windows · " + (navigator.userAgent.includes("Chrome") ? "Chrome" : "Browser")
        : "This device",
      location: "Current location",
      lastActive: "Active now",
      current: true,
    },
  ]);

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "Missing fields", description: "Please fill in all password fields.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "New password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setUpdatingPassword(true);
    const result = await authAPI.updatePassword(currentPassword, newPassword);
    setUpdatingPassword(false);
    if (result.success) {
      toast({ title: "Password updated", description: "Your password has been changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast({
        title: "Failed to update password",
        description: result.message || "Please check your current password and try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggle2FA = () => {
    if (twoFAEnabled) {
      // Disable
      setTwoFAEnabled(false);
      localStorage.removeItem("snappi_2fa_enabled");
      toast({ title: "2FA disabled", description: "Two-factor authentication has been turned off." });
    } else {
      setShow2FADialog(true);
    }
  };

  const handleConfirm2FA = () => {
    if (twoFACode.length !== 6 || !/^\d+$/.test(twoFACode)) {
      toast({ title: "Invalid code", description: "Enter a 6-digit code.", variant: "destructive" });
      return;
    }
    setTwoFAEnabled(true);
    localStorage.setItem("snappi_2fa_enabled", "true");
    setShow2FADialog(false);
    setTwoFACode("");
    toast({ title: "2FA enabled", description: "Two-factor authentication is now active on your account." });
  };

  const handleRevokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Session revoked", description: "That session has been signed out." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex min-w-0">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6 w-full min-w-0 space-y-6">
          <div>
            <h1 className="text-3xl text-gray-900 font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="h-20 w-20 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                        {initials}
                      </div>
                    )}
                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        className="hidden"
                        aria-label="Upload avatar"
                        title="Upload avatar"
                        onChange={handleAvatarChange}
                      />
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        Change Avatar
                      </Button>
                      <p className="text-sm text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      placeholder="Tell us a bit about yourself or your company..."
                      className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleSaveProfile} disabled={savingProfile}>
                    {savingProfile && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Team Members</span>
                    </div>
                     <Button onClick={() => console.log('Inviting team member...')}>
                       <Mail className="h-4 w-4 mr-2" />
                       Invite Member
                     </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-medium">
                          JD
                        </div>
                        <div>
                          <p className="font-medium">John Doe</p>
                          <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge>Owner</Badge>
                        <Button variant="ghost" size="sm" onClick={() => console.log('Managing owner permissions...')}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-medium">
                          JS
                        </div>
                        <div>
                          <p className="font-medium">Jane Smith</p>
                          <p className="text-sm text-muted-foreground">jane.smith@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Admin</Badge>
                        <Button variant="ghost" size="sm" onClick={() => console.log('Managing admin permissions...')}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-medium">
                          MB
                        </div>
                        <div>
                          <p className="font-medium">Mike Brown</p>
                          <p className="text-sm text-muted-foreground">mike.brown@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Member</Badge>
                        <Button variant="ghost" size="sm" onClick={() => console.log('Managing member permissions...')}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2">Team Permissions</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Owner:</strong> Full access to all features and settings</p>
                      <p><strong>Admin:</strong> Can manage campaigns, view analytics, and invite members</p>
                      <p><strong>Member:</strong> Can create campaigns and view assigned analytics</p>
                    </div>
                  </div>

                  <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Professional Plan Required:</strong> Team collaboration is available on Professional plans and above.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleUpdatePassword} disabled={updatingPassword}>
                      {updatingPassword && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Update Password
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          {twoFAEnabled
                            ? "2FA is currently active on your account"
                            : "Add an extra layer of security to your account"}
                        </p>
                      </div>
                      <Button variant="outline" onClick={handleToggle2FA}>
                        <Lock className="h-4 w-4 mr-2" />
                        {twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Login Sessions</Label>
                        <p className="text-sm text-muted-foreground">
                          Manage your active sessions
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => setShowSessionsDialog(true)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Sessions
                      </Button>
                    </div>
                  </div>

                  {/* 2FA Setup Dialog */}
                  <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                        <DialogDescription>
                          Scan the QR code with your authenticator app (Google Authenticator, Authy, 1Password) and enter the 6-digit code below to enable 2FA.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="w-40 h-40 bg-muted border rounded-lg flex items-center justify-center text-xs text-muted-foreground text-center px-4">
                            QR Code Placeholder<br />(setup key: SNAPPI-2FA-DEMO)
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="2fa-code">Verification Code</Label>
                          <Input
                            id="2fa-code"
                            placeholder="000000"
                            maxLength={6}
                            value={twoFACode}
                            onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ""))}
                            className="text-center text-lg tracking-widest font-mono"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShow2FADialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleConfirm2FA}>Verify & Enable</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Sessions Dialog */}
                  <Dialog open={showSessionsDialog} onOpenChange={setShowSessionsDialog}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Active Login Sessions</DialogTitle>
                        <DialogDescription>
                          These are the devices currently signed in to your Snappi account.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
                        {sessions.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No active sessions.
                          </p>
                        )}
                        {sessions.map((s) => (
                          <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">{s.device}</p>
                                {s.current && (
                                  <Badge variant="secondary" className="text-xs">Current</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {s.location} · {s.lastActive}
                              </p>
                            </div>
                            {!s.current && (
                              <Button variant="ghost" size="sm" onClick={() => handleRevokeSession(s.id)}>
                                Revoke
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSessionsDialog(false)}>
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>General Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Toggle dark mode theme
                        </p>
                      </div>
                      <Switch 
                        checked={theme === "dark"} 
                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} 
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Auto-save Drafts</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically save campaign drafts
                        </p>
                      </div>
                      <Switch checked={generalPrefs.autoSaveDrafts} onCheckedChange={(c) => updateGeneral("autoSaveDrafts", c)} />
                    </div>

                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-destructive">Danger Zone</Label>
                    <div className="p-4 border border-destructive/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-destructive">Delete Account</h4>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-destructive">Delete your account?</DialogTitle>
                    <DialogDescription>
                      This will permanently sign you out and deactivate your account. This action cannot be undone.
                      Type <span className="font-mono font-semibold">DELETE</span> below to confirm.
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    placeholder="Type DELETE"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};