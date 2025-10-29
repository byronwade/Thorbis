import { HonestSalesHomepage } from "@/components/home/honest-sales-homepage";

export const revalidate = 900; // Revalidate every 15 minutes

const Home = () => <HonestSalesHomepage />;

export default Home;
