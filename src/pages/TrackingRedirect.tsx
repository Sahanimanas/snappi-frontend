// src/pages/TrackingRedirect.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const TrackingRedirect = () => {
  const { campaignSlug, trackingCode } = useParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const recordClickAndRedirect = async () => {
      try {
        // Call backend to record click and get destination URL
        const response = await fetch(`${API_BASE_URL}/tracking-links/click/${trackingCode}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            referrer: document.referrer,
            userAgent: navigator.userAgent,
          }),
        });

        const data = await response.json();

        if (data.success && data.destinationUrl) {
          // Redirect to destination URL
          window.location.href = data.destinationUrl;
        } else if (data.success && !data.destinationUrl) {
          // Link exists but no destination URL set
          setError('This campaign link does not have a destination URL configured yet.');
        } else {
          // Try fetching by code if POST doesn't work
          const getResponse = await fetch(`${API_BASE_URL}/tracking-links/code/${trackingCode}`);
          const getData = await getResponse.json();

          if (getData.success && getData.data?.destinationUrl) {
            window.location.href = getData.data.destinationUrl;
          } else if (getData.success && !getData.data?.destinationUrl) {
            setError('This campaign link does not have a destination URL configured yet.');
          } else {
            setError('This link is invalid or has expired.');
          }
        }
      } catch (err) {
        console.error('Tracking redirect error:', err);
        setError('Unable to process this link. Please try again.');
      }
    };

    if (trackingCode) {
      recordClickAndRedirect();
    }
  }, [trackingCode]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
      <p className="text-gray-600">Redirecting...</p>
    </div>
  );
};

export default TrackingRedirect;