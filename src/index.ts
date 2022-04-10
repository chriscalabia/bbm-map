/*
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
import "./style.css";

// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

let map: google.maps.Map, heatmap: google.maps.visualization.HeatmapLayer;

const axios = require("axios");

async function initMap() {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    zoom: 6.7,
    center: { lat: 14.45, lng: 120.98 },
    mapTypeId: "terrain"
  });

  const datas = await getPoints();

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: datas,
    map: map,
    radius: 5
  });

  document
    .getElementById("toggle-heatmap")!
    .addEventListener("click", toggleHeatmap);
  document
    .getElementById("change-gradient")!
    .addEventListener("click", changeGradient);
  document
    .getElementById("change-opacity")!
    .addEventListener("click", changeOpacity);
  document
    .getElementById("change-radius")!
    .addEventListener("click", changeRadius);
}

function toggleHeatmap(): void {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient(): void {
  const gradient = [
    "rgba(0, 255, 255, 0)",
    "rgba(0, 255, 255, 1)",
    "rgba(0, 191, 255, 1)",
    "rgba(0, 127, 255, 1)",
    "rgba(0, 63, 255, 1)",
    "rgba(0, 0, 255, 1)",
    "rgba(0, 0, 223, 1)",
    "rgba(0, 0, 191, 1)",
    "rgba(0, 0, 159, 1)",
    "rgba(0, 0, 127, 1)",
    "rgba(63, 0, 91, 1)",
    "rgba(127, 0, 63, 1)",
    "rgba(191, 0, 31, 1)",
    "rgba(255, 0, 0, 1)"
  ];

  const pink = ["rgba(255,105,180,0)", "rgba(255,105,180,1)"];

  heatmap.set("gradient", heatmap.get("gradient") ? pink : gradient);
}

function changeRadius(): void {
  heatmap.set("radius", heatmap.get("radius") ? 3 : 7);
}

function changeOpacity(): void {
  heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
}

// Heatmap data: 500 Points
async function getPoints() {
  const response = await axios.get(
    "https://79cqmd4vi6.execute-api.ap-southeast-2.amazonaws.com/dev/get/election/geolocation"
  );

  const data = response["data"];
  // const locations = JSON.parse(response.message);

  //console.log(aarrr["message"]);
  const latlangs = data["message"].map((item) => {
    const sp = item.latlng.trim().split(";");
    return { location: new google.maps.LatLng(sp[0], sp[1]), weight: 1000 };
  });

  //console.log(latlangs);

  return latlangs;
}
export { initMap };
