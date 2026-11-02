import StarRating from "./../common/StarRating";
import LoadingSpinner from "../LoadingSpinner";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to limit words in testimonial text
  const limitWords = (text, limit = 40) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        // Fetch reviews and stats in parallel
        const [reviewsResponse, statsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/google-reviews.php`),
          fetch(`${API_BASE_URL}/google-reviews.php?stats=1`),
        ]);

        if (!reviewsResponse.ok || !statsResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const reviewsData = await reviewsResponse.json();
        const statsData = await statsResponse.json();

        if (reviewsData.success && statsData.success) {
          // Map Google Reviews data to testimonials format
          const mappedTestimonials = reviewsData.data.map((review) => ({
            name: review.author || "Anonymous",
            rating: review.rating || 5,
            text: review.review_text || review.text || "",
            package: "Google Review",
            review_time: review.review_time,
            id: review.id,
          }));

          // Sort testimonials to prioritize reviews with more text content
          // First by text length (descending), then by rating (descending), then by time (descending)
          const sortedTestimonials = mappedTestimonials.sort((a, b) => {
            const aTextLength = (a.text || "").length;
            const bTextLength = (b.text || "").length;

            // Primary sort: Text length (longer reviews first)
            if (aTextLength !== bTextLength) {
              return bTextLength - aTextLength;
            }

            // Secondary sort: Rating (higher ratings first)
            if (a.rating !== b.rating) {
              return b.rating - a.rating;
            }

            // Tertiary sort: Time (newer reviews first)
            return new Date(b.review_time) - new Date(a.review_time);
          });

          setTestimonials(sortedTestimonials);
          setStats(statsData.data);
        } else {
          throw new Error(
            reviewsData.message || statsData.message || "Failed to load reviews"
          );
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.message);

        // Fallback to static testimonials if API fails
        const fallbackTestimonials = [
          {
            name: "Sarah J.",
            package: "Annual Health Checkup",
            rating: 5,
            text: "For the first time, I wasn't intimidated by my lab results. Certus Diagnostics gave me a summary that I could actually understand and use. The lifestyle suggestions were a game-changer.",
          },
          {
            name: "Michael B.",
            package: "Diabetic Care Package",
            rating: 5,
            text: "The report was fantastic. It didn't just show numbers; it explained what they meant for me and suggested probable causes. It felt like a consultation, not just a report.",
          },
          {
            name: "Emily R.",
            package: "Women's Wellness Panel",
            rating: 5,
            text: "Booking was easy, the sample collection was professional, and the report was the clearest I've ever received. Highly recommend for anyone who wants to take control of their health.",
          },
        ];

        // Sort fallback testimonials by text length as well
        const sortedFallbackTestimonials = fallbackTestimonials.sort((a, b) => {
          return (b.text || "").length - (a.text || "").length;
        });

        setTestimonials(sortedFallbackTestimonials);
        setStats({ average_rating: 5.0, total_reviews: 3 });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []); // Remove testimonials from dependency array to prevent infinite loop

  // We duplicate the testimonials to create a seamless, infinite loop
  // The sorted order (longest text first) is maintained in the duplication
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  if (loading) {
    return (
      <section id="testimonials" className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            What Our Patients Say
          </h2>
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner
              size="large"
              color="white"
              text="Loading reviews..."
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            What Our Patients Say
          </h2>
          {stats && (
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="flex items-center">
                <StarRating rating={Math.round(stats.average_rating)} />
                <span className="ml-2 text-xl font-semibold text-white">
                  {stats.average_rating.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-400">
                Based on {stats.total_reviews} Google{" "}
                {stats.total_reviews === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
          {error && (
            <p className="text-yellow-400 text-sm">
              Showing cached reviews (Live reviews temporarily unavailable)
            </p>
          )}
        </div>
        {/* Marquee container with a gradient fade on the edges */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          }}
        >
          {/* The animated track */}
          <div className="flex animate-marquee hover:pause">
            {duplicatedTestimonials.map((testimonial, index) => (
              // Each review box
              <div
                key={index}
                className="flex-shrink-0 w-full md:w-[28rem] p-4"
              >
                <div className="bg-slate-800/40 p-8 rounded-xl shadow-lg h-full flex flex-col justify-between">
                  <div>
                    <div className="mb-4">
                      <StarRating rating={testimonial.rating} />
                    </div>
                    <p className="text-gray-300 mb-6 italic">
                      "{limitWords(testimonial.text, 40)}"
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {testimonial.package}
                    </p>
                    {testimonial.review_time && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(testimonial.review_time).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
