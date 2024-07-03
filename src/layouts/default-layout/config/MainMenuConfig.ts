import type { MenuItem } from "@/layouts/default-layout/config/types";
import { useAuthStore } from "@/stores/auth";

const store = useAuthStore();
const User = store.user;

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "dashboard",
        route: "/dashboard",
        keenthemesIcon: "chart-pie-3",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "lots",
        route: "/lots",
        keenthemesIcon: "parcel",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "valueRecords",
        route: "/valueRecords",
        keenthemesIcon: "chart-line",
        bootstrapIcon: "bi-app-indicator",
      }
    ],
  },
];

// Check if the user is an admin and add additional menu items
if (User && User.username === "admin") {
  console.log("User is admin");

  // Add admin specific menu items
  if (MainMenuConfig[0].pages) {
    MainMenuConfig[0].pages.push(
      {
        heading: "metrics",
        route: "/metrics",
        keenthemesIcon: "cube-2",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "productionsActivities",
        route: "/productionActivities",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "organizations",
        route: "/organizations",
        keenthemesIcon: "people",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "typeOfMaterials",
        route: "/typeOfMaterials",
        keenthemesIcon: "color-swatch",
        bootstrapIcon: "bi-app-indicator",
      },
    );
  }
}

export default MainMenuConfig;
