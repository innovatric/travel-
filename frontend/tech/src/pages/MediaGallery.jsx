import S3ImageGallery from '../components/common/S3ImageGallery';

/**
 * MediaGallery page – quick visual access to all bucket folders.
 *
 * Routes: /media/:category?
 *   e.g. /media/hotel   → Shows hotel images
 *        /media      → Shows a selector for all categories.
 */
export default function MediaGallery({ params }) {
  const category = params?.category ?? null; // react-router v6 style

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {category ? (
        <S3ImageGallery
          category={category}
          title={`Images for ${category}`}
          allowUpload={true}
          maxCols={3}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {['hotel','destination','attraction','restaurant','profile','itinerary'].map((cat) => (
            <S3ImageGallery
              key={cat}
              category={cat}
              title={`🖼️ ${cat.charAt(0).toUpperCase()+cat.slice(1)} Gallery`}
              allowUpload={true}
              maxCols={2}
            />
          ))}
        </div>
      )}
    </div>
  );
}
