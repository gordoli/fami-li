import { mockTripRepository } from "@fami-li/data";
import { FamilyAlbum } from "@/components/family-album";
export default async function Home() {
  const trips = await mockTripRepository.list();
  return <FamilyAlbum trips={trips} />;
}
