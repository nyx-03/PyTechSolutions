import Hero from "./sections/Hero/Hero";
import About from "./sections/About/About";
import Expertises from "./sections/Expertises/Expertises";
import Realisations from "./sections/Realisations/Realisations";
import Testimonials from "./sections/Testimonials/Testimonials";
import Engagements from "./sections/Engagements/Engagements";
import CallToAction from "./sections/CallToAction/CallToAction";
import Footer from "@/components/Footer/footer";

import ScrollLayout from "./ScrollLayout";

import styles from "./page.module.css";

export default function HomePage() {
  return (
    <ScrollLayout>
      <Hero />
      <About />
      <Expertises />
      <Realisations />
      <Testimonials />
      <Engagements />
      <CallToAction />
      <Footer />
    </ScrollLayout>
  );
}
