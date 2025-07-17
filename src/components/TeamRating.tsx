
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRatings } from "@/hooks/useRatings";

interface TeamRatingProps {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
}

const TeamRating = ({ projectId, projectTitle, onClose }: TeamRatingProps) => {
  const { toast } = useToast();
  const { getProjectTeammates, submitRating, checkExistingRating } = useRatings();
  const [teammates, setTeammates] = useState([]);
  const [ratings, setRatings] = useState({});
  const [feedback, setFeedback] = useState({});
  const [existingRatings, setExistingRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    loadTeammates();
  }, [projectId]);

  const loadTeammates = async () => {
    console.log('🔄 Loading teammates for project:', projectId);
    setDebugInfo('Loading teammates...');
    setLoading(true);
    
    try {
      const teammatesList = await getProjectTeammates(projectId);
      console.log('✅ Received teammates:', teammatesList);
      setTeammates(teammatesList);
      
      if (teammatesList.length === 0) {
        setDebugInfo('No teammates found. You need to be either the project owner or an approved team member to rate teammates.');
      } else {
        setDebugInfo(`Found ${teammatesList.length} teammate(s) to rate`);
      }

      // Check for existing ratings
      const existingData = {};
      for (const teammate of teammatesList) {
        const existing = await checkExistingRating(projectId, teammate.id);
        if (existing) {
          existingData[teammate.id] = existing;
          setRatings(prev => ({ ...prev, [teammate.id]: existing.rating }));
          setFeedback(prev => ({ ...prev, [teammate.id]: existing.feedback || '' }));
        }
      }
      setExistingRatings(existingData);
    } catch (error) {
      console.error('❌ Error loading teammates:', error);
      setDebugInfo(`Error loading teammates: ${error.message}`);
      toast({
        title: "Error loading teammates",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (teammateId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [teammateId]: rating }));
  };

  const handleFeedbackChange = (teammateId: string, feedbackText: string) => {
    setFeedback(prev => ({ ...prev, [teammateId]: feedbackText }));
  };

  const handleSubmitRating = async (teammateId: string) => {
    const rating = ratings[teammateId];
    const feedbackText = feedback[teammateId];

    if (!rating) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await submitRating(projectId, teammateId, rating, feedbackText);
      toast({
        title: "Rating submitted!",
        description: "Thank you for rating your teammate.",
      });
      
      // Reload to update existing ratings
      await loadTeammates();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error submitting rating",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (teammateId: string) => {
    const currentRating = ratings[teammateId] || 0;
    const isExistingRating = existingRatings[teammateId];
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !isExistingRating && handleRatingChange(teammateId, star)}
            disabled={isExistingRating || submitting}
            className={`p-1 rounded ${!isExistingRating ? 'hover:bg-gray-100' : 'cursor-not-allowed'}`}
          >
            <Star
              className={`w-6 h-6 ${
                star <= currentRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span>Loading teammates...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Rate Your Teammates
          <Button
            variant="outline"
            size="sm"
            onClick={loadTeammates}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
        <p className="text-muted-foreground">Project: {projectTitle}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {teammates.length === 0 ? (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center py-4">
              No teammates available to rate.
            </p>
            <div className="text-sm text-muted-foreground space-y-2 bg-gray-50 p-4 rounded-lg">
              <p><strong>Debug info:</strong></p>
              <p>Project ID: {projectId}</p>
              <p>Status: {debugInfo}</p>
              <p><strong>To rate teammates, you must be:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>The project owner with approved team members, OR</li>
                <li>An approved team member of this project</li>
              </ul>
              <p className="text-xs mt-2">
                Make sure applications are approved in the Dashboard before trying to rate teammates.
              </p>
            </div>
          </div>
        ) : (
          teammates.map((teammate) => {
            const isExistingRating = existingRatings[teammate.id];
            
            return (
              <div key={teammate.id} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar>
                    <AvatarFallback>
                      {teammate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{teammate.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {teammate.role}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Rating {isExistingRating && "(Already submitted)"}
                    </label>
                    {renderStars(teammate.id)}
                  </div>

                  <div>
                    <label htmlFor={`feedback-${teammate.id}`} className="text-sm font-medium mb-2 block">
                      Feedback (Optional)
                    </label>
                    <Textarea
                      id={`feedback-${teammate.id}`}
                      placeholder="Share your experience working with this teammate..."
                      value={feedback[teammate.id] || ''}
                      onChange={(e) => handleFeedbackChange(teammate.id, e.target.value)}
                      disabled={isExistingRating || submitting}
                      className="min-h-[80px]"
                    />
                  </div>

                  {!isExistingRating && (
                    <Button
                      onClick={() => handleSubmitRating(teammate.id)}
                      disabled={submitting || !ratings[teammate.id]}
                      className="w-full"
                    >
                      {submitting ? 'Submitting...' : 'Submit Rating'}
                    </Button>
                  )}

                  {isExistingRating && (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ Rating submitted on {new Date(isExistingRating.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}

        <Button variant="outline" onClick={onClose} className="w-full">
          Close
        </Button>
      </CardContent>
    </Card>
  );
};

export default TeamRating;
