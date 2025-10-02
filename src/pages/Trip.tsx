import EventCard from '@/components/EventCard';
import PoiCard from '@/components/PoiCard';
import PhotoGrid from '@/components/PhotoGrid';

export default function Trip() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Your Trip</h1>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <EventCard />
        <PoiCard />
        <PhotoGrid />
      </section>
    </div>
  );
}



