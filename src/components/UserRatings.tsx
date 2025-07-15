
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useRatings } from "@/hooks/useRatings";

interface UserRatingsProps {
  userId: string;
  userName?: string;
  showTitle?: boolean;
}

const UserRatings = ({ userId, userName, showTitle = true }: UserRatingsProps) => {
  const { fetchUserRatings, fetchUserStats } = useRatings();
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserRatings();
  }, [userId]);

  const loadUserRatings = async () => {
    try {
      const [ratingsData, statsData] = await Promise.all([
        fetchUserRatings(userId),
        fetchUserStats(userId)
      ]);
      
      setRatings(ratingsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading user ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.total_ratings === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          {showTitle && <CardTitle>Ratings & Reviews</CardTitle>}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No ratings received yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        {showTitle && <CardTitle>Ratings & Reviews</CardTitle>}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.average_rating}</div>
            <div className="flex justify-center mb-1">
              {renderStars(Math.round(stats.average_rating))}
            </div>
            <div className="text-sm text-muted-foreground">
              {stats.total_ratings} review{stats.total_ratings !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="flex-1 space-y-2 w-full sm:w-auto">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats[`${['', 'one', 'two', 'three', 'four', 'five'][rating]}_star_count`] || 0;
              const percentage = stats.total_ratings > 0 ? (count / stats.total_ratings) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-3">{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="space-y-4">
          <h4 className="font-medium">Recent Reviews</h4>
          {ratings.slice(0, 5).map((rating) => (
            <div key={rating.id} className="border-l-4 border-blue-200 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {renderStars(rating.rating)}
                  <span className="text-sm text-muted-foreground">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </span>
                </div>
                {rating.projects?.title && (
                  <Badge variant="outline" className="text-xs">
                    {rating.projects.title}
                  </Badge>
                )}
              </div>
              {rating.feedback && (
                <p className="text-sm text-gray-700">{rating.feedback}</p>
              )}
            </div>
          ))}
          
          {ratings.length > 5 && (
            <p className="text-sm text-muted-foreground text-center">
              And {ratings.length - 5} more review{ratings.length - 5 !== 1 ? 's' : ''}...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRatings;
