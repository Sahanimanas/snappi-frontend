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
import { useTheme } from "next-themes";
import { 
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Smartphone,
  Mail,
  Eye,
  Lock,
  Trash2,
  MoreHorizontal
} from "lucide-react";

export const Settings = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-3xl bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
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
                    <div className="h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                      JD
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" onClick={() => console.log('Changing avatar...')}>Change Avatar</Button>
                      <p className="text-sm text-muted-foreground">
                        JPG, GIF or PNG. 1MB max.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" defaultValue="Acme Inc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" defaultValue="https://acme.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea 
                      id="bio" 
                      className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                      defaultValue="Marketing professional focused on influencer partnerships and brand collaborations."
                    />
                  </div>

                  <Button onClick={() => console.log('Saving profile changes...')}>Save Changes</Button>
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

            <TabsContent value="notifications" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch defaultChecked onChange={(checked) => console.log('Email notifications:', checked)} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Campaign Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about campaign status changes
                        </p>
                      </div>
                      <Switch defaultChecked onChange={(checked) => console.log('Campaign updates:', checked)} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Influencer Applications</Label>
                        <p className="text-sm text-muted-foreground">
                          New applications from influencers
                        </p>
                      </div>
                      <Switch defaultChecked onChange={(checked) => console.log('Influencer applications:', checked)} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive weekly performance summaries
                        </p>
                      </div>
                      <Switch onChange={(checked) => console.log('Weekly reports:', checked)} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Marketing Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Product updates and tips
                        </p>
                      </div>
                      <Switch onChange={(checked) => console.log('Marketing updates:', checked)} />
                    </div>
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
                      <Label>Current Password</Label>
                      <Input type="password" placeholder="Enter current password" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" placeholder="Confirm new password" />
                    </div>
                    <Button onClick={() => console.log('Updating password...')}>Update Password</Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                       <Button variant="outline" onClick={() => console.log('Enabling 2FA...')}>
                         <Lock className="h-4 w-4 mr-2" />
                         Enable 2FA
                       </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Login Sessions</Label>
                        <p className="text-sm text-muted-foreground">
                          Manage your active sessions
                        </p>
                      </div>
                       <Button variant="outline" onClick={() => console.log('Viewing active sessions...')}>
                         <Eye className="h-4 w-4 mr-2" />
                         View Sessions
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Billing & Subscription</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 border rounded-lg bg-primary/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Pro Plan</h3>
                        <p className="text-sm text-muted-foreground">
                          $199/month • Next billing: March 15, 2024
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => console.log('Managing plan...')}>Manage Plan</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Payment Method</Label>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-12 bg-gray-900 rounded text-white text-xs flex items-center justify-center">
                            ****
                          </div>
                          <div>
                            <p className="font-medium">**** **** **** 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/25</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => console.log('Editing payment method...')}>Edit</Button>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => console.log('Adding payment method...')}>Add Payment Method</Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Billing History</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Pro Plan</p>
                          <p className="text-sm text-muted-foreground">Feb 15, 2024</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$199.00</p>
                          <Button variant="ghost" size="sm" onClick={() => console.log('Downloading invoice...')}>Download</Button>
                        </div>
                      </div>
                    </div>
                  </div>
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
                      <Switch defaultChecked onChange={(checked) => console.log('Auto-save drafts:', checked)} />
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
                        <Button variant="destructive" onClick={() => console.log('Confirming account deletion...')}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};