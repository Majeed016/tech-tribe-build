import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useApplications } from "@/hooks/useApplications";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string; // Make this required instead of optional
    title: string;
    author: {
      name: string;
    };
    skills: string[];
    rolesNeeded: string[];
  };
}

const ApplicationModal = ({ isOpen, onClose, project }: ApplicationModalProps) => {
  const { toast } = useToast();
  const { createApplication } = useApplications();
  const [selectedRole, setSelectedRole] = useState("");
  const [message, setMessage] = useState("");
  const [githubProfile, setGithubProfile] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('ApplicationModal project:', project);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "You must select which role you're applying for.",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Please add an application message",
        description: "Tell the project owner why you're interested.",
        variant: "destructive",
      });
      return;
    }

    if (!project.id) {
      console.error('Project ID is missing:', project);
      toast({
        title: "Project ID missing",
        description: "Cannot submit application without project ID. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting application for project ID:', project.id);
      await createApplication({
        project_id: project.id,
        role: selectedRole,
        message: message.trim(),
        github_profile: githubProfile,
        portfolio_link: portfolioLink,
      });

      toast({
        title: "Application submitted!",
        description: "Your application has been sent to the project owner.",
      });

      // Reset form
      setSelectedRole("");
      setMessage("");
      setGithubProfile("");
      setPortfolioLink("");
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error submitting application",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply to Join Project</DialogTitle>
          <DialogDescription>
            Applying for: <span className="font-medium">{project.title}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role You're Applying For</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {project.rolesNeeded.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Application Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the project owner why you're interested and what skills you bring..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github">GitHub Profile (Optional)</Label>
            <Input
              id="github"
              type="url"
              value={githubProfile}
              onChange={(e) => setGithubProfile(e.target.value)}
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio">Resume/Portfolio Link (Optional)</Label>
            <Input
              id="portfolio"
              type="url"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              placeholder="https://yourportfolio.com or drive.google.com/..."
            />
          </div>

          <div className="bg-muted p-3 rounded-lg text-sm">
            <h4 className="font-medium mb-1">Project Details</h4>
            <p><span className="font-medium">Author:</span> {project.author.name}</p>
            <p><span className="font-medium">Required Skills:</span> {project.skills.join(", ")}</p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
