import Header from "../../components/Header";
import LatestReleaseSection from "@/components/LatestReleaseSection";

export default function MusicPage() {
  return (
    <main className="relative bg-black">
      <Header variant="dark" />
      <LatestReleaseSection compact showLabel={false} />
    </main>
  );
}
