import React from "react";
import GlobalStats from "../components/GlobalStats";
import TrendingCoins from "../components/TrendingCoins";
import CryptoTable from "../components/CryptoTable";

const Home: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <CryptoTable />
      <GlobalStats />
      <TrendingCoins />
    </div>
  );
};

export default Home;
