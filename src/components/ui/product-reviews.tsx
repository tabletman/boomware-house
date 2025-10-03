'use client';

/**
 * Product Reviews Component
 * Displays customer reviews with static data (Shopify integration ready)
 */

import { useState } from 'react';
import { Star, ThumbsUp, VerifiedIcon } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Progress } from './progress';

interface Review {
  id: string;
  author: string;
  rating: 5 | 4 | 3 | 2 | 1;
  date: string;
  verified: boolean;
  title: string;
  content: string;
  helpful: number;
  condition?: 'Grade A' | 'Grade B' | 'Grade C' | 'Grade D';
}

interface ProductReviewsProps {
  productId: string;
  className?: string;
}

// Static reviews data (would be replaced with Shopify/API data)
const mockReviews: Record<string, Review[]> = {
  // Default reviews for demo
  default: [
    {
      id: '1',
      author: 'John D.',
      rating: 5,
      date: '2025-01-15',
      verified: true,
      title: 'Excellent condition!',
      content: 'Product arrived exactly as described. Grade B was better than expected with minimal wear. Great value!',
      helpful: 12,
      condition: 'Grade B',
    },
    {
      id: '2',
      author: 'Sarah M.',
      rating: 4,
      date: '2025-01-10',
      verified: true,
      title: 'Good deal',
      content: 'Works perfectly. Minor scratches as expected for Grade C. Warranty gives peace of mind.',
      helpful: 8,
      condition: 'Grade C',
    },
    {
      id: '3',
      author: 'Mike R.',
      rating: 5,
      date: '2025-01-05',
      verified: false,
      title: 'Fast shipping',
      content: 'Quick local pickup. Staff was helpful explaining the condition grading.',
      helpful: 5,
    },
  ],
};

export function ProductReviews({ productId, className = '' }: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');

  // Get reviews for this product (fallback to default)
  const reviews = mockReviews[productId] || mockReviews.default;

  // Calculate rating summary
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;
  const ratingCounts = [5, 4, 3, 2, 1].map(rating =>
    reviews.filter(r => r.rating === rating).length
  );

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    if (sortBy === 'rating') return b.rating - a.rating;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Average Rating */}
        <div className="text-center md:text-left">
          <div className="text-5xl font-bold">{averageRating.toFixed(1)}</div>
          {renderStars(Math.round(averageRating), 'lg')}
          <p className="text-sm text-muted-foreground mt-2">
            Based on {totalReviews} reviews
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="md:col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((rating, idx) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              </div>
              <Progress
                value={(ratingCounts[idx] / totalReviews) * 100}
                className="flex-1 h-2"
              />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {ratingCounts[idx]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">All Reviews ({totalReviews})</h3>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'recent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('recent')}
          >
            Most Recent
          </Button>
          <Button
            variant={sortBy === 'helpful' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('helpful')}
          >
            Most Helpful
          </Button>
          <Button
            variant={sortBy === 'rating' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('rating')}
          >
            Highest Rating
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{review.author}</span>
                    {review.verified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <VerifiedIcon className="h-3 w-3 mr-1" />
                        Verified Purchase
                      </Badge>
                    )}
                    {review.condition && (
                      <Badge variant="outline">{review.condition}</Badge>
                    )}
                  </div>
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <h4 className="font-semibold mb-2">{review.title}</h4>
              <p className="text-muted-foreground mb-4">{review.content}</p>

              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({review.helpful})
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Write Review CTA */}
      <div className="mt-8 p-6 bg-muted rounded-lg text-center">
        <h3 className="font-semibold mb-2">Share Your Experience</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Help others make informed decisions by writing a review
        </p>
        <Button>Write a Review</Button>
      </div>
    </div>
  );
}
