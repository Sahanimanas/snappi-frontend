import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings, User, Shield, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const articles = [
  {
    title: "Profile Setup and Management",
    content: `Configure your account profile for optimal platform experience and professional presentation to potential influencer partners.

**Complete Profile Setup:**

**1. Basic Information**
- Company name and description
- Primary contact information
- Business registration details
- Tax identification numbers
- Professional website and social links

**2. Brand Identity**
- Upload high-quality logo (PNG, minimum 300x300px)
- Brand color palette selection
- Voice and tone guidelines
- Mission and values statement
- Target audience descriptions

**3. Communication Preferences**
- Preferred communication channels
- Response time expectations
- Language and timezone settings
- Professional signature templates
- Contact availability schedules

**Profile Optimization Tips:**

**Visual Branding**
- Consistent logo usage across all communications
- Professional cover images for campaign briefs
- Brand guideline document uploads
- Style guide accessibility for influencers

**Professional Presentation**
- Clear and concise company descriptions
- Achievement and credential highlights
- Previous campaign success showcases
- Team member introductions and roles

**Contact Information Management**
- Multiple contact method setup
- Emergency contact procedures
- International communication protocols
- Automated response configurations`,
    category: "Profile",
    readTime: "6 min read"
  },
  {
    title: "Privacy and Security Settings",
    content: `Protect your account and data with comprehensive security measures and privacy controls designed for business account protection.

**Security Configuration:**

**1. Authentication Security**
- Two-factor authentication (2FA) setup
- Strong password requirements
- Login notification settings
- Device management and recognition
- Session timeout configurations

**2. Data Protection**
- Personal information visibility controls
- Campaign data access restrictions
- Influencer communication privacy
- Financial information security
- Export and backup permissions

**3. Account Access Management**
- Team member role assignments
- Permission level configurations
- Activity monitoring and logging
- Suspicious activity alerts
- Account recovery procedures

**Privacy Controls:**

**Public Profile Settings**
- Information visibility to influencers
- Search result appearance options
- Contact information display preferences
- Campaign history visibility controls

**Communication Privacy**
- Message encryption preferences
- Communication history retention
- Third-party integration permissions
- Data sharing consent management

**Advanced Security Features:**
- IP address restrictions
- API access controls
- Webhook security configurations
- Audit trail maintenance
- Compliance reporting tools`,
    category: "Security",
    readTime: "8 min read"
  },
  {
    title: "Notification Management",
    content: `Customize your notification preferences to stay informed about important activities while maintaining productivity and focus.

**Notification Categories:**

**1. Campaign Updates**
- New influencer applications
- Content submission notifications
- Performance milestone alerts
- Budget threshold warnings
- Campaign completion confirmations

**2. Communication Alerts**
- New message notifications
- Mention and tag alerts
- Collaboration request notifications
- Contract status updates
- Payment confirmation notices

**3. System Notifications**
- Account security alerts
- Feature update announcements
- Maintenance schedule notifications
- Billing and subscription reminders
- Platform status updates

**Delivery Preferences:**

**Channel Configuration**
- Email notification settings
- In-app notification controls
- Mobile push notification preferences
- SMS alert configurations
- Slack and integration notifications

**Timing Controls**
- Business hours notification scheduling
- Do-not-disturb time periods
- Weekend and holiday preferences
- Timezone adjustment settings
- Urgent vs. standard notification prioritization

**Notification Customization:**
- Keyword-based filtering
- Priority level assignments
- Frequency limitation settings
- Batch notification options
- Summary digest scheduling`,
    category: "Notifications",
    readTime: "5 min read"
  },
  {
    title: "Team Management and Permissions",
    content: `Efficiently manage team members and control access permissions to maintain security while enabling collaborative workflow.

**Team Structure Setup:**

**1. Role Definitions**
- Administrator: Full account access and management
- Manager: Campaign creation and influencer management
- Analyst: Performance monitoring and reporting access
- Coordinator: Communication and scheduling responsibilities
- Viewer: Read-only access to campaigns and performance

**2. Permission Matrix**
- Campaign creation and editing rights
- Influencer contact and communication permissions
- Budget approval and payment processing access
- Report generation and data export capabilities
- Account settings and security configuration rights

**3. Access Controls**
- Feature-specific permissions
- Campaign-level access restrictions
- Time-limited access provisions
- IP address and location restrictions
- Device authentication requirements

**Collaboration Features:**

**Team Communication**
- Internal messaging and commenting systems
- Task assignment and tracking capabilities
- Shared calendar and scheduling tools
- Project timeline and milestone tracking
- File sharing and document collaboration

**Workflow Management**
- Approval process configurations
- Review and sign-off procedures
- Quality control checkpoint setup
- Escalation and notification protocols
- Performance evaluation frameworks

**Team Performance Monitoring:**
- Individual activity tracking
- Productivity metrics and reporting
- Goal setting and achievement tracking
- Training and development recommendations
- Team collaboration effectiveness analysis`,
    category: "Team Management",
    readTime: "9 min read"
  }
];

export const AccountSettings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Link to="/help">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Help Center
                </Button>
              </Link>
            </div>
            
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Settings className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text font-bold">Account Settings</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Manage your account preferences, security settings, and team permissions for optimal platform experience.
              </p>
            </div>
          </div>

          {/* Settings Categories */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="shadow-card text-center p-4">
              <User className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Profile Setup</h3>
            </Card>
            <Card className="shadow-card text-center p-4">
              <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Security & Privacy</h3>
            </Card>
            <Card className="shadow-card text-center p-4">
              <Bell className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Notifications</h3>
            </Card>
            <Card className="shadow-card text-center p-4">
              <Settings className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Team Management</h3>
            </Card>
          </div>

          {/* Articles */}
          <div className="space-y-6">
            {articles.map((article, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{article.readTime}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {article.content.split('\n').map((paragraph, pIndex) => {
                      if (paragraph.startsWith('**') && paragraph.endsWith('**') && paragraph.length > 4) {
                        return (
                          <h3 key={pIndex} className="text-lg font-semibold mt-4 mb-2">
                            {paragraph.replace(/\*\*/g, '')}
                          </h3>
                        );
                      }
                      if (paragraph.match(/^\d+\./)) {
                        return <p key={pIndex} className="font-medium mb-2">{paragraph}</p>;
                      }
                      if (paragraph.startsWith('-')) {
                        return (
                          <div key={pIndex} className="flex items-start space-x-2 mb-1 ml-4">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{paragraph.substring(1).trim()}</p>
                          </div>
                        );
                      }
                      if (paragraph.trim()) {
                        return <p key={pIndex} className="mb-3 text-sm leading-relaxed">{paragraph}</p>;
                      }
                      return null;
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="shadow-card bg-primary/5">
            <CardHeader>
              <CardTitle>Quick Settings Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/settings">
                  <Button className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Access Settings
                  </Button>
                </Link>
                <Link to="/help/billing-pricing">
                  <Button variant="outline" className="w-full justify-start">
                    Billing & Pricing Help
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};