import { ModernHomepage } from "@/components/home/modern-homepage";

export const revalidate = 900; // Revalidate every 15 minutes

const Home = () => <ModernHomepage />;

export default Home;
