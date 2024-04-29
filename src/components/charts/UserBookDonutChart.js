"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

import { useRecoilValue } from "recoil";
import { userDataState } from "../recoil/atom";

export default function UserBookDonutChart() {
  const userData = useRecoilValue(userDataState);

  const [series, setSeries] = useState({});

  useEffect(() => {
    const genreList = userData?.bookList?.map((book) => book.genre);
    const genreCount = genreList.reduce((acc, cur) => {
      acc[cur] = (acc[cur] || 0) + 1;
      return acc;
    }, {});

    setSeries(genreCount);
  }, [userData]);

  const options = {
    chart: {
      type: "donut",
    },
    legend: "none",
    dataLabels: {
      enabled: false,
    },
    labels: Object.keys(series),
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={Object.values(series)}
        type="donut"
      />
    </div>
  );
}
