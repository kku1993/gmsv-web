import HeroSection from "@/components/shadcn-space/blocks/hero-03/hero";

type HeroPageProps = {
  title?: string | null;
  body?: string | null;
};

// hero-03 block. The original block ships with its own navbar; this project
// uses a shared Layout header instead, so only the hero section is rendered.
const HeroPage = ({ title, body }: HeroPageProps) => {
  return (
    <main>
      <HeroSection title={title} body={body} />
    </main>
  );
};

export default HeroPage;
